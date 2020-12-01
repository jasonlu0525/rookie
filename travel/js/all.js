let data = new XMLHttpRequest();

let list = document.querySelector('#list');
let list_zone_tittle = document.querySelector('#Zone-tittle');
list_zone_tittle.classList.add('text-purple');
let pagination = document.querySelector('#pagination');
let information;
let action;
let clicked_pagination_num;
let assign_data_perPage;
const data_filter = (get_condition) => { //篩選資料、分頁
    let ajax_data = information;
    let filter_data = [];
    assign_data_perPage = [];
    //過濾資料
    for (let arr_index = 0; arr_index < ajax_data.result.records.length; arr_index++) {
        //    console.log(ajax_data.result.records[arr_index].Zone);
        if (get_condition !== ajax_data.result.records[arr_index].Zone && get_condition !== 'all') { // get_condition ==>init
            continue;
        } else {
            filter_data.push(ajax_data.result.records[arr_index]);
        }
    }

    //分頁
    let get_data = 0;
    for (let index = 0; index < Math.ceil(filter_data.length / 10); index++) { // 22datas ==> 10 2
        /*取10筆*/
        let pageation_data = [];
        for (let index2 = 0; index2 < 10; index2++) {

            let data = filter_data[index2 + get_data];

            // console.log(data);
            if (Boolean(data) !== false) { //過濾、skip undefined
                pageation_data.push(data);
            } else {
                continue;
            }
        }
        get_data = get_data + 10;
        assign_data_perPage[index] = pageation_data;
    }
    console.log(assign_data_perPage);
    list_zone_tittle.textContent = get_condition;
    let pagination_page;
    let pagation_init_num;
    pagination.textContent = '';
    switch (true) {

        // pickout_data為0筆資料 需顯示第一頁的頁籤
        case assign_data_perPage.length === 0:
            pagination_page = 0;
            pagation_init_num = 1;
            break;

        case assign_data_perPage.length > 0:
            pagination_page = 1;
            pagation_init_num = 0;
            break;
    }
    for (pagination_page; pagination_page <= assign_data_perPage.length; pagination_page++) {
        let create_pagation = document.createElement('button');
        create_pagation.setAttribute('data-btn', `${pagination_page}`);
        create_pagation.setAttribute('type', 'button');
        create_pagation.classList.add('text-center', 'page-num', 'small');
        create_pagation.classList.remove('text-blue');


        create_pagation.textContent = pagation_init_num + pagination_page;
        pagination.appendChild(create_pagation);

    }
    pagination.firstElementChild.classList.add('text-blue');
    let page_num = document.querySelectorAll('.page-num');
    let clicked_pagination_num;
    console.log(page_num);
    for (let page_num_index = 0; page_num_index < page_num.length; page_num_index++) {

        page_num[page_num_index].addEventListener('click', (e) => {
            for (let clear_attribute_index = 0; clear_attribute_index < page_num.length; clear_attribute_index++) {
                page_num[clear_attribute_index].classList.remove('text-blue');
                page_num[clear_attribute_index].removeAttribute('style');
            }
            // pagination.children[page_num]
            console.log(pagination.children)

            clicked_pagination_num = e.target.dataset.btn;
            e.target.classList.add('text-blue');
            e.target.style.outline = ' 3px solid black';
            console.log(clicked_pagination_num);
            create_dom(assign_data_perPage, clicked_pagination_num);
        }, false);

    }
    let prev_page = document.querySelector('.pre-page');

    prev_page.addEventListener('click', () => {

        console.log(action);

        // page_num[action].classList.classList.remove('text-blue');
        // page_num[action].removeAttribute('style');
        // page_num[action].classList.remove('text-blue');
        // page_num[action].removeAttribute('style');
        //  page_num[clicked_pagination_num].classList.remove('text-blue');
        console.log(page_num);
      //  console.log(page_num[clicked_pagination_num].previousElementSibling);
        page_num[clicked_pagination_num || 0].removeAttribute('style');
        page_num[clicked_pagination_num || 0].previousElementSibling.classList.add('text-blue');
        page_num[clicked_pagination_num || 0].previousElementSibling.style.outline = ' 3px solid black';
        //  create_dom(assign_data_perPage, clicked_pagination_num - 1);
    }, false);
    console.log(filter_data);
    return assign_data_perPage;
}




