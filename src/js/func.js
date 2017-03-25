function addCookie(cookieName, cookieValue) {
    document.cookie = `${cookieName}=${cookieValue}; `;
}

function addCookieExpires(cookieName, cookieValue, cookieExpired) {
    let cookieExpiredMs = cookieExpired * 86400000 + new Date().getTime(),
        cookieExpiredString = new Date(cookieExpiredMs).toUTCString();
    console.log(new Date(cookieExpiredMs));
    document.cookie = `${cookieName}=${cookieValue}; expires=${cookieExpiredString}`;
}

function deleteCookie(cookieName, cookieValue) {
    document.cookie = `${cookieName}=${cookieValue}; expires=Thu, 01 Jan 1970 00:00:01 GMT; `;
}

function deleteCookieByCookieString(cookieString) {
    document.cookie = `${cookieString}; expires=Thu, 01 Jan 1970 00:00:01 GMT; `;
}

function getCookiesArr() {
    let cookiesArr = [],
        cookieCounter = 0;
    document.cookie.split('; ').forEach((cookie)=>{
        let cookieParts = cookie.split('=');
        cookieCounter++;
        cookiesArr.push({
            cookieId : cookieCounter,
            cookieName : cookieParts[0],
            cookieValue : cookieParts[1],
            cookieString : `${cookieParts[0]}=${cookieParts[1]}; `
        });
    } );

    return cookiesArr;
}

function getCookieObjById(cookiesArr, cookieId) {
    let filteredCookiesArr = cookiesArr.filter((cookieObj)=>{
        return cookieObj.cookieId === cookieId;
    });
    return filteredCookiesArr[0];
}

function renderEmptyCookiesRow(cookiesTableBody) {
    cookiesTableBody.innerHTML = '';
    cookiesTableBody.innerHTML = '<tr><td colspan="4">There are no cookies</td></tr>';
}

function renderCookiesRows(cookiesArr, cookiesTableBody) {
    let cookieCounter = 0;
    cookiesArr.forEach(cookieObj => {
        cookieCounter++;

        let cookieRow = `<tr data-cookie-id="${cookieObj.cookieId}">
                            <td>${cookieCounter}</td>
                            <td>${cookieObj.cookieName}</td>
                            <td>${cookieObj.cookieValue}</td>
                            <td><button class="delete">Delete Cookie</button></td>
                         </tr>`;
        cookiesTableBody.insertAdjacentHTML( 'beforeend', cookieRow );
    });
};

function updateCookiesTable(cookiesTableBody) {
    let cookiesArr = getCookiesArr();
    cookiesTableBody.innerHTML = '';
    renderCookiesRows(cookiesArr, cookiesTableBody);
}

module.exports = {  addCookie, addCookieExpires,
                    deleteCookie, deleteCookieByCookieString,
                    getCookiesArr, getCookieObjById,
                    renderCookiesRows, renderEmptyCookiesRow,
                    updateCookiesTable };