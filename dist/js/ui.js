(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//import { addFriendToList } from './vk.js';
var vk = require('./vk.js');

function moveFriendCb(e, listedFriendsIds, templateId, containerId) {
    e.preventDefault();
    var currentFriendItem = e.target.closest('.friend-item'),
        currentFriendId = parseFloat(currentFriendItem.dataset.uid);

    vk.moveFriend(currentFriendId, templateId, containerId);
    currentFriendItem.remove();

    //console.log(containerId==='customFriendsList');

    var fListInitial = JSON.parse(localStorage.friendsListInitial);
    var tempFriendList = JSON.parse(localStorage.friendsListTemp);
    if (containerId === 'customFriendsList') {
        listedFriendsIds.push(currentFriendId);
        tempFriendList = tempFriendList.filter(function (friendObj) {
            return friendObj.uid !== currentFriendId;
        });
        //console.log(tempFriendList);
        localStorage.friendsListTemp = JSON.stringify(tempFriendList);
    } else if (containerId === 'friendsListInitial') {
        listedFriendsIds.splice(listedFriendsIds.indexOf(currentFriendId), 1);
        var addingFriend = fListInitial.filter(function (friendObj) {
            return friendObj.uid === currentFriendId;
        })[0];
        tempFriendList.push(addingFriend);
        localStorage.friendsListTemp = '';
        localStorage.friendsListTemp = JSON.stringify(tempFriendList);
    }
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

function processStringify(needle, friendObj) {
    var re = new RegExp(needle, "gi");
    var fullName = friendObj.first_name + ' ' + friendObj.last_name + ' ' + friendObj.nickname;
    var fullNameBolded = fullName.replace(re, '<strong>$&</strong>');
    var fullNameBits = fullNameBolded.split(' ');
    friendObj.first_name = fullNameBits[0];
    friendObj.last_name = fullNameBits[1];
    friendObj.nickname = fullNameBits[2];
}

function renderFriends(e, friendsContainer, friendsList) {
    friendsList.forEach(function (friendObj) {
        var re = new RegExp(e.target.value, "gi");
        var fullName = friendObj.first_name + ' ' + friendObj.last_name + ' ' + friendObj.nickname;
        var fullNameBolded = fullName.replace(re, '<strong>$&</strong>');
        var fullNameBits = fullNameBolded.split(' ');
        friendObj.first_name = fullNameBits[0];
        friendObj.last_name = fullNameBits[1];
        friendObj.nickname = fullNameBits[2];
    });

    friendsContainer.innerHTML = '';

    var friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
        friendTemplateFn = Handlebars.compile(friendTemplateSrc),
        friendTemplateCompiled = friendTemplateFn({ friends: friendsList });
    friendsContainer.insertAdjacentHTML('beforeend', friendTemplateCompiled);
}

function inputInitialCb(e, friendsContainer) {
    var friendsListTemp = JSON.parse(localStorage.friendsListTemp);
    var filteredFriendsInitialList = friendsListTemp.filter(function (friendObj) {
        var fullName = friendObj.first_name + ' ' + friendObj.last_name + ' ' + friendObj.nickname;
        if (fullName.toLowerCase().includes(e.target.value) || fullName.includes(e.target.value)) return true;
    });

    renderFriends(e, friendsContainer, filteredFriendsInitialList);
}

function inputListedCb() {}
module.exports = { moveFriendCb: moveFriendCb, dragstartCb: dragstartCb, dropCb: dropCb, inputInitialCb: inputInitialCb, inputListedCb: inputListedCb };
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
                //console.log(friendsResponse);
                document.getElementById('friendsListInitial').insertAdjacentHTML('beforeend', friendTemplateCompiled);
                localStorage.friendsListInitial = JSON.stringify(friendsResponse);
                localStorage.friendsListTemp = JSON.stringify(friendsResponse);
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