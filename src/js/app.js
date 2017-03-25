'use strict';

const app = require("./func.js");

function pageLoad() {
    return new Promise( ( resolve, reject ) => {
        if( document.readyState == 'complete' ) {
            resolve();
        } else {
            window.onload = resolve;
        }
    });
}

function vkConnect() {
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

function vkLoadFriends() {
    return new Promise((resolve, reject) => {
        VK.api('friends.get', { 'fields': 'nickname,photo_100' }, (response) => {
            if( response.error ) {
                reject( new Error(response.error.error_msg) );
            } else {
                let friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
                    friendTemplateFn = Handlebars.compile(friendTemplateSrc),
                    friendsResponse = response.response,
                    friendTemplateCompiled = friendTemplateFn({ friends: friendsResponse} );
console.log(friendsResponse);
                document.getElementById('friendsListInitial').innerHTML = friendTemplateCompiled;
                resolve();
            }
        });
    });
}

function vkAddFriendToList(uid) {
    return new Promise((resolve, reject) => {
        VK.api( 'users.get', {
            'user_ids': uid,
            'fields': 'nickname,photo_100'
        }, (response) => {
            if( response.error ) {
                reject( new Error(response.error.error_msg) );
            } else {
                let friendTemplateSrc = document.getElementById('friendTemplateListed').innerHTML,
                    friendTemplateFn = Handlebars.compile(friendTemplateSrc),
                    friendsResponse = response.response,
                    friendTemplateCompiled = friendTemplateFn({ friends: friendsResponse} );
                console.log(friendsResponse);
                document.getElementById('customFriendsList').insertAdjacentHTML('beforeend', friendTemplateCompiled);
                resolve();
            }
        });
    });
}

function uiRemoveFriendItem(e, listedFriendsIds){
    e.preventDefault();
    let currentFriendId = e.target.closest('.friend-item').dataset.uid;
    listedFriendsIds.splice( listedFriendsIds.indexOf(currentFriendId), 1 );
    e.target.closest('.friend-item').remove();
}

function uiAddFriendToList(e, listedFriendsIds) {
    e.preventDefault();
    let currentFriendId = e.target.closest('.friend-item').dataset.uid;
    listedFriendsIds.push(currentFriendId);
    vkAddFriendToList(currentFriendId);
}

pageLoad()
    .then(vkConnect())
    .then(vkLoadFriends())
    .then(()=>{
        let listedFriendsIds = [];
        document.getElementById('friendsListInitial').addEventListener('click', function(e){uiAddFriendToList(e,listedFriendsIds)});
        document.getElementById('customFriendsList').addEventListener('click', function(e){uiRemoveFriendItem(e,listedFriendsIds)} );
    });
