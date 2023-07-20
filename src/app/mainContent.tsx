'use client'

import styles from './mainContent.module.css'
import {useEffect} from "react";
import {usePathname} from "next/navigation";

export default function MainContent() {
    const pathname = usePathname();
    const token = 'z8aAJDmdkZOGY4v1uSW_gdAa3NwAdVilQRToRGMLQcyH6pHRdVpEjtyyK6fCtajL5yGzoCXfI7kk5Ow5G9TwHkh_iEjAEEl_5EyP54BdEHeZ8whoiA6jrXSqg_F-tmB5Ubktv9reqn7u6MepgoNeElmhWStIG6sOQzPu4M9odzGhrLMN5EinujiJZHeeVd2ZjmrYi_XYW0nuIPzXlSD0f0Enmr6qkt-P8JkZtP-f0FyKEFFcu5NcgSQdwyaQs0t0xFkFJAKsYVdiLy1YmJpPOBxC6h4H-Jy5jAW_CJQ-4MzaTd0NA54E0Wl_okxNY9kFRPhQg4geOJ2J_pIA95mw8vNnex4q9W3UubBx-_lkGtomObVvaul0249ewxQUmbEy0mrhG3Zvxgf-kLI_rpmCKHJ4VJlBth0nN5XyE6B8YSOdNUXmWPVP8rkC9xjKt3v7lNuTuqKA6Av-IFJeUGWtm4Um4_4LGJE54r8PhlfnIWAwI9Xx';

    // api requests
    // START
    async function getAllRecords() {
        let result;

        await fetch('https://api.planfact.io/api/v1/operationcategories?paging.limit=100', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-APIKey': token,
            }
        }).then(function(response) {
            return response.json();
        }).then(function(responseJSON) {
            if(responseJSON.isSuccess) {
                result = responseJSON.data.items;
            }
            else
                alert(responseJSON.errorMessage);
        });

        return result;
    }   // GET-request

    async function editRecord(id, fields) {
        await fetch(`https://api.planfact.io/api/v1/operationcategories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(fields),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-APIKey': token,
            }
        }).then(function(response) {
            return response.json();
        }).then(function(responseJSON) {
            if (responseJSON.isSuccess) {
                document.body.removeChild(document.getElementsByClassName("editWindow")[0]);
                reloadMC();
            }
            else
                alert(responseJSON.errorMessage);
        });
    } // PUT-request

    async function createRecord(fields) {
        await fetch(`https://api.planfact.io/api/v1/operationcategories`, {
            method: 'POST',
            body: JSON.stringify(fields),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-APIKey': token,
            }
        }).then(function(response) {
            return response.json();
        }).then(function(responseJSON) {
            if (responseJSON.isSuccess) {
                document.body.removeChild(document.getElementsByClassName("editWindow")[0]);
                reloadMC();
            }
            else
                alert(responseJSON.errorMessage);
        });
    } // POST-request

    async function deleteRecord(id: number) {
        await fetch(`https://api.planfact.io/api/v1/operationcategories/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-APIKey': token,
            }
        }).then(function(response) {
            return response.json();
        }).then(function(responseJSON) {
            if (responseJSON.isSuccess) {
                reloadMC();
            }
            else
                alert(responseJSON.errorMessage);
        });
    }   // DELETE-request
    // END
    // api requests

    // rendering
    // START
    async function getTheTree(id: number) {
        let result = await getAllRecords();

        let rdyToRender = [];
        let newGen = [];
        let helper = [];
        let gens = [];
        let k = 0;

        let main = result.find(item =>
            item.operationCategoryId == id);
        gens.push([main]);

        while(true) {
            for (let i = 0; i < gens[k].length; i++) {
                newGen = newGen.concat(result.filter(item =>
                    item.parentOperationCategoryId == gens[k][i].operationCategoryId &&
                    item.isVisible));
            }

            if (newGen.length == 0) break;
            gens.push(newGen);
            newGen = [];
            k++;
        }

        for (let i = 1; i < gens.length; i++) {
            for (let j = 0; j < gens[i].length; j++) {
                let parentCategory = rdyToRender.find(item =>
                    gens[i][j].parentOperationCategoryId == item.article.operationCategoryId);
                let parentCategoryIndex = rdyToRender.indexOf(parentCategory);

                helper = rdyToRender;
                rdyToRender = helper.slice(0, parentCategoryIndex + 1);
                rdyToRender.push({ article: gens[i][j], generation: i - 1 });

                if (helper.length - rdyToRender.length >= 0) {
                    rdyToRender = rdyToRender.concat(helper.slice(parentCategoryIndex + 1));
                }
            }
        }

        return rdyToRender;
    }   // getting the object list from specified id

    function buttons(element) {
        const newElement = document.createElement("div");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        editButton.innerHTML = "<svg width=\"22px\" height=\"22px\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "<path d=\"M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z\" stroke=\"#000000\" strokeWidth=\"1.5\" strokeLinecap=\"round\" strokeLinejoin=\"round\"/>\n" +
            "<path d=\"M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13\" stroke=\"#000000\" strokeWidth=\"1.5\" strokeLinecap=\"round\" strokeLinejoin=\"round\"/>\n" +
            "</svg>\n" +
            "</button>"
        editButton.onclick = function() { showEditWindow(element.article.operationCategoryId) };

        deleteButton.innerHTML = "<svg width=\"22px\" height=\"22px\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "<path d=\"M4 7H20\" stroke=\"#000000\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"/>\n" +
            "<path d=\"M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7\" stroke=\"#000000\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"/>\n" +
            "<path d=\"M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z\" stroke=\"#000000\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"/>\n" +
            "</svg>\n" +
            "</button>"
        deleteButton.onclick = function() { del(element.article.operationCategoryId) };

        newElement.appendChild(editButton);
        newElement.appendChild(deleteButton);

        return newElement;
    }   // returns buttons for rendering records

    async function drawRecords() {
        let array = await getTheTree(document.getElementsByClassName('activeTab')[0].id);

        const parentElement = document.getElementById("main");
        let divs = [];

        for (let i = 0; i < array.length; i++) {
            const newElement = document.createElement("div");

            newElement.innerText = array[i].article['title'];
            newElement.className = "record";

            newElement.style.marginLeft = `${20*(array[i].generation)}px`;
            newElement.style.width = `calc(600px - ${20*(array[i].generation)}px)`;

            newElement.appendChild(buttons(array[i]));
            divs.push(newElement);
        }

        for (let i = 0; i < divs.length; i++) {
            parentElement.appendChild(divs[i]);
        }
    }   // rendering records

    function reloadMC() {
        let parent = document.getElementById('main');
        while (parent.firstChild) {
            parent.removeChild(parent.lastChild);
        }

        drawRecords();
    } // re-rendering #main on changing route
    // END
    // rendering

    // functioning of the site
    // START
    async function showEditWindow(id: number) {
        if (document.getElementsByClassName('editWindow').length == 0) {

            const newElement = document.createElement("div");
            let tabs = [['5899680', 'Доходы'], ['5899687', 'Расходы'], ['5899640', 'Активы'], ['5899663', 'Обязательства'], ['5899675','Капитал']];

            newElement.className = "editWindow";
            newElement.innerHTML = "<p align=\"center\" id='h'>Изменение учетной статьи</p>" +
                "<div class='content'>" +
                "<div class='char'>" +
                "<p>Раздел:</p>" +
                "<select id='1'>" +
                "</select>" +
                "</div>" +
                "<div class='char'>" +
                "<p>Относится к:</p>" +
                "<select id='2'>" +
                "</select>" +
                "</div>" +
                "<div class='char'>" +
                "<p>Название:</p>" +
                "<input type='text' id='3'>" +
                "</div>" +
                "<div class='svg'>\n" +
                "<button id='checkMark'>" +
                "<svg fill=\"#097d91\" height=\"20px\" width=\"20px\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 50 50\" enable-background=\"new 0 0 50 50\" xml:space=\"preserve\">" +
                "<path d=\"M40.267,14.628L20.974,33.921l-9.293-9.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l10,10 c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293l20-20c0.391-0.391,0.391-1.023,0-1.414S40.657,14.237,40.267,14.628z\"/></svg>" +
                "</button>" +
                "<button onClick={document.body.removeChild(document.getElementsByClassName(\"editWindow\")[0])}>" +
                "<svg width=\"20px\" height=\"20px\" viewBox=\"0 0 24 24\" fill=\"#097d91\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                "<path d=\"M6 6L18 18\" stroke=\"#097d91\" stroke-linecap=\"round\"/>\n" +
                "<path d=\"M18 6L6.00001 18\" stroke=\"#097d91\" stroke-linecap=\"round\"/>\n" +
                "</svg>" +
                "</button>" +
                "</div>" +
                "</div>";

            document.body.appendChild(newElement);

            for (let i = 0; i < 5; i++) {
                let newOption = document.createElement("option");

                newOption.innerText = tabs[i][1];
                newOption.selected = document.getElementsByClassName('activeTab')[0].innerHTML.includes(tabs[i][1]);
                newOption.value = tabs[i][0];

                document.getElementById('1').appendChild(newOption);
            }

            fillField2(id);
            document.getElementById('1').onclick = function () {fillField2(null); fillField3(null)};
            document.getElementById('checkMark').onclick = function() {admitEdition(id)};
            await fillField3(id);

            document.getElementById('h').innerHTML += `<br>"${document.getElementById('3').value}"`;
        }
    } // shows edition window

    async function showCreateWindow() {
        if (document.getElementsByClassName('editWindow').length == 0) {
            const newElement = document.createElement("div");
            let tabs = [['5899680', 'Доходы'], ['5899687', 'Расходы'], ['5899640', 'Активы'], ['5899663', 'Обязательства'], ['5899675','Капитал']];

            newElement.className = "editWindow";
            newElement.innerHTML = "<p align=\"center\" id='h'>Создание учетной статьи</p>" +
                "<div class='content'>" +
                "<div class='char'>" +
                "<p>Раздел:</p>" +
                "<select id='1'>" +
                "</select>" +
                "</div>" +
                "<div class='char'>" +
                "<p>Относится к:</p>" +
                "<select id='2'>" +
                "</select>" +
                "</div>" +
                "<div class='char'>" +
                "<p>Название:</p>" +
                "<input type='text' id='3'>" +
                "</div>" +
                "<div class='svg'>\n" +
                "<button id='checkMark'>" +
                "<svg fill=\"#097d91\" height=\"20px\" width=\"20px\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 50 50\" enable-background=\"new 0 0 50 50\" xml:space=\"preserve\">" +
                "<path d=\"M40.267,14.628L20.974,33.921l-9.293-9.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l10,10 c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293l20-20c0.391-0.391,0.391-1.023,0-1.414S40.657,14.237,40.267,14.628z\"/></svg>" +
                "</button>" +
                "<button onClick={document.body.removeChild(document.getElementsByClassName(\"editWindow\")[0])}>" +
                "<svg width=\"20px\" height=\"20px\" viewBox=\"0 0 24 24\" fill=\"#097d91\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                "<path d=\"M6 6L18 18\" stroke=\"#097d91\" stroke-linecap=\"round\"/>\n" +
                "<path d=\"M18 6L6.00001 18\" stroke=\"#097d91\" stroke-linecap=\"round\"/>\n" +
                "</svg>" +
                "</button>" +
                "</div>" +
                "</div>";

            document.body.appendChild(newElement);

            for (let i = 0; i < 5; i++) {
                let newOption = document.createElement("option");

                newOption.innerText = tabs[i][1];
                newOption.selected = document.getElementsByClassName('activeTab')[0].innerHTML.includes(tabs[i][1]);
                newOption.value = tabs[i][0];

                document.getElementById('1').appendChild(newOption);
            }

            fillField2(null);
            document.getElementById('1').onclick = function () {fillField2(null); fillField3(null)};
            document.getElementById('checkMark').onclick = function() {admitCreation()};
        }
    } // shows creation window
    
    async function fillField2(id) {
        let f1 = document.getElementById('1');
        let tree = await getTheTree(f1.value);
        let parentId = null;

        if (id != null)
            parentId = tree.filter(item => item.article.operationCategoryId == id)[0].article['parentOperationCategoryId'];

        let f2 = document.getElementById('2');
        while (f2.lastChild)
            f2.removeChild(f2.firstChild);

        for (let i = 0; i < tree.length; i++) {
            let newOption = document.createElement("option");

            if (tree[i].article.operationCategoryId != id || id == null) {
                newOption.innerText = `${tree[i].article['title']}`;
                if (id != null)
                    newOption.selected = tree[i].article.operationCategoryId == parentId;

                f2.appendChild(newOption);
            }
        }
    } // fills select-box in create/edit window

    async function fillField3(id) {
        let f3 = document.getElementById('3');

        if (id == null) {
            f3.value = '';
        }

        else {
            let f1 = document.getElementById('1').value;

            let tree = await getTheTree(f1);
            f3['value'] = tree.filter(item => item.article.operationCategoryId == id)[0].article['title']
        }
    } // fills input in create/edit window

    async function admitEdition(id: number) {
        let v1 = document.getElementById('1').value;
        let v2 = document.getElementById('2').value;
        let v3 = document.getElementById('3').value;
        let tree = await getTheTree(v1);

        if (v3.length > 0) {
            let parentArticle = tree.filter(item => item.article.title == v2)[0];
            if (parentArticle == undefined) {
                parentArticle = tree[0];
            }
            let fields = {"activityType": parentArticle.article.activityType.toString(),
                "operationCategoryType": parentArticle.article.operationCategoryType.toString(),
                "parentOperationCategoryId": parentArticle.article.operationCategoryId.toString(),
                "title": v3}

            editRecord(id, fields);
        }
        else {
            alert("Заполните все поля и проверьте указание связей")
        }
    } // getting info for put-request
    
    async function admitCreation() {
        let v1 = document.getElementById('1').value;
        let v2 = document.getElementById('2').value;
        let v3 = document.getElementById('3').value;

        if (v3.length > 0) {
            let tree = await getTheTree(v1);

            let parentArticle = tree.filter(item => item.article.title == v2)[0];
            let fields = {"activityType": parentArticle.article.activityType.toString(),
                "operationCategoryType": parentArticle.article.operationCategoryType.toString(),
                "parentOperationCategoryId": parentArticle.article.operationCategoryId.toString(),
                "title": v3}

            createRecord(fields);
        }
        else {
            alert("Заполните все поля")
        }
    } // getting info for post-request

    async function del(id: number) {
        deleteRecord(id);
    } // delete-request
    // END
    // functioning of the site

    useEffect(() => {
        reloadMC();
    }, [pathname])

    return (
        <div className={styles.wrapper}>
            <div id="main" className={styles.mainContent}>
            </div>

            <button onClick={function() { showCreateWindow() }}>Создать статью</button>
        </div>
    )
}
