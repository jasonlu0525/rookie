let data = new XMLHttpRequest();
let list = document.querySelector('#list');
let list_zone_tittle = document.querySelector('#Zone-tittle');
list_zone_tittle.classList.add('text-purple');
let pagination = document.querySelector('#pagination');
let information;
let action;
let clicked_pagination_num;
let assign_data_perPage;
let prev_page = document.querySelector('.pre-page');
let next_page = document.querySelector('.next-page');
const data_filter = (get_condition) => { //篩選資料、分頁
    let ajax_data = information; // ajax:responseText
    let filter_data = [];
    assign_data_perPage = [];
    // ↓↓↓過濾資料
    for (let arr_index = 0; arr_index < ajax_data.result.records.length; arr_index++) {
        if (get_condition !== ajax_data.result.records[arr_index].Zone && get_condition !== 'all') { // get_condition ==='all'  ==>資料全抓；get_condition=== option的value屬性(XX區)
            continue;
        } else {
            filter_data.push(ajax_data.result.records[arr_index]);
        }
    }
    // ↓↓↓分頁
    let get_data = 0;
    for (let index = 0; index < Math.ceil(filter_data.length / 10); index++) { // 分幾頁?，ex:22 datas==>2頁
        /*取10筆*/
        let pageation_data = [];
        for (let index2 = 0; index2 < 10; index2++) { //22 datas==> 10,10,2 ,variable "pageation_data" would be :  [[0~9],[0~9],[0~1]]
            let data = filter_data[index2 + get_data];
            // ↓↓↓ 過濾、skip undefined.  ex: 22 datas=> [[0~9],[0~9],[0,1,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,]]
            if (Boolean(data) !== false) {
                pageation_data.push(data);
            } else {
                continue; //
            }
        }
        get_data = get_data + 10;
        assign_data_perPage[index] = pageation_data;
        // 結束後 pageation_data 會reset成空 array
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
    pagination.firstElementChild.style.outline = ' 3px solid black';
    let page_num = document.querySelectorAll('.page-num');
    if (assign_data_perPage.length === 0) {
        page_num[0].setAttribute('disabled', 'disabled');
    }
    let clicked_pagination_num;
    console.log(page_num);
    for (let page_num_index = 0; page_num_index < page_num.length; page_num_index++) {
        page_num[page_num_index].addEventListener('click', (e) => {
            for (let clear_attribute_index = 0; clear_attribute_index < page_num.length; clear_attribute_index++) {
                page_num[clear_attribute_index].classList.remove('text-blue');
                page_num[clear_attribute_index].removeAttribute('style');
            }
            prev_page.classList.remove('text-gray-lighten');
            clicked_pagination_num = parseInt(e.target.dataset.btn); //min value : 1
            e.target.classList.add('text-blue');
            e.target.style.outline = ' 3px solid black';
            create_dom(assign_data_perPage, clicked_pagination_num);
            if (clicked_pagination_num === 1 || assign_data_perPage.length === 0) {
                prev_page.classList.add('text-gray-lighten');
            } else {
                prev_page.classList.remove('text-gray-lighten');
            }
            if (clicked_pagination_num === page_num.length || assign_data_perPage.length === 0) {
                next_page.classList.add('text-gray-lighten');
            } else {
                next_page.classList.remove('text-gray-lighten');
            }
        }, false);

    }
    prev_page.classList.add('text-gray-lighten');
    prev_page.addEventListener('click', (e) => {
        if (clicked_pagination_num > 1) {
            let prev_pagination_num = parseInt(clicked_pagination_num) - 1;
            create_dom(assign_data_perPage, prev_pagination_num);
            page_num[prev_pagination_num - 1].classList.add('text-blue');
            page_num[prev_pagination_num - 1].style.outline = ' 3px solid black';
            page_num[prev_pagination_num].classList.remove('text-blue');
            page_num[prev_pagination_num].removeAttribute('style');
            clicked_pagination_num = clicked_pagination_num - 1;
        }
        if (clicked_pagination_num === 1) {
            e.target.classList.add('text-gray-lighten');
        }
        if (clicked_pagination_num < page_num.length) {
            next_page.classList.remove('text-gray-lighten');
        }
    }, false);
    next_page.addEventListener('click', (e) => {
        //    prev_page.classList.remove('text-gray-lighten');
        // ↓↓↓ 如果 沒有先按頁碼在按下一頁，這時clicked_pagination_num 是undefined ，於是強制將clicked_pagination_num 賦予 "初始直" 1，並且 重新render  畫面 (p.s if條件式只會執行1次)
        if (Boolean(clicked_pagination_num) === false && page_num.length > 1 && assign_data_perPage.length > 2) {
            clicked_pagination_num = 1;
            create_dom(assign_data_perPage, clicked_pagination_num);
        }
        //先按頁碼之後在 按下一頁
        if (clicked_pagination_num < page_num.length && assign_data_perPage.length !== 0 && assign_data_perPage.length > 2) {
            let next_pagination_num = clicked_pagination_num + 1; //2
            create_dom(assign_data_perPage, next_pagination_num);
            page_num[clicked_pagination_num].classList.add('text-blue');
            page_num[clicked_pagination_num].style.outline = ' 3px solid black';
            page_num[clicked_pagination_num].previousElementSibling.classList.remove('text-blue');
            page_num[clicked_pagination_num].previousElementSibling.removeAttribute('style');
            prev_page.classList.remove('text-gray-lighten');
            clicked_pagination_num = clicked_pagination_num + 1;
        }
        if (clicked_pagination_num >= page_num.length) {
            e.target.classList.add('text-gray-lighten');
        } else if (assign_data_perPage.length === 0) {
            prev_page.classList.add('text-gray-lighten');
        }
    }, false);
    if (page_num.length === 1) {
        next_page.classList.add('text-gray-lighten');
        next_page.removeEventListener('click', create_dom);
        prev_page.removeEventListener('click', create_dom);

    }
    return assign_data_perPage;
}
const create_dom = (pickout_data, load_page_num_data) => {
    list.textContent = ''; //清空 childNodes

    if (pickout_data.length === 0 || load_page_num_data <= 0) {
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
}, false);
window.addEventListener('load', () => {
    let filter_result = data_filter('all');
    create_dom(filter_result, 1);
    list_zone_tittle.textContent = '全部景點';
}, false);
window.addEventListener('scroll', () => {
    let go_top = document.querySelector('.go-top');
    //window.pageYOffset==>IE9.0+   document.body.scrollTop=> doesn't work on chrome,firefox but it works on safari
    let scroll_height = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (scroll_height > 195) {
        go_top.classList.remove('d-none');
    } else {
        go_top.classList.add('d-none');
    }
});
let select_option = document.querySelector('#select_area');
select_option.addEventListener('change', (e) => {
    e.stopPropagation();
    let option_value = e.target.value;
    let option_data_filter = data_filter(option_value);
    create_dom(option_data_filter, 1);
}, false);
let popular_btn = document.querySelectorAll('.area-btn');
for (let area_btn_index = 0; area_btn_index < popular_btn.length; area_btn_index++) {
    popular_btn[area_btn_index].addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let btn_value = e.target.textContent;
        let section_data_filter = data_filter(btn_value);
        create_dom(section_data_filter, 1);
    }, false);
};