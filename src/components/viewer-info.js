
require('./viewer-info.css')

const fs = require('fs');
const DOMUtils = require('../util/dom-util');

const htmlTemplate = fs.readFileSync(__dirname + '/viewer-info.html');

function ViewerInfo() {

    const self = this;

    const element = DOMUtils.parseTemplate(htmlTemplate);
    const titleContent = DOMUtils.requireElement(element, '.title-content h2');
    const optionsBtn = DOMUtils.requireElement(element, '.options-btn');
    const modalEl = DOMUtils.requireElement(element, '.modal');
    const backToSiteBtn = DOMUtils.requireElement(element, '.modal .back-to-site');
    const sharePageBtn = DOMUtils.requireElement(element, '.modal .share-page');

    let modalOpened = false;
    let sharePageFn = null;
    let backToSiteFn = null;

    // Public Members
    self.element = element;
    self.setTitle = setTitle;
    self.isModalOpened = isModalOpened;
    self.closeModal = closeModal;
    self.onBackToSiteClick = onBackToSiteClick;
    self.onSharePageClick = onSharePageClick;

    init();

    function init() {
        optionsBtn.addEventListener('click', function(e) {
            modalEl.classList.toggle('hidden');
            modalOpened = !modalEl.classList.contains('hidden');
        });

        sharePageBtn.addEventListener('click', function() {
            if(sharePageFn) sharePageFn();
        })

        backToSiteBtn.addEventListener('click', function() {
            if(backToSiteFn) backToSiteFn();
        })

    }

    function isModalOpened() {
        return modalOpened;
    }

    function closeModal(){
        modalEl.classList.add('hidden');
        modalOpened = false;
    }

    function setTitle(title) {
        titleContent.innerHTML = title;
    }

    function onBackToSiteClick(callback) {
        backToSiteFn = callback;
    }

    function onSharePageClick(callback) {
        sharePageFn = callback;
    }

}

module.exports = ViewerInfo;