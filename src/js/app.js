'use strict';

const app   = require('./func.js'),
      vk    = require('./vk.js'),
      ui    = require('./ui.js');

app.pageLoad()
    .then( vk.connect() )
    .then( vk.loadFriends() )
    .then( ()=>{
        let friendsListInitial = document.getElementById('friendsListInitial'),
            customFriendsList = document.getElementById('customFriendsList'),
            listedFriendsIds = [];
        friendsListInitial.addEventListener( 'click', function(e){ui.moveFriendCb( e, listedFriendsIds, 'friendTemplateListed', 'customFriendsList' )} );
        customFriendsList.addEventListener( 'click', function(e){ui.moveFriendCb( e, listedFriendsIds, 'friendTemplate', 'friendsListInitial' )} );


        let dragged;
        friendsListInitial.addEventListener('dragstart', function(e){ui.dragstartCb(e, dragged)});
        customFriendsList.addEventListener('dragover', function(e){e.preventDefault();});
        customFriendsList.addEventListener('drop', function(e){ui.dropCb(e, dragged)});

    });
