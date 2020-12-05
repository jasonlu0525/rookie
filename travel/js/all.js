let data = new XMLHttpRequest();
let list = document.querySelector('#list');
let list_zone_tittle = document.querySelector('#Zone-tittle');
let pagination = document.querySelector('#pagination');
let information;
let assign_data_perPage;
const data_filter = (get_condition) => { //篩選資料、分頁
    let ajax_data = information; // ajax:responseText
    let filter_data = [];
    let prev_page = document.querySelector('.pre-page');
    let next_page = document.querySelector('.next-page');
    assign_data_perPage = [];
    list_zone_tittle.textContent = get_condition;
    list_zone_tittle.classList.add('text-purple');
    pagination.textContent = '';
    // ↓↓↓過濾資料
    for (let arr_index = 0; arr_index < ajax_data.result.records.length; arr_index++) {
        if (get_condition !== ajax_data.result.records[arr_index].Zone && get_condition !== '全部景點') { // get_condition ==='全部景點'  ==>資料全抓；get_condition=== option的value屬性(XX區)
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
                continue;
            }
        }
        get_data = get_data + 10;
        assign_data_perPage[index] = pageation_data;
        // 結束後 pageation_data 會reset成空 array
    }
    console.log(assign_data_perPage);
    for (let pagination_page = 0; pagination_page < assign_data_perPage.length || pagination_page <= 0; pagination_page++) {
        let create_pagation = document.createElement('button');
        create_pagation.setAttribute('data-btn', `${pagination_page}`);
        create_pagation.setAttribute('type', 'button');
        create_pagation.classList.add('text-center', 'page-num', 'small');
        create_pagation.classList.remove('text-blue');
        create_pagation.textContent = pagination_page + 1;
        pagination.appendChild(create_pagation);
    }
    let page_num = document.querySelectorAll('.page-num'); // 頁碼按鈕
    console.log(page_num);
    pagination.firstChild.style.outline = ' 3px solid black';
    pagination.firstChild.classList.add('text-blue');
    prev_page.setAttribute('disabled', 'disabled');
    if (page_num.length === 1) {
        pagination.firstChild.setAttribute('disabled', 'disabled');
        next_page.setAttribute('disabled', 'disabled');
    }
    let clicked_pagination_num;
    console.log(page_num);
    for (let page_num_index = 0; page_num_index < page_num.length; page_num_index++) {
        page_num[page_num_index].addEventListener('click', (e) => {
            for (let clear_attribute_index = 0; clear_attribute_index < page_num.length; clear_attribute_index++) {
                page_num[clear_attribute_index].classList.remove('text-blue');
                page_num[clear_attribute_index].removeAttribute('style');
            }
            clicked_pagination_num = parseInt(e.target.dataset.btn); //min value : 0
            e.target.classList.add('text-blue');
            e.target.style.outline = ' 3px solid black';
            create_dom(assign_data_perPage, clicked_pagination_num);
            if (clicked_pagination_num < 1) { // 
                prev_page.setAttribute('disabled', 'disabled');
            } else {
                prev_page.removeAttribute('disabled');
            }
            if (clicked_pagination_num + 1 === page_num.length) {
                next_page.setAttribute('disabled', 'disabled');
            } else {
                next_page.removeAttribute('disabled');
            }
            if (clicked_pagination_num > 0 && clicked_pagination_num + 1 < page_num.length) {
                prev_page.removeAttribute('disabled');
                next_page.removeAttribute('disabled');
            }
        }, false);
    }
    prev_page.addEventListener('click', (e) => {
        if (clicked_pagination_num > 0) {
            let prev_pagination_num = clicked_pagination_num - 1;
            create_dom(assign_data_perPage, prev_pagination_num);
            page_num[prev_pagination_num].classList.add('text-blue');
            page_num[prev_pagination_num].style.outline = ' 3px solid black';
            page_num[clicked_pagination_num].classList.remove('text-blue');
            page_num[clicked_pagination_num].removeAttribute('style');
        }
        if (clicked_pagination_num === 1) {
            e.target.setAttribute('disabled', 'disabled');
        } else {
            e.target.removeAttribute('disabled');
        }
        if (clicked_pagination_num + 1 === page_num.length) {
            next_page.removeAttribute('disabled');
        }
        clicked_pagination_num = clicked_pagination_num - 1;
    }, false);
    next_page.addEventListener('click', (e) => {
        // ↓↓↓ 如果 沒有先按頁碼在按下一頁，這時clicked_pagination_num 是undefined ，於是強制將clicked_pagination_num 賦予 "初始直" 0，並且 重新render  畫面 (p.s if條件式只會執行1次)
        if (Boolean(clicked_pagination_num) === false && page_num.length > 1 && assign_data_perPage.length > 2) {
            clicked_pagination_num = 0;
            create_dom(assign_data_perPage, clicked_pagination_num);
            prev_page.removeAttribute('disabled');
        }
        //先按頁碼之後在 按下一頁
        if (clicked_pagination_num < page_num.length && assign_data_perPage.length !== 0 && assign_data_perPage.length > 2) {
            let next_pagination_num = clicked_pagination_num + 1; //min: 1
            create_dom(assign_data_perPage, next_pagination_num);
            page_num[next_pagination_num].classList.add('text-blue');
            page_num[next_pagination_num].style.outline = ' 3px solid black';
            page_num[next_pagination_num].previousElementSibling.classList.remove('text-blue');
            page_num[next_pagination_num].previousElementSibling.removeAttribute('style');
            clicked_pagination_num = clicked_pagination_num + 1;
        }
        if (clicked_pagination_num + 1 === page_num.length) {
            e.target.setAttribute('disabled', 'disabled');
        }
    }, false);
    return assign_data_perPage;
}
const create_dom = (pickout_data, load_page_num_data) => {
    list.textContent = ''; //清空 childNodes
    if (pickout_data.length === 0) { // || load_page_num_data <= 0
        let empty_data_prompt = document.createElement('p');
        empty_data_prompt.textContent = `目前尚無資料`;
        empty_data_prompt.style.margin = '80px auto';
        empty_data_prompt.classList.add('text-bold', 'h2');
        list.appendChild(empty_data_prompt);
        let empty_btn_shake_trigger = document.querySelector('#list p');
        console.log(empty_btn_shake_trigger);
        empty_btn_shake_trigger.style.animation = "shake 200ms "; // using @keyframe of cssshake.css(V.1.5.3)  github: https://github.com/elrumordelaluz/csshake
        empty_btn_shake_trigger.style.color = 'red';
    } else {
        for (let onepage_data_Index = 0; onepage_data_Index < pickout_data[load_page_num_data].length; onepage_data_Index++) {
            let card = document.createElement('li');
            card.classList.add('card-items');
            card.setAttribute('data-order', onepage_data_Index);
            let card_ele = `  
                <section class=" card-picture position-relative"
                    style="background-image:url(${ pickout_data[load_page_num_data][onepage_data_Index].Picture1})"
                    alt="${pickout_data[load_page_num_data][onepage_data_Index].Picdescribe1}">

                        <div class="card-picture-tittle flex justify-content-between align-items-end">
                            <h3> ${ pickout_data[load_page_num_data][onepage_data_Index].Name}</h3>
                            <span class="text-bold">${ pickout_data[load_page_num_data][onepage_data_Index].Zone}</span>
                        </div>

                </section>
                <section class="card-info position-relative flex">
                        <div class="flex flex-dir-column justify-content-between align-items-center flex-shrink-0" id="card-icons">
                            <img src="image/icons_clock.png" alt="開放時間">
                            <img src="image/icons_pin.png" alt="地址">
                            <img src="image/icons_phone.png" alt="連絡電話">
                        </div>
                        <ul class="flex justify-content-between align-items-end flex-wrap flex-grow-1">

                            <li class=" flex align-items-center text-bold mb-13 flex-basis-100">
                                <p class="text-bold ml-12 text-oneLine" id="opentime">${ pickout_data[load_page_num_data][onepage_data_Index].Opentime}</p>
                            </li>
                            <li class=" flex align-items-center text-bold mb-13 flex-basis-100">
                                <p class="text-bold ml-12 text-oneLine" id="location">${ pickout_data[load_page_num_data][onepage_data_Index].Add}</p>
                            </li>
                            <div class="flex justify-content-between flex-basis-100">
                                <li class=" flex align-items-center text-bold  flex-shrink-0 " style="margin-right:10px;">
                                    <a class="d-block text-bold ml-12 text-oneLine" href="tel:${pickout_data[load_page_num_data][onepage_data_Index].Tel}" id="phone">
                                    ${pickout_data[load_page_num_data][onepage_data_Index].Tel}
                                    </a>
                                </li>
                                <li class="flex align-items-center text-bold justify-content-end flex-basis-50">
                                    <img src="image/icons_tag.png" alt="參觀門票">
                                    <p class="text-bold ml-12 text-oneLine" tittle="${pickout_data[load_page_num_data][onepage_data_Index].Ticketinfo||'付費參觀'}" id="ticket-info">
                                    ${pickout_data[load_page_num_data][onepage_data_Index].Ticketinfo||'付費參觀'}</p>
                                </li>
                            </div>
                        </ul>
                </section>
                 `;
            card.innerHTML = card_ele;
            list.appendChild(card);
        }
        let card_items = document.querySelectorAll('.card-items');
        for (let card_items_index = 0; card_items_index < card_items.length; card_items_index++) {
            card_items[card_items_index].addEventListener('click', () => {
                let data_order_value = card_items[card_items_index].dataset.order;
                document.querySelector(` #list li[data-order="${data_order_value}"] .card-picture-tittle h3`).classList.toggle('text-oneLine');;
                console.log(data_order_value)
                document.querySelector(`.card-items[data-order="${data_order_value}"] #opentime`).classList.toggle('text-oneLine');
                document.querySelector(`.card-items[data-order="${data_order_value}"] #location`).classList.toggle('text-oneLine');
                document.querySelector(`.card-items[data-order="${data_order_value}"] #phone`).classList.toggle('text-oneLine');
                document.querySelector(`.card-items[data-order="${data_order_value}"] #ticket-info`).classList.toggle('text-oneLine');
            }, false);
        }
    }
}
data.open('GET', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
data.send();
data.addEventListener('load', () => {
    information = JSON.parse(data.responseText);
}, false);
window.addEventListener('load', () => {
    let filter_result = data_filter('全部景點');
    create_dom(filter_result, 0);
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
select_option.addEventListener('input', (e) => {
    let option_value = e.target.value;
    let option_data_filter = data_filter(option_value);
    create_dom(option_data_filter, 0);
}, false);
select_option.addEventListener('click', (e) => {
e.target.classList.toggle('arrow-up');
}, false);
let popular_btn = document.querySelectorAll('.area-btn');
for (let area_btn_index = 0; area_btn_index < popular_btn.length; area_btn_index++) {
    popular_btn[area_btn_index].addEventListener('click', (e) => {
        let btn_value = e.target.textContent;
        let section_data_filter = data_filter(btn_value);
        create_dom(section_data_filter, 0);
    }, false);
};