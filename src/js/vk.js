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