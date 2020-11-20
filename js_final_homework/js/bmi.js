var input_area = document.querySelectorAll('.general-form-input');
var form_result_button = document.querySelector('#result');
var height = document.querySelector('#height');
var weight = document.querySelector('#weight');
var list = document.querySelector('#list');
var data = JSON.parse(localStorage.getItem('BMI')) || [];
window.addEventListener('load', () => {
    if (data.length === 0) {
        list.innerHTML = `<hr></hr> LocalStorage 目前尚無資料`;
        list.classList.add('h2', 'text-center', 'text-bold');
    }


}, false)





const input_empty_check = (e) => {
    if (e.target.value === '') {
        alert('請輸入數字 !!');
    }
}
const count_bmi = () => {
    let weight_str2num = parseInt(weight.value);
    let height_str2num = parseInt(height.value) / 100;
    let bmi = weight_str2num / (height_str2num * height_str2num);
    //  console.log(bmi);
    return parseInt(bmi.toFixed(2)); //tofixed() reuturns a string 
}
const judge_bmi = () => {
    let BMI = count_bmi();
    let condition;
    let color;
    switch (BMI) {
        default:
            alert('error');
            console.log(condition);
            break;
        case BMI < 18.5:
            condition = '體重過輕';
            color = 'blue';
            break;
        case BMI >= 18.5 && BMI < 24:
            condition = '正常範圍';
            break;
        case BMI >= 24 && BMI < 27:
            condition = '過重';
            break;
        case BMI >= 27 && BMI < 30:
            condition = '輕度肥胖';
            break;
        case BMI >= 30 && BMI < 35:
            condition = '中度肥胖';
            break;
        case BMI >= 35:
            condition = '重度肥胖';
            console.log(condition);
            break;

    }

    var result = {
        condition: condition,
        color: color
    };
    console.log(condition);
    return result;
};

const create_el = () => {
    let list_item = document.createElement('li');

}


for (let class_el_index = 0; class_el_index < input_area.length; class_el_index++) {
    input_area[class_el_index].addEventListener('blur', (e) => {
        e.preventDefault();
        input_empty_check(e);
    }), false;
}
form_result_button.addEventListener('click', () => {
    count_bmi();
    judge_bmi();

    console.log(judge_bmi());
}, false);
//localStorage.setItem("BMI", "1");