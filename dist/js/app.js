"use strict";

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
        'use strict';

        var app = require("./func.js");

        function pageLoad() {
            return new Promise(function (resolve, reject) {
                if (document.readyState == 'complete') {
                    resolve();
                } else {
                    window.onload = resolve;
                }
            });
        }

        function vkConnect() {
            return new Promise(function (resolve, reject) {
                VK.init({
                    apiId: 5267932
                });

                VK.Auth.login(function (response) {
                    if (response.status === 'connected') {
                        resolve(response);
                    } else {
                        reject(new Error('App dont pass Autorization process.'));
                    }
                });
            });
        }

        function vkLoadFriends() {
            return new Promise(function (resolve, reject) {
                VK.api('friends.get', { 'fields': 'nickname,photo_100' }, function (response) {
                    if (response.error) {
                        reject(new Error(response.error.error_msg));
                    } else {
                        var friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
                            friendTemplateFn = Handlebars.compile(friendTemplateSrc),
                            friendsResponse = response.response,
                            friendTemplateCompiled = friendTemplateFn({ friends: friendsResponse });
                        console.log(friendsResponse);
                        document.getElementById('friendsListInitial').innerHTML = friendTemplateCompiled;
                        resolve();
                    }
                });
            });
        }

        function vkAddFriendToList(uid) {
            return new Promise(function (resolve, reject) {
                VK.api('users.get', {
                    'user_ids': uid,
                    'fields': 'nickname,photo_100'
                }, function (response) {
                    if (response.error) {
                        reject(new Error(response.error.error_msg));
                    } else {
                        var friendTemplateSrc = document.getElementById('friendTemplateListed').innerHTML,
                            friendTemplateFn = Handlebars.compile(friendTemplateSrc),
                            friendsResponse = response.response,
                            friendTemplateCompiled = friendTemplateFn({ friends: friendsResponse });
                        console.log(friendsResponse);
                        document.getElementById('customFriendsList').insertAdjacentHTML('beforeend', friendTemplateCompiled);
                        resolve();
                    }
                });
            });
        }

        function uiRemoveFriendItem(e, listedFriendsIds) {
            e.preventDefault();
            var currentFriendId = e.target.closest('.friend-item').dataset.uid;
            listedFriendsIds.splice(listedFriendsIds.indexOf(currentFriendId), 1);
            e.target.closest('.friend-item').remove();
        }

        function uiAddFriendToList(e, listedFriendsIds) {
            e.preventDefault();
            var currentFriendId = e.target.closest('.friend-item').dataset.uid;
            listedFriendsIds.push(currentFriendId);
            vkAddFriendToList(currentFriendId);
        }

        pageLoad().then(vkConnect()).then(vkLoadFriends()).then(function () {
            var listedFriendsIds = [];
            document.getElementById('friendsListInitial').addEventListener('click', function (e) {
                uiAddFriendToList(e, listedFriendsIds);
            });
            document.getElementById('customFriendsList').addEventListener('click', function (e) {
                uiRemoveFriendItem(e, listedFriendsIds);
            });
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