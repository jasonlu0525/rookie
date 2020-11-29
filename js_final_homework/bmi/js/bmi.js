var form = document.querySelector('.general-form');
var input_area = document.querySelectorAll('.general-form-input');
var form_result_button = document.querySelector('#result');
var height = document.querySelector('#height');
var weight = document.querySelector('#weight');
var list = document.querySelector('#list');
var clear_all_btn = document.querySelector('#clear_all_data');
var date = new Date();
var data = JSON.parse(localStorage.getItem('bmiData')) || [];
var get_current_innerHTML = form_result_button.innerHTML;
const input_empty_check = (e) => {
    e.preventDefault();
    if (e.target.value === '') {
        alert('請輸入數字 !!');
    }
}
const count_bmi = () => {
    let weight_value = weight.value;
    let weight_str2num = parseInt(weight_value);
    let height_value = height.value;
    let height_str2num = parseInt(height_value) / 100;
    let bmi = weight_str2num / (height_str2num * height_str2num);
    console.log(Boolean(weight_str2num * height_str2num) === false); //??
    //  console.log(weight_str2num); //??
    let BMI = bmi.toFixed(2); //tofixed() reuturns a string 
    let condition;
    let color;

    switch (true) {
        case Boolean(bmi) === false: //  Boolean(NaN) -->false；NaN-->falsy
            alert('請輸入阿拉伯數字');
            weight.value = null;
            height.value = null;
            break;
        case bmi < 18.5:
            condition = '過輕';
            color = 'blue';
            break;
        case bmi >= 18.5 && bmi < 24:
            condition = '理想';
            color = 'green'
            break;
        case bmi >= 24 && bmi < 27:
            condition = '過重';
            color = 'orange'
            break;
        case bmi >= 27 && bmi < 30:
            condition = '輕度肥胖';
            color = 'orange-darken';
            break;
        case bmi >= 30 && bmi < 35:
            condition = '中度肥胖';
            color = 'orange-darken';
            break;
        case bmi >= 35:
            condition = '重度肥胖';
            color = 'red';
            break;
    }
    let return_bmi_data = {
        height: height_str2num * 100,
        weight: weight_str2num,
        bmi: BMI,
        condition: condition,
        color: color,
        date: date.getDate(), // 0~31
        month: date.getMonth() + 1, //date.getMonth() return 0~11
        year: date.getFullYear()
    };
    if (Boolean(bmi) !== false) {
        data.push(return_bmi_data); //  Using  Global variables(array):data[bmi.js:1 ] to deal with localstorage.
        localStorage.setItem('bmiData', JSON.stringify(data));
    }
    return return_bmi_data;
};

const create_el = (bmi_info) => {
    let info = bmi_info; //count_bmi回傳的物件
    console.log(Boolean(info.bmi));

    //do not push data[] to localstorage here，it will cause infinite loop.
    /*exampe:  
            data.push(bmi_condition_color); //  Using  Global variables(array):data[bmi.js:1 ] to deal with localstorage. ==>cause infinite loop while window.onload [bmi.js:105]
            localStorage.setItem('bmiData', JSON.stringify(data));  
//     */
    //   let BMI = bmi.toFixed(2);  [js:22] NaN(bmi) --toFixed--> 'NAN'

    if (list.innerHTML === inital_list_inner()) {
        list.innerHTML = null;
    }
    let list_item = document.createElement('li');
    list_item.classList.add('list');
    list_item.innerHTML = ` 
            <span class=" list-condition-color border-left-${info.color} box-shadow-${info.color} "></span>
          <h2 class="list-tittle">${info.condition}</h2>
        <div class="flex align-items-center ">
           <span class="list-subtitle">BMI</span>
             <div class="list-data">${info.bmi}</div>
   </div>
   <div class="flex align-items-center min-width-105">
   <span class="list-subtitle">weight</span>
   <div class="list-data">${info.weight}kg</div>
</div>
     <div class="flex align-items-center min-width-105">
           <span class="list-subtitle">height</span>
            <div class="list-data">${info.height}cm</div>
       </div>
        <div class="list-subtitle">${info.date}-${info.month}-${info.year}</div>
     `;
    list.appendChild(list_item);

    console.log(info.bmi !== 'NaN');
}

const inital_list_inner = () => {
    let init = list.innerHTML = `<hr>LocalStorage 目前尚無資料`;
    list.classList.add('h2', 'text-center', 'text-bold');



    return init;
}


window.addEventListener('load', () => {
    if (data.length === 0) {
        inital_list_inner();
    } else {
        for (let data_index = 0; data_index < data.length; data_index++) {
            create_el(data[data_index]);
        }
    }
}, false);
for (let class_el_index = 0; class_el_index < input_area.length; class_el_index++) {
    input_area[class_el_index].addEventListener('blur', input_empty_check, false)
};
form_result_button.addEventListener('click', (e) => {
    e.preventDefault();
    let bmi_condition_color = count_bmi();
    if (bmi_condition_color.bmi !== 'NaN') {
        create_el(bmi_condition_color);

        let triggr_el = e.target;

        let show_condition = document.createElement('p');
        show_condition.classList.add(`text-${bmi_condition_color.color}`, 'h1', 'text-bold', 'word-break-keep', 'ml-18', 'position-relative');
        show_condition.id = 'posture';
        show_condition.textContent = bmi_condition_color.condition;
        console.log(get_current_innerHTML);
        triggr_el.classList.remove('general-form-submit');
        triggr_el.setAttribute('disabled', 'disabled');
        triggr_el.parentNode.appendChild(show_condition);
        triggr_el.classList.add('general-form-reset', `border-${bmi_condition_color.color}`, `text-${bmi_condition_color.color}`, 'flex-shrink-0', 'position-relative');
        triggr_el.innerHTML = `<p class="display-1">${bmi_condition_color.bmi} <small class="d-block">BMI</small></p><div class="reset position-absolute  flex justify-content-center align-items-center bg-${bmi_condition_color.color} border-gray" data-action="reset"><img  src="img/icons_loop.png" ></div>`;

        clear_all_btn.classList.remove('d-none');

        let reset_btn = document.querySelector('.reset');
        reset_btn.addEventListener('click', (e) => {
            e.stopPropagation();
            weight.value = null;
            height.value = null;
            let posture = document.querySelector('#posture');
            form.removeChild(posture); // Remove <p> element which id was "posture". 
            form_result_button.classList.add('general-form-submit');
            form_result_button.classList.remove('general-form-reset', `border-${bmi_condition_color.color}`, `text-${bmi_condition_color.color}`, 'flex-shrink-0', 'position-relative');
            form_result_button.removeAttribute('disabled');
            form_result_button.innerHTML = get_current_innerHTML;
        }, false);
    }
}, false);



clear_all_btn.addEventListener('click', (e) => {
    e.stopPropagation();
    data = [];
    localStorage.removeItem('bmiData');
    inital_list_inner();
    clear_all_btn.classList.add('d-none');
}, false);