const create_dom = (pickout_data, load_page_num_data) => {
    list.textContent = ''; //清空 childNodes
    console.log(pickout_data);
    if (pickout_data.length === 0) {
        let empty_data_prompt = document.createElement('p');
        empty_data_prompt.textContent = `目前尚無資料`;
        empty_data_prompt.style.margin = '80px auto';
        empty_data_prompt.classList.add('text-bold', 'h2');

        list.appendChild(empty_data_prompt);

        let empty_btn_shake_trigger = document.querySelector('#list p');

        pagination.addEventListener('click', (e) => {
            e.preventDefault();
            empty_btn_shake_trigger.style.animation = "shake 200ms "; // using @keyframe of cssshake.css(V.1.5.3)  github: https://github.com/elrumordelaluz/csshake
            empty_btn_shake_trigger.style.color = 'red';

        }, false);
    } else {
        for (let onepage_data_Index = 0; onepage_data_Index < pickout_data[load_page_num_data - 1].length; onepage_data_Index++) {

            let card = document.createElement('li');
            card.classList.add('card-items');
            let card_ele = `
                    <section class=" card-picture position-relative" style="background-image:url(${ pickout_data[load_page_num_data-1][onepage_data_Index].Picture1})"  alt="${pickout_data[load_page_num_data-1][onepage_data_Index].Picdescribe1}">
        
                        <div class="card-picture-tittle flex justify-content-between align-items-end">
                            <h3> ${ pickout_data[load_page_num_data-1][onepage_data_Index].Name}</h3>
                            <span class="text-bold">${ pickout_data[load_page_num_data-1][onepage_data_Index].Zone}</span>
                        </div>
        
                     </section>
                    <section class="card-info position-relative flex">
                    <div class="flex flex-dir-column justify-content-between align-items-center flex-shrink-0">
                    <img src="image/icons_clock.png"  alt="開放時間">
                    <img src="image/icons_pin.png"    alt="地址">
                    <img src="image/icons_phone.png"     alt="連絡電話">
                    </div>
                        <ul class="flex justify-content-between align-items-end flex-wrap flex-grow-1">
                           
                                <li class=" flex align-items-center text-bold mb-13 flex-basis-100" >                        
                                    <p class="text-bold ml-12 text-oneLine">${ pickout_data[load_page_num_data-1][onepage_data_Index].Opentime}</p>
                                </li>                                
                                <li class=" flex align-items-center text-bold mb-13 flex-basis-100" >                                  
                                    <p class="text-bold ml-12 text-oneLine">${ pickout_data[load_page_num_data-1][onepage_data_Index].Add}</p>
                                </li>
                                <div class="flex justify-content-between flex-basis-100" >      
                                <li class=" flex align-items-center text-bold  flex-shrink-0 "  style="margin-right:10px;">
                               
                                <a class="d-block text-bold ml-12 tex-origin" href="tel:${pickout_data[load_page_num_data-1][onepage_data_Index].Tel}">
                                ${ pickout_data[load_page_num_data-1][onepage_data_Index].Tel}
    </a>                
                            </li>
                            <li class="flex align-items-center text-bold justify-content-end flex-basis-50" >
                            <img src="image/icons_tag.png" alt="參觀門票">
                        <p class="text-bold ml-12 text-oneLine" tittle="${  pickout_data[load_page_num_data-1][onepage_data_Index].Ticketinfo||'付費參觀'} ">${  pickout_data[load_page_num_data-1][onepage_data_Index].Ticketinfo||'付費參觀'}</p>
                    </li>
                                
                                
                                </div>
                         
                         
                           
                        </ul>
                    </section>
                 `;
            card.innerHTML = card_ele;
            list.appendChild(card);
        }
    }
}
data.open('GET', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
data.send();
data.addEventListener('load', () => {
    information = JSON.parse(data.responseText);
    let filter_result = data_filter('all');
    create_dom(filter_result, 1);
    list_zone_tittle.textContent = '全部景點';

}, false);
window.addEventListener('scroll', () => {
    let go_top = document.querySelector('.go-top');

    //window.pageYOffset==>IE9.0+   document.body.scrollTop=> doesn't work on chrome,firefox.it works on safari
    let scroll_height = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    if (scroll_height > 195) {
        go_top.classList.remove('d-none');
    } else {
        go_top.classList.add('d-none');
    }
    console.log(scroll_height);
});
let popular_btn = document.querySelectorAll('.area-btn');
console.log(popular_btn);
for (let area_btn_index = 0; area_btn_index < popular_btn.length; area_btn_index++) {
    popular_btn[area_btn_index].addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation()
        let btn_value = e.target.textContent;
        let section_data_filter = data_filter(btn_value);
        create_dom(section_data_filter, 1);

    }, false);

};
let select_option = document.querySelector('#select_area');

select_option.addEventListener('change', (e) => {
    e.stopPropagation();
    let option_value = e.target.value;
    console.log(option_value);
    let option_data_filter = data_filter(option_value);
    create_dom(option_data_filter, 1);
}, false);



select_option.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.toggle('test');

}, false);