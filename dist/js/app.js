"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);throw new Error("Cannot find module '" + o + "'");
            }var f = n[o] = { exports: {} };t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        var app = require("./func.js");

        document.cookie = "username=John Doe; expires=session; path=/";
        document.cookie = "randomName=randomValue; expires=session; path=/";
        document.cookie = "cookieName=cookieValue; expires=Mo, 18 Dec 2017 12:00:00 UTC; path=/";

        // Cookies Table
        var cookiesTableBody = document.querySelector('.container .cookies-table tbody');

        var cookiesArr = app.getCookiesArr();
        if (cookiesArr.length) app.renderCookiesRows(cookiesArr, cookiesTableBody);else {
            app.renderEmptyCookiesRow(cookiesTableBody);
        }

        cookiesTableBody.addEventListener('click', function (e) {
            var deleteCookieId = void 0,
                deleteCookieObj = void 0,
                confirmQuestion = void 0;
            var cookiesArr = app.getCookiesArr();
            if (e.target.hasAttributes('class', 'delete')) {
                deleteCookieId = parseInt(e.target.parentNode.parentNode.dataset.cookieId);
                deleteCookieObj = app.getCookieObjById(cookiesArr, deleteCookieId);
                confirmQuestion = window.confirm("Delete cookie '" + deleteCookieObj.cookieName + "'?");
            }

            if (confirmQuestion) {
                app.deleteCookieByCookieString(deleteCookieObj.cookieString);

                if (cookiesArr.length !== 1) {
                    app.updateCookiesTable(cookiesTableBody);
                } else {
                    app.renderEmptyCookiesRow(cookiesTableBody);
                }
            }
        });

        // 'Add Cookie' form
        var cookieForm = document.forms.namedItem('add-cookie'),
            formInputs = cookieForm.querySelectorAll('.form-row input');
        console.log(formInputs, typeof formInputs === "undefined" ? "undefined" : _typeof(formInputs));

        cookieForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var cookieName = cookieForm.querySelector('.form-row input#cookie-name').value,
                cookieValue = cookieForm.querySelector('.form-row input#cookie-value').value,
                cookieExpires = cookieForm.querySelector('.form-row input#cookie-expires').value;
            console.log(cookieValue);

            if (cookieName && cookieValue && cookieExpires) {
                if (typeof (cookieExpires * 1) === "number") {
                    app.addCookieExpires(cookieName, cookieValue, cookieExpires);

                    for (var i = 0; i < formInputs.length; i++) {
                        formInputs[i].value = '';
                    }

                    app.updateCookiesTable(cookiesTableBody);
                } else {
                    alert('Cookie expires field is not a number!');
                }
            } else {
                alert('Please fill all inputs!!');
            }
        });
    }, { "./func.js": 2 }], 2: [function (require, module, exports) {
        function addCookie(cookieName, cookieValue) {
            document.cookie = cookieName + "=" + cookieValue + "; ";
        }

        function addCookieExpires(cookieName, cookieValue, cookieExpired) {
            var cookieExpiredMs = cookieExpired * 86400000 + new Date().getTime(),
                cookieExpiredString = new Date(cookieExpiredMs).toUTCString();
            console.log(new Date(cookieExpiredMs));
            document.cookie = cookieName + "=" + cookieValue + "; expires=" + cookieExpiredString;
        }

        function deleteCookie(cookieName, cookieValue) {
            document.cookie = cookieName + "=" + cookieValue + "; expires=Thu, 01 Jan 1970 00:00:01 GMT; ";
        }

        function deleteCookieByCookieString(cookieString) {
            document.cookie = cookieString + "; expires=Thu, 01 Jan 1970 00:00:01 GMT; ";
        }

        function getCookiesArr() {
            var cookiesArr = [],
                cookieCounter = 0;
            document.cookie.split('; ').forEach(function (cookie) {
                var cookieParts = cookie.split('=');
                cookieCounter++;
                cookiesArr.push({
                    cookieId: cookieCounter,
                    cookieName: cookieParts[0],
                    cookieValue: cookieParts[1],
                    cookieString: cookieParts[0] + "=" + cookieParts[1] + "; "
                });
            });

            return cookiesArr;
        }

        function getCookieObjById(cookiesArr, cookieId) {
            var filteredCookiesArr = cookiesArr.filter(function (cookieObj) {
                return cookieObj.cookieId === cookieId;
            });
            return filteredCookiesArr[0];
        }

        function renderEmptyCookiesRow(cookiesTableBody) {
            cookiesTableBody.innerHTML = '';
            cookiesTableBody.innerHTML = '<tr><td colspan="4">There are no cookies</td></tr>';
        }

        function renderCookiesRows(cookiesArr, cookiesTableBody) {
            var cookieCounter = 0;
            cookiesArr.forEach(function (cookieObj) {
                cookieCounter++;

                var cookieRow = "<tr data-cookie-id=\"" + cookieObj.cookieId + "\">\n                            <td>" + cookieCounter + "</td>\n                            <td>" + cookieObj.cookieName + "</td>\n                            <td>" + cookieObj.cookieValue + "</td>\n                            <td><button class=\"delete\">Delete Cookie</button></td>\n                         </tr>";
                cookiesTableBody.insertAdjacentHTML('beforeend', cookieRow);
            });
        };

        function updateCookiesTable(cookiesTableBody) {
            var cookiesArr = getCookiesArr();
            cookiesTableBody.innerHTML = '';
            renderCookiesRows(cookiesArr, cookiesTableBody);
        }

        module.exports = { addCookie: addCookie, addCookieExpires: addCookieExpires,
            deleteCookie: deleteCookie, deleteCookieByCookieString: deleteCookieByCookieString,
            getCookiesArr: getCookiesArr, getCookieObjById: getCookieObjById,
            renderCookiesRows: renderCookiesRows, renderEmptyCookiesRow: renderEmptyCookiesRow,
            updateCookiesTable: updateCookiesTable };
    }, {}] }, {}, [1]);