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