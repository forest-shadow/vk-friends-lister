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