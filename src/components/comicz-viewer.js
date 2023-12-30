
if(!document || !window) {
    throw new Error('Cannot init viewer. Document not present in this context');
}

require('./comicz-viewer.css');

const fs = require('fs');
const ObjectUtils = require('../util/object-util');
const DOMUtils = require('../util/dom-util');

const UrlPageTracker = require('../domain/url-page-tracker');
const PageCollection = require('../domain/page-collection');
const ViewerInfo = require('./viewer-info');

const htmlTemplate = fs.readFileSync(__dirname + '/comicz-viewer.html');


function init(elementRef, context) {
    let element = typeof elementRef == 'string' ? document.getElementById(elementRef) : elementRef;
    DOMUtils.injectTemplate(htmlTemplate, element);

    return new PageViewer(element, context);
}

function PageViewer(element, context) {

    const self = this;
    const {pages, title, targetWindow, site, issue} = context;

    ObjectUtils.requireNonNull(element, 'Root page viewer element not found');
    ObjectUtils.requireNonEmpty(pages, 'Pages cannot be empty');

    // <div class="image-viewer">
    self.imgViewerEl = ObjectUtils.requireNonNull(element.querySelector('.cz-image-viewer'), '.cz-image-viewer not found');
    // <div class="current-image">
    self.currentImgEl = ObjectUtils.requireNonNull(self.imgViewerEl.querySelector('.current-image'), '.current-image not found');
    // <div class="overlay">
    self.overlayEl = ObjectUtils.requireNonNull(element.querySelector('.overlay'), '.overlay not found');

    const pageTracker = new UrlPageTracker(targetWindow || window.top);
    const viewerInfo = new ViewerInfo();
    const loadedPages = PageCollection.of(pages, 5/*Load size*/);

    init();

    function init(){
        viewerInfo.setTitle(title.concat(issue ? ` - #${issue}` : ""));
        syncUrlParamsWithViewer();
        updateImage(true);
        setUpListeners();
    }

    function syncUrlParamsWithViewer() {
        const {page: pageNumber} = pageTracker.getParams();

        loadedPages.getAndSelect( (pageNumber <= 0 || pageNumber > loadedPages.size()) ? 0 : (pageNumber-1));
    }

    function updateImage(resizeImage = false) {
        while (self.currentImgEl.firstChild) {
            self.currentImgEl.removeChild(self.currentImgEl.firstChild);
        }

        //applyImgStyle();

        if(resizeImage) {
            resizeImg();
        }

        self.currentImgEl.append(loadedPages.getCurrent().img);        
    }

    function setUpListeners(){
        window.addEventListener('resize', handleWindowResize);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && loadedPages.hasPrevious()) {
                previousImage();
            } else if (e.key === 'ArrowRight' && loadedPages.hasNext()) {
                nextImage();
            }
        });

        document.body.addEventListener('click', handleViewerClick);

        viewerInfo.onBackToSiteClick(function() {
            if(site){
                (targetWindow || window.top).location.replace(site);
            }            
        });
    }

    function previousImage() {
        loadedPages.goPrevious();
        updateImage(true);
    }

    function nextImage() {
        loadedPages.goNext();
        updateImage(true);
    }

    function resizeImg() {

        if(loadedPages.size() == 0) {
            console.debug('No pages/images');
            return;
        }

        if(window.innerHeight < window.innerWidth){ 

            const prefHeight = window.innerHeight * 0.95;
            const current = loadedPages.getCurrent().img;
            
            current.style.width = "auto";
            current.style.height = `${prefHeight}px`;

        } else {

            const prefWidth = window.innerWidth * 0.95;
            const current = loadedPages.getCurrent().img;
            
            current.style.width = `${prefWidth}px`;
            current.style.height = "auto";

        }
        
    }

    function handleViewerClick(e) {

        const source = e.target || e.srcElement;

        console.log('Source: ', source);

        if(source != self.overlayEl){
            return;
        }

        const viewerStyle = window.getComputedStyle(self.imgViewerEl);

        const currentWidth = parseInt(viewerStyle.width.replace('px'));
        const pointX = e.clientX;
    
        if(pointX <= (currentWidth * 0.25)) {
            if(loadedPages.hasPrevious()) previousImage();
        } else if (pointX >= (currentWidth * 0.75)) {
            if (loadedPages.hasNext()) nextImage();
        } else {

            if(viewerInfo.isModalOpened()) {
                viewerInfo.closeModal();
                return;
            }

            self.overlayEl.classList.toggle('active');
            if(self.overlayEl.classList.contains('active')){
                self.overlayEl.append(viewerInfo.element);
            } else {
                self.overlayEl.removeChild(viewerInfo.element);
            }
        }
        
    }

    function handleWindowResize(e) {
        resizeImg();
    }

}


module.exports = {
    init
}