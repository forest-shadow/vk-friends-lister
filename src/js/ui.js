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