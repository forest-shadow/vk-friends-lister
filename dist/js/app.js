(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var app = require('./func.js'),
    vk = require('./vk.js'),
    ui = require('./ui.js');

app.pageLoad().then(vk.connect()).then(vk.loadFriends()).then(function () {

    var friendsListInitial = document.getElementById('friendsListInitial'),
        customFriendsList = document.getElementById('customFriendsList'),
        listedFriendsIds = [];

    if (localStorage.friendListListed) {
        customFriendsList.innerHTML = '';

        var friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
            friendTemplateFn = Handlebars.compile(friendTemplateSrc),
            friendTemplateCompiled = friendTemplateFn({ friends: JSON.parse(localStorage.friendListListed) });
        customFriendsList.insertAdjacentHTML('beforeend', friendTemplateCompiled);

        JSON.parse(localStorage.friendListListed).forEach(function (freiendObj) {
            listedFriendsIds.push(freiendObj.uid);
        });
    }

    if (localStorage.friendsListTemp) {
        friendsListInitial.innerHTML = '';
        var startedInitialList = JSON.parse(localStorage.friendsListTemp).filter(function (freiendObj) {
            return !listedFriendsIds.includes(freiendObj.uid);
        });

        var _friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
            _friendTemplateFn = Handlebars.compile(_friendTemplateSrc),
            _friendTemplateCompiled = _friendTemplateFn({ friends: startedInitialList });
        friendsListInitial.insertAdjacentHTML('beforeend', _friendTemplateCompiled);

        localStorage.friendsListTemp = JSON.stringify(startedInitialList);

        console.log(listedFriendsIds);
    }

    // friends items on click handlers
    friendsListInitial.addEventListener('click', function (e) {
        ui.moveFriendCb(e, listedFriendsIds, 'friendTemplateListed', 'customFriendsList');
    });
    customFriendsList.addEventListener('click', function (e) {
        ui.moveFriendCb(e, listedFriendsIds, 'friendTemplate', 'friendsListInitial');
    });

    // friends items drag and drop functionality
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

    // friends items filtering
    var inputListInitial = document.getElementById('inputListInitial'),
        inputListCustom = document.getElementById('inputListCustom');

    inputListInitial.addEventListener('input', function (e) {
        ui.inputInitialCb(e, friendsListInitial);
    });

    inputListCustom.addEventListener('input', function (e) {
        var friendsListTemp = JSON.parse(localStorage.friendsListTemp);

        var filteredFriendsInitialList = friendsListTemp.filter(function (friendObj) {
            return listedFriendsIds.indexOf(friendObj.uid.toString()) > -1;
        });

        filteredFriendsInitialList = filteredFriendsInitialList.filter(function (friendObj) {
            var fullName = friendObj.first_name + ' ' + friendObj.last_name + ' ' + friendObj.nickname;
            if (fullName.toLowerCase().includes(e.target.value) || fullName.includes(e.target.value)) return true;
        });

        if (e.target.value != '') {
            filteredFriendsInitialList.forEach(function (friendObj) {
                var re = new RegExp(e.target.value, "gi");
                var fullName = friendObj.first_name + ' ' + friendObj.last_name + ' ' + friendObj.nickname;
                var fullNameBolded = fullName.replace(re, '<strong>$&</strong>');
                var fullNameBits = fullNameBolded.split(' ');
                friendObj.first_name = fullNameBits[0];
                friendObj.last_name = fullNameBits[1];
                friendObj.nickname = fullNameBits[2];
            });
        }

        customFriendsList.innerHTML = '';

        var friendTemplateSrc = document.getElementById('friendTemplateListed').innerHTML,
            friendTemplateFn = Handlebars.compile(friendTemplateSrc),
            friendTemplateCompiled = friendTemplateFn({ friends: filteredFriendsInitialList });
        document.getElementById('customFriendsList').insertAdjacentHTML('beforeend', friendTemplateCompiled);
    });

    document.getElementById('save').addEventListener('click', function (e) {
        e.preventDefault();

        if (listedFriendsIds.length > 0) {
            VK.api('users.get', {
                'user_ids': listedFriendsIds.join(','),
                'fields': 'nickname,photo_100'
            }, function (response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    if (response.error) {
                        reject(new Error(response.error.error_msg));
                    } else {
                        var friendsResponse = response.response;
                        localStorage.friendListListed = JSON.stringify(friendsResponse);
                    }
                }
            });

            alert('Current friends list is saved');
        }
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
        currentFriendId = parseFloat(currentFriendItem.dataset.uid);

    vk.moveFriend(currentFriendId, templateId, containerId);
    currentFriendItem.remove();

    //console.log(containerId==='customFriendsList');

    let fListInitial = JSON.parse(localStorage.friendsListInitial);
    let tempFriendList = JSON.parse(localStorage.friendsListTemp);
    if(containerId==='customFriendsList') {
        listedFriendsIds.push(currentFriendId);
        tempFriendList = tempFriendList.filter((friendObj)=>{
            return friendObj.uid!==currentFriendId;
        });
        //console.log(tempFriendList);
        localStorage.friendsListTemp = JSON.stringify(tempFriendList);
    } else if (containerId==='friendsListInitial') {
        listedFriendsIds.splice(listedFriendsIds.indexOf(currentFriendId),1);
        let addingFriend = fListInitial.filter((friendObj)=>{
            return friendObj.uid===currentFriendId;
        })[0];
        tempFriendList.push(addingFriend);
        localStorage.friendsListTemp = '';
        localStorage.friendsListTemp = JSON.stringify(tempFriendList);
    }
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

function processStringify(needle, friendObj) {
    let re = new RegExp(needle, "gi");
    let fullName = `${friendObj.first_name} ${friendObj.last_name} ${friendObj.nickname}`;
    let fullNameBolded = fullName.replace(re,'<strong>$&</strong>');
    let fullNameBits = fullNameBolded.split(' ');
    friendObj.first_name = fullNameBits[0];
    friendObj.last_name = fullNameBits[1];
    friendObj.nickname = fullNameBits[2];
}

function renderFriends(e, friendsContainer, friendsList) {
    friendsList.forEach( (friendObj) => {
        let re = new RegExp(e.target.value, "gi");
        let fullName = `${friendObj.first_name} ${friendObj.last_name} ${friendObj.nickname}`;
        let fullNameBolded = fullName.replace(re,'<strong>$&</strong>');
        let fullNameBits = fullNameBolded.split(' ');
        friendObj.first_name = fullNameBits[0];
        friendObj.last_name = fullNameBits[1];
        friendObj.nickname = fullNameBits[2];
    });

    friendsContainer.innerHTML = '';

    let friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
        friendTemplateFn = Handlebars.compile(friendTemplateSrc),
        friendTemplateCompiled = friendTemplateFn({ friends: friendsList} );
    friendsContainer.insertAdjacentHTML('beforeend', friendTemplateCompiled);
}

function inputInitialCb(e, friendsContainer) {
    let friendsListTemp = JSON.parse(localStorage.friendsListTemp);
    let filteredFriendsInitialList = friendsListTemp.filter((friendObj) => {
        let fullName = `${friendObj.first_name} ${friendObj.last_name} ${friendObj.nickname}`;
        if(fullName.toLowerCase().includes(e.target.value) || fullName.includes(e.target.value))
            return true;
    });

    renderFriends(e, friendsContainer, filteredFriendsInitialList);
}

function inputListedCb() {

}
module.exports = { moveFriendCb, dragstartCb, dropCb, inputInitialCb, inputListedCb  };
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