'use strict';

const app   = require('./func.js'),
      vk    = require('./vk.js'),
      ui    = require('./ui.js');

app.pageLoad()
    .then( vk.connect() )
    .then( vk.loadFriends() )
    .then( ()=> {



    let friendsListInitial = document.getElementById('friendsListInitial'),
        customFriendsList = document.getElementById('customFriendsList'),
        listedFriendsIds = [];

    if (localStorage.friendListListed) {
        customFriendsList.innerHTML = '';

        let friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
            friendTemplateFn = Handlebars.compile(friendTemplateSrc),
            friendTemplateCompiled = friendTemplateFn({ friends: JSON.parse(localStorage.friendListListed)} );
        customFriendsList.insertAdjacentHTML('beforeend', friendTemplateCompiled);


        JSON.parse(localStorage.friendListListed).forEach((freiendObj) => {
            listedFriendsIds.push(freiendObj.uid);
        });
    }

    if(localStorage.friendsListTemp) {
        friendsListInitial.innerHTML = '';
        let startedInitialList = JSON.parse(localStorage.friendsListTemp).filter((freiendObj)=>{
            return !listedFriendsIds.includes(freiendObj.uid);
        });

        let friendTemplateSrc = document.getElementById('friendTemplate').innerHTML,
            friendTemplateFn = Handlebars.compile(friendTemplateSrc),
            friendTemplateCompiled = friendTemplateFn({ friends: startedInitialList} );
        friendsListInitial.insertAdjacentHTML('beforeend', friendTemplateCompiled);

        localStorage.friendsListTemp = JSON.stringify(startedInitialList);

        console.log(listedFriendsIds);
    }

    // friends items on click handlers
    friendsListInitial.addEventListener( 'click', function(e){ui.moveFriendCb( e, listedFriendsIds, 'friendTemplateListed', 'customFriendsList' )} );
    customFriendsList.addEventListener( 'click', function(e){ui.moveFriendCb( e, listedFriendsIds, 'friendTemplate', 'friendsListInitial' )} );


    // friends items drag and drop functionality
    let dragged;
    friendsListInitial.addEventListener('dragstart', function(e){ui.dragstartCb(e, dragged)});
    customFriendsList.addEventListener('dragover', function(e){e.preventDefault();});
    customFriendsList.addEventListener('drop', function(e){ui.dropCb(e, dragged)});


    // friends items filtering
    let inputListInitial = document.getElementById('inputListInitial'),
        inputListCustom = document.getElementById('inputListCustom');


    inputListInitial.addEventListener('input', function(e){ui.inputInitialCb( e, friendsListInitial )} );

    inputListCustom.addEventListener('input', (e) => {
        let friendsListTemp = JSON.parse(localStorage.friendsListTemp);

        let filteredFriendsInitialList = friendsListTemp.filter((friendObj) => {
            return listedFriendsIds.indexOf( friendObj.uid.toString() )>-1;
        });

        filteredFriendsInitialList = filteredFriendsInitialList.filter((friendObj) => {
            let fullName = `${friendObj.first_name} ${friendObj.last_name} ${friendObj.nickname}`;
            if(fullName.toLowerCase().includes(e.target.value) || fullName.includes(e.target.value))
                return true;
        });

        if(e.target.value!='') {
            filteredFriendsInitialList.forEach((friendObj) => {
                let re = new RegExp(e.target.value, "gi");
                let fullName = `${friendObj.first_name} ${friendObj.last_name} ${friendObj.nickname}`;
                let fullNameBolded = fullName.replace(re,'<strong>$&</strong>');
                let fullNameBits = fullNameBolded.split(' ');
                friendObj.first_name = fullNameBits[0];
                friendObj.last_name = fullNameBits[1];
                friendObj.nickname = fullNameBits[2];
            });
        }

        customFriendsList.innerHTML = '';

        let friendTemplateSrc = document.getElementById('friendTemplateListed').innerHTML,
            friendTemplateFn = Handlebars.compile(friendTemplateSrc),
            friendTemplateCompiled = friendTemplateFn({ friends: filteredFriendsInitialList} );
        document.getElementById('customFriendsList').insertAdjacentHTML('beforeend', friendTemplateCompiled);
    });

    document.getElementById('save').addEventListener('click',(e) => {
        e.preventDefault();

        if(listedFriendsIds.length>0) {
            VK.api( 'users.get', {
                'user_ids': listedFriendsIds.join(','),
                'fields': 'nickname,photo_100'
            }, (response) => {
                if( response.error ) {
                    reject( new Error(response.error.error_msg) );
                } else {
                    if( response.error ) {
                        reject( new Error(response.error.error_msg) );
                    } else {
                        let friendsResponse = response.response;
                        localStorage.friendListListed = JSON.stringify(friendsResponse);
                    }
                }
            });

            alert('Current friends list is saved');
        }
    })
} );
