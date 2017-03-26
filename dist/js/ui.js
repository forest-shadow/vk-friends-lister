(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//import { addFriendToList } from './vk.js';
var vk = require('./vk.js');

function moveFriendCb(e, listedFriendsIds, templateId, containerId) {
    e.preventDefault();
    var currentFriendItem = e.target.closest('.friend-item'),
        currentFriendId = currentFriendItem.dataset.uid;
    listedFriendsIds.push(currentFriendId);
    vk.moveFriend(currentFriendId, templateId, containerId);
    currentFriendItem.remove();
    console.log('Listed friends items ids: ' + listedFriendsIds);
}

function dragstartCb(e, dragged) {
    console.log('start draggin', e);
    dragged = e.target;
    e.dataTransfer.setData("text", e.target.dataset.uid);
}

function dropCb(e, dragged) {
    e.preventDefault();
    console.log('dropped', e);
    var data = e.dataTransfer.getData("text");
    vk.addFriendToList(data);
    dragged.remove();
}

module.exports = { moveFriendCb: moveFriendCb, dragstartCb: dragstartCb, dropCb: dropCb };
},{"./vk.js":2}],2:[function(require,module,exports){
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