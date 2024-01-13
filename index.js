
require('./dist/bundle.css');

const ComiczViewer = require('./src/components/viewer/comicz-viewer');
const ViewerInfo = require('./src/components/info/viewer-info');

const FitHeightIcon = require('./src/components/svg-icons/fit-height-icon');
const FitWidthIcon = require('./src/components/svg-icons/fit-width-icon');

const PlainButton = require('./src/components/base/plain-button/plain-button');
const RangeSlider = require('./src/components/base/range-slider/range-slider');
const Spinner = require('./src/components/base/spinner/spinner');

function init(appId, props) {

    const app = Vue.createApp(ComiczViewer,  {
        title: props.title,
        issue: props.issue,
        pages: props.pages,
        parentWin: props.window || window.top
    });

    app.component('ViewerInfo', ViewerInfo);
    app.component('FitHeightIcon', FitHeightIcon);
    app.component('FitWidthIcon', FitWidthIcon);
    app.component('PlainButton', PlainButton);
    app.component('RangeSlider', RangeSlider);
    app.component('Spinner', Spinner);
    app.mount(appId);
}

module.exports = {
    init
};