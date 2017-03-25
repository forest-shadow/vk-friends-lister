const app = require("./func.js");

document.cookie = "username=John Doe; expires=session; path=/";
document.cookie = "randomName=randomValue; expires=session; path=/";
document.cookie = "cookieName=cookieValue; expires=Mo, 18 Dec 2017 12:00:00 UTC; path=/";

// Cookies Table
let cookiesTableBody = document.querySelector('.container .cookies-table tbody');

let cookiesArr = app.getCookiesArr();
if(cookiesArr.length)
    app.renderCookiesRows(cookiesArr, cookiesTableBody);
else {
    app.renderEmptyCookiesRow( cookiesTableBody );
}

cookiesTableBody.addEventListener('click', (e) => {
    let deleteCookieId,
        deleteCookieObj,
        confirmQuestion;
    let cookiesArr = app.getCookiesArr();
    if(e.target.hasAttributes('class', 'delete')) {
        deleteCookieId = parseInt(e.target.parentNode.parentNode.dataset.cookieId);
        deleteCookieObj = app.getCookieObjById(cookiesArr, deleteCookieId);
        confirmQuestion = window.confirm(`Delete cookie '${deleteCookieObj.cookieName}'?`);
    }

    if(confirmQuestion) {
        app.deleteCookieByCookieString(deleteCookieObj.cookieString);

        if(cookiesArr.length!==1) {
            app.updateCookiesTable(cookiesTableBody);
        } else {
            app.renderEmptyCookiesRow( cookiesTableBody );
        }
    }
});


// 'Add Cookie' form
let cookieForm = document.forms.namedItem('add-cookie'),
    formInputs = cookieForm.querySelectorAll('.form-row input');
console.log(formInputs, typeof formInputs);

cookieForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let cookieName = cookieForm.querySelector('.form-row input#cookie-name').value,
        cookieValue = cookieForm.querySelector('.form-row input#cookie-value').value,
        cookieExpires = cookieForm.querySelector('.form-row input#cookie-expires').value;
    console.log(cookieValue);

    if (cookieName && cookieValue && cookieExpires) {
        if(typeof (cookieExpires * 1) === "number") {
            app.addCookieExpires(cookieName, cookieValue, cookieExpires);

            for(let i=0; i<formInputs.length; i++) {
                formInputs[i].value = '';
            }

            app.updateCookiesTable(cookiesTableBody);
        } else {
            alert('Cookie expires field is not a number!')
        }

    } else {
        alert('Please fill all inputs!!')
    }

});