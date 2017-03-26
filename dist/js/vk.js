(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function connect() {
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

function loadFriends() {
    return new Promise(function (resolve, reject) {
        VK.api('friends.get', {
            'fields': 'nickname,photo_100',
            'count': 50
        }, function (response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                var friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
                    friendTemplateFn = Handlebars.compile(friendTemplateSrc),
                    friendsResponse = response.response,
                    friendTemplateCompiled = friendTemplateFn({ friends: friendsResponse });
                console.log(friendsResponse);
                document.getElementById('friendsListInitial').insertAdjacentHTML('beforeend', friendTemplateCompiled);
                resolve();
            }
        });
    });
}

function moveFriend(uid, templateId, containerId) {
    return new Promise(function (resolve, reject) {
        VK.api('users.get', {
            'user_ids': uid,
            'fields': 'nickname,photo_100'
        }, function (response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                var friendTemplateSrc = document.getElementById(templateId).innerHTML,
                    friendTemplateFn = Handlebars.compile(friendTemplateSrc),
                    friendsResponse = response.response,
                    friendTemplateCompiled = friendTemplateFn({ friends: friendsResponse });
                console.log(friendsResponse);
                document.getElementById(containerId).insertAdjacentHTML('beforeend', friendTemplateCompiled);
                resolve();
            }
        });
    });
}

module.exports = { connect: connect, loadFriends: loadFriends, moveFriend: moveFriend };
},{}]},{},[1])