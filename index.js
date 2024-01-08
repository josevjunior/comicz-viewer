
require('./dist/bundle.css');

const ComiczViewer = require('./src/components/viewer/comicz-viewer');
const ViewerInfo = require('./src/components/info/viewer-info');

function init(appId, props) {

    const app = Vue.createApp(ComiczViewer,  {
        title: props.title,
        issue: props.issue,
        pages: props.pages,
        parentWin: props.window || window.top
    });

    app.component('ViewerInfo', ViewerInfo);
    app.mount(appId);
}

module.exports = {
    init
};