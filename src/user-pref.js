
const device = require('./device');
const consts = require('./constants');

const str = localStorage;

const defaultValues = {
    zoomType: device.isLandscape() ? consts.FULL_HEIGHT_ZOOM : consts.FULL_WIDTH_ZOOM
}

function getPreferences(){

    let value;
    try {
        value = JSON.parse(str.getItem('cz-user-pref') || '{}');
    }catch(e) {
        value = {};
    }

    Object.keys(defaultValues).forEach(function (key) {
        value[key] = value[key] || defaultValues[key];
    });

    return value;
 
}

function savePreferences(pref) {
    str.setItem('cz-user-pref', JSON.stringify(pref));
}

module.exports = {
    getPreferences,
    savePreferences
}