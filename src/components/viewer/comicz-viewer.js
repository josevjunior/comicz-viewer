
if(!document || !window) {
    throw new Error('Cannot init viewer. Document not present in this context');
}

require('./comicz-viewer.css');

const fs = require('fs');

const UrlPageTracker = require('../../url-page-tracker');
const PageCollection = require('../../page-collection');
const consts = require('../../constants');
const userPref = require('../../user-pref');

module.exports = {
    template: fs.readFileSync(__dirname + '/comicz-viewer.html', 'utf-8'),
    props: ['pages', 'title', 'site', 'issue', 'parentWin'],
    data() {
        return {
            pagesCol: PageCollection.of(this.pages, 5),
            pageTracker: new UrlPageTracker(this.parentWin),
            overlayVisible: false,
            loadingImage: false
        }
    },
    methods: {
        
        updateImage(resizeImage = false) {
            for(const el of this.currentImageRef.children){
                if(el.tagName == 'IMG'){
                    this.currentImageRef.removeChild(el);
                }
            }
    
            //applyImgStyle();
    
            if(resizeImage) {
                this.resizeImg();
            }
    
            this.currentImageRef.append(this.pagesCol.getCurrent().img);        
        },

        resizeImg() {

            if(this.pagesCol.size() == 0) {
                console.debug('No pages/images');
                return;
            }

            const pref = userPref.getPreferences();
            if(pref.zoomType == consts.FULL_HEIGHT_ZOOM) {
                this.applyFullHeightZoom();
            } else {
                this.applyFullWidthZoom();
            }
            
    
            /*if(window.innerHeight < window.innerWidth){ 
    
                const prefHeight = window.innerHeight * 0.95;
                const current = this.pagesCol.getCurrent().img;
                
                current.style.width = "auto";
                current.style.height = `${prefHeight}px`;
    
            } else {
    
                const prefWidth = window.innerWidth * 0.95;
                const current = this.pagesCol.getCurrent().img;
                
                current.style.width = `${prefWidth}px`;
                current.style.height = "auto";
    
            }*/
            
        },

        applyFullWidthZoom() {
            const imgEl = this.pagesCol.getCurrent().img;
            imgEl.style.height = 'auto';
            imgEl.style.width = '100vw';

            imgEl.style['max-width'] = '';
            imgEl.style['max-height'] = '';
        },

        applyFullHeightZoom() {
            const imgEl = this.pagesCol.getCurrent().img;
            imgEl.style['max-height'] = '100vh';
            imgEl.style.width = 'auto';

            imgEl.style.height = '';
            imgEl.style['max-width'] = '';
        },

        handleViewerClick(e) {
            const source = e.target || e.srcElement;

            console.debug('Source: ', source);

            if("overlay" == source.id){
                this.overlayVisible = false;
                return;
            } else if("imageViewer" != source.id){
                return;
            }

            const viewerStyle = window.getComputedStyle(this.imageViewerRef);
            const currentWidth = parseInt(viewerStyle.width.replace('px'));
            const pointX = e.clientX;            

            if(pointX <= (currentWidth * 0.25)) {
                if(this.pagesCol.hasPrevious()) this.previousImage();
            } else if (pointX >= (currentWidth * 0.75)) {
                if (this.pagesCol.hasNext()) this.nextImage();
            } else {
                this.overlayVisible = true;
            }

        },

        previousImage() {
            this.loadingImage = true;
            this.pagesCol.goPrevious().ready().then(_ => {
                this.loadingImage = false;
                this.updateImage(true);
                this.scrollToTop();
            });
            
        },
    
        nextImage() {
            this.loadingImage = true;
            this.pagesCol.goNext().ready().then(_ => {
                this.loadingImage = false;
                this.updateImage(true);
                this.scrollToTop();
            });
            
        },

        handleWindowResize(e) {
            this.resizeImg();
        },

        handleKeyDownEvents(e) {
            if (e.key === 'ArrowLeft' && this.pagesCol.hasPrevious()) {
                this.previousImage();
            } else if (e.key === 'ArrowRight' && this.pagesCol.hasNext()) {
                this.nextImage();
            }
        },

        onZoomTypeSelected(value){
            if(consts.FULL_HEIGHT_ZOOM == value){
                this.applyFullHeightZoom();
            } else if (consts.FULL_WIDTH_ZOOM == value) {
                this.applyFullWidthZoom();
            }
        },

        onSliderChanged(value) {
            this.pagesCol.getAndSelect(value-1);
            this.updateImage(true);
            this.scrollToTop();
        },

        scrollToTop(){
            this.parentWin.scrollTo({
                top: 0,
                behaviour: 'smooth'
            })
        }
    },
    setup() {
        return {
            imageViewerRef: Vue.ref(null),
            currentImageRef: Vue.ref(null)
        }
    },
    mounted() {
        console.debug('Syncing viewer with page url...');
        const {page: pageNumber} = this.pageTracker.getParams();

        this.pagesCol.getAndSelect( (pageNumber <= 0 || pageNumber > this.pagesCol.size()) ? 0 : (pageNumber-1));

        this.updateImage(true);

        //window.addEventListener('resize', this.handleWindowResize);
        document.addEventListener('keydown', this.handleKeyDownEvents);
    },
    unmounted() {
        //window.removeEventListener('resize', this.handleWindowResize);
        document.removeEventListener('keydown', this.handleKeyDownEvents);
    }
}