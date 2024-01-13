
function isLandscape(){
    return window.innerWidth >= window.innerHeight;
}

function isPortrait() {
    return !isLandscape();
}

module.exports = {
    isPortrait,
    isLandscape
}