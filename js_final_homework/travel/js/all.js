let data = new XMLHttpRequest();

let list = document.querySelector('#list');
let list_zone_tittle = document.querySelector('#Zone-tittle');
let pagination = document.querySelector('#pagination');
let information;
const data_filter = (get_condition) => { //篩選資料、分頁
    let ajax_data = information;
    let filter_data = [];
    let assign_data_perPage = [];
    for (let arr_index = 0; arr_index < ajax_data.result.records.length; arr_index++) {
        //    console.log(ajax_data.result.records[arr_index].Zone);
        if (get_condition !== ajax_data.result.records[arr_index].Zone && get_condition !== 'all') { // get_condition ==>init
            continue;
        } else {
            filter_data.push(ajax_data.result.records[arr_index]);
        }
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

    }
    // .result.records[]
    list_zone_tittle.textContent = get_condition;
    let pagination_page;
    let pagation_init_num;
    switch (true) {
        //pickout_data為0筆資料 需顯示第一頁的頁籤
        case assign_data_perPage.length === 0:
            pagination_page = 0
            pagation_init_num = 1;
            break;

        case assign_data_perPage.length > 0:
            pagination_page = 1;
            pagation_init_num = 0;
            break;
        default:
            alert('123');
            break;
    }
    for (pagination_page; pagination_page <= assign_data_perPage.length; pagination_page++) {
        let create_pagation = document.createElement('button');
        create_pagation.setAttribute('data-btn', `${pagination_page}`);
        create_pagation.classList.add('text-center');
        create_pagation.setAttribute('type', 'button');
        create_pagation.textContent = pagation_init_num + pagination_page;
        pagination.appendChild(create_pagation);
    }
    return assign_data_perPage;
}

const create_dom = (pickout_data) => {
    list.textContent = ''; //清空 childNodes
    pagination.textContent = '';
    console.log(pickout_data);
    for (let arr_index = 0; arr_index < pickout_data.length; arr_index++) {
        for (let onepage_data_Index = 0; onepage_data_Index < pickout_data[arr_index].length; onepage_data_Index++) {
            let card = document.createElement('li');
            card.classList.add('card-items');
            let card_ele = `
                <section class=" card-picture position-relative" style="background-image:url(${ pickout_data[arr_index][onepage_data_Index].Picture1})"  alt="${ pickout_data[arr_index][onepage_data_Index].Picdescribe1}">
    
                    <div class="card-picture-tittle flex justify-content-between align-items-end">
                        <h3> ${ pickout_data[arr_index][onepage_data_Index].Name}</h3>
                        <span class="text-bold">${  pickout_data[arr_index][onepage_data_Index].Zone}</span>
                    </div>
    
                 </section>
                <section class="card-info position-relative">
                    <ul class="flex justify-content-between align-items-end">
                        <div>
                            <li class=" flex align-items-center text-bold mb-13">
                                <img src="image/icons_clock.png" alt="開放時間">
                                <p class="text-bold ml-12 text-oneLine">${  pickout_data[arr_index][onepage_data_Index].Opentime}</p>
                            </li>
                            <li class=" flex align-items-center text-bold mb-13">
                                <img src="image/icons_pin.png" alt="地址">
                                <p class="text-bold ml-12 text-oneLine">${  pickout_data[arr_index][onepage_data_Index].Add}</p>
                            </li>
                            <li class=" flex align-items-center text-bold ">
                                <img src="image/icons_phone.png" alt="連絡電話">
                                <a class="d-block text-bold ml-12 tex-origin" href="tel:${ pickout_data[arr_index][onepage_data_Index].Tel}">
                                ${ pickout_data[arr_index][onepage_data_Index].Tel}
    </a>                
                            </li>
                        </div>
                        <li class="flex align-items-center text-bold ">
                            <img src="image/icons_tag.png" alt="參觀門票">
                        <p class="text-bold ml-12">${  pickout_data[arr_index][onepage_data_Index].Ticketinfo}</p>
                    </li>
                    </ul>
                </section>
             `;
            card.innerHTML = card_ele;
            list.appendChild(card);
        }
    }
    // let pagination_page;
    // let pagation_init_num;
    // switch (true) {
    //     //pickout_data為0筆資料 需顯示第一頁的頁籤
    //     case pickout_data.length === 0:
    //         pagination_page = 0
    //         pagation_init_num = 1;
    //         break;

    //     case pickout_data.length > 0:
    //         pagination_page = 1;
    //         pagation_init_num = 0;
    //         break;
    // }
    // for (pagination_page; pagination_page <= pickout_data.length; pagination_page++) {
    //     let create_pagation = document.createElement('button');
    //     create_pagation.setAttribute('data-btn', `${pagination_page}`);
    //     create_pagation.classList.add('text-center');
    //     create_pagation.setAttribute('type', 'button');
    //     create_pagation.textContent = pagation_init_num + pagination_page;
    //     pagination.appendChild(create_pagation);
    // }

}
//    console.log(ajax_data.result.records[arr_index].Zone);

data.open('GET', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
//data.setRequestHeader('Content-Type', 'application/json');
data.send();
data.addEventListener('load', () => {
    information = JSON.parse(data.responseText);
    let filter_result = data_filter('all');
    create_dom(filter_result);
    list_zone_tittle.textContent = '全部景點';

}, false);


let popular_btn = document.querySelectorAll('.area-btn');
console.log(popular_btn);
for (let area_btn_index = 0; area_btn_index < popular_btn.length; area_btn_index++) {
    popular_btn[area_btn_index].addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation()
        let btn_value = e.target.textContent;
        let section_data_filter = data_filter(btn_value);
        create_dom(section_data_filter);

    }, false);

};

let select_option = document.querySelector('#select_area');
select_option.addEventListener('change', (e) => {
    let option_value = e.target.value;
    console.log(option_value);
    let option_data_filter = data_filter(option_value);
    create_dom(option_data_filter);
}, false);




















// const createDOM = (get_condition) => {
//     let ajax_data = information;
//     list.textContent = ''; //清空html
//     list_zone_tittle.textContent = get_condition;
//     console.log(get_condition);
//     let filter_data = [];
//     let assign_data_perPage = [];

//     console.log(data)
//     for (let arr_index = 0; arr_index < ajax_data.result.records.length; arr_index++) {
//         //    console.log(ajax_data.result.records[arr_index].Zone);
//         if (get_condition !== ajax_data.result.records[arr_index].Zone && get_condition !== 'all') { // get_condition ==>init
//             continue;
//         } else {
//             filter_data.push(ajax_data.result.records[arr_index]);
//             let card = document.createElement('li');
//             card.classList.add('card-items');
//             let card_ele = `

//             <section class=" card-picture position-relative" style="background-image:url(${ajax_data.result.records[arr_index].Picture1})"  alt="${ajax_data.result.records[arr_index].Picdescribe1}">

//                 <div class="card-picture-tittle flex justify-content-between align-items-end">
//                     <h3> ${ajax_data.result.records[arr_index].Name}</h3>
//                     <span class="text-bold">${ajax_data.result.records[arr_index].Zone}</span>
//                 </div>

//              </section>
//             <section class="card-info position-relative">
//                 <ul class="flex justify-content-between align-items-end">
//                     <div>
//                         <li class=" flex align-items-center text-bold mb-13">
//                             <img src="image/icons_clock.png" alt="開放時間">
//                             <p class="text-bold ml-12 text-oneLine">${ajax_data.result.records[arr_index].Opentime}</p>
//                         </li>
//                         <li class=" flex align-items-center text-bold mb-13">
//                             <img src="image/icons_pin.png" alt="地址">
//                             <p class="text-bold ml-12 text-oneLine">${ajax_data.result.records[arr_index].Add}</p>
//                         </li>
//                         <li class=" flex align-items-center text-bold ">
//                             <img src="image/icons_phone.png" alt="連絡電話">
//                             <a class="d-block text-bold ml-12 tex-origin" href="tel:${ajax_data.result.records[arr_index].Tel}">
//                             ${ajax_data.result.records[arr_index].Tel}
// </a>

//                         </li>
//                     </div>
//                     <li class="flex align-items-center text-bold ">
//                         <img src="image/icons_tag.png" alt="參觀門票">
//                     <p class="text-bold ml-12">${ajax_data.result.records[arr_index].Ticketinfo}</p>
//                 </li>
//                 </ul>
//             </section>
//          `;
//             card.innerHTML = card_ele;
//             //資料路徑:  [variable].result.records[index]
//             list.appendChild(card);
//         }
//     }
//     console.log(Math.ceil(filter_data.length / 10));
//     // if ((filter_data.length / 10) <= 1) { //計算撈出來的資料要分多少頁， 一頁10筆，若沒有資料，頁數最多一頁
//     //     assign_data_perPage.length = 1;
//     // } else if ((filter_data.length / 10) > 1) {
//     //     assign_data_perPage.length = ;
//     // }
//     /*做3次 */
//     let get_data = 0;

//     for (let index = 0; index < Math.ceil(filter_data.length / 10); index++) { // 22datas ==> 10 2
//         /*取10筆*/
//         let pageation_data = [];
//         for (let index2 = 0; index2 < 10; index2++) {

//             let data = filter_data[index2 + get_data];

//             // console.log(data);
//             if (Boolean(data) !== false) { //過濾undefined
//                 pageation_data.push(data);
//             } else {
//                 continue;
//             }
//         }
//         get_data = get_data + 10;
//         assign_data_perPage[index] = pageation_data;
//     }
//     console.log(assign_data_perPage);
// }