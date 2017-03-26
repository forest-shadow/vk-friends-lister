(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var app = require('./func.js'),
    vk = require('./vk.js'),
    ui = require('./ui.js');

app.pageLoad().then(vk.connect()).then(vk.loadFriends()).then(function () {
    var friendsListInitial = document.getElementById('friendsListInitial'),
        customFriendsList = document.getElementById('customFriendsList'),
        listedFriendsIds = [];
    friendsListInitial.addEventListener('click', function (e) {
        ui.moveFriendCb(e, listedFriendsIds, 'friendTemplateListed', 'customFriendsList');
    });
    customFriendsList.addEventListener('click', function (e) {
        ui.moveFriendCb(e, listedFriendsIds, 'friendTemplate', 'friendsListInitial');
    });

    var dragged = void 0;
    friendsListInitial.addEventListener('dragstart', function (e) {
        ui.dragstartCb(e, dragged);
    });
    customFriendsList.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    customFriendsList.addEventListener('drop', function (e) {
        ui.dropCb(e, dragged);
    });
});
},{"./func.js":2,"./ui.js":3,"./vk.js":4}],2:[function(require,module,exports){
function pageLoad() {
    return new Promise( ( resolve, reject ) => {
        if( document.readyState == 'complete' ) {
            resolve();
        } else {
            window.onload = resolve;
        }
    });
}

module.exports = { pageLoad };
},{}],3:[function(require,module,exports){
//import { addFriendToList } from './vk.js';
let vk = require('./vk.js');

function moveFriendCb(e, listedFriendsIds, templateId, containerId ) {
    e.preventDefault();
    let currentFriendItem = e.target.closest('.friend-item'),
        currentFriendId = currentFriendItem.dataset.uid;
    listedFriendsIds.push(currentFriendId);
    vk.moveFriend(currentFriendId, templateId, containerId);
    currentFriendItem.remove();
    console.log(`Listed friends items ids: ${listedFriendsIds}`);
}

function dragstartCb (e, dragged) {
    console.log('start draggin', e);
    dragged = e.target;
    e.dataTransfer.setData("text", e.target.dataset.uid);
}

function dropCb (e, dragged) {
    e.preventDefault();
    console.log('dropped', e);
    let data = e.dataTransfer.getData("text");
    vk.addFriendToList(data);
    dragged.remove();
}

module.exports = { moveFriendCb, dragstartCb, dropCb };
},{"./vk.js":4}],4:[function(require,module,exports){
function connect() {
    return new Promise( ( resolve,reject ) => {
        VK.init( {
            apiId: 5267932
        } );

        VK.Auth.login((response) => {
            if(response.status === 'connected') {
                resolve(response);
            } else {
                reject( new Error( 'App dont pass Autorization process.' ) );
            }
        })
    });

}

function loadFriends() {
    return new Promise((resolve, reject) => {
        VK.api('friends.get', {
            'fields': 'nickname,photo_100',
            'count': 50
        }, (response) => {
            if( response.error ) {
                reject( new Error(response.error.error_msg) );
            } else {
                let friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
                    friendTemplateFn = Handlebars.compile(friendTemplateSrc),
                    friendsResponse = response.response,
                    friendTemplateCompiled = friendTemplateFn({ friends: friendsResponse} );
                console.log(friendsResponse);
                document.getElementById('friendsListInitial').insertAdjacentHTML('beforeend', friendTemplateCompiled);
                resolve();
            }
        });
    });
}

function moveFriend(uid, templateId, containerId ) {
    return new Promise((resolve, reject) => {
        VK.api( 'users.get', {
            'user_ids': uid,
            'fields': 'nickname,photo_100'
        }, (response) => {
            if( response.error ) {
                reject( new Error(response.error.error_msg) );
            } else {
                let friendTemplateSrc = document.getElementById(templateId).innerHTML,
                    friendTemplateFn = Handlebars.compile(friendTemplateSrc),
                    friendsResponse = response.response,
                    friendTemplateCompiled = friendTemplateFn({ friends: friendsResponse} );
                console.log(friendsResponse);
                document.getElementById(containerId).insertAdjacentHTML('beforeend', friendTemplateCompiled);
                resolve();
            }
        });
    });
}

module.exports = { connect, loadFriends, moveFriend };
},{}]},{},[1])