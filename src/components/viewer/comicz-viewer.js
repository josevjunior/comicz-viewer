
if(!document || !window) {
    throw new Error('Cannot init viewer. Document not present in this context');
}

require('./comicz-viewer.css');

const fs = require('fs');

const UrlPageTracker = require('../../domain/url-page-tracker');
const PageCollection = require('../../domain/page-collection');

module.exports = {
    template: fs.readFileSync(__dirname + '/comicz-viewer.html', 'utf-8'),
    props: ['pages', 'title', 'site', 'issue', 'parentWin'],
    data() {
        return {
            pagesCol: PageCollection.of(this.pages, 5),
            pageTracker: new UrlPageTracker(this.parentWin),
            optionsVisible: false
        }
    },
    methods: {

        updateImage(resizeImage = false) {
            while (this.currentImageRef.firstChild) {
                this.currentImageRef.removeChild(this.currentImageRef.firstChild);
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
    
            if(window.innerHeight < window.innerWidth){ 
    
                const prefHeight = window.innerHeight * 0.95;
                const current = this.pagesCol.getCurrent().img;
                
                current.style.width = "auto";
                current.style.height = `${prefHeight}px`;
    
            } else {
    
                const prefWidth = window.innerWidth * 0.95;
                const current = this.pagesCol.getCurrent().img;
                
                current.style.width = `${prefWidth}px`;
                current.style.height = "auto";
    
            }
            
        },

        handleViewerClick(e) {
            const source = e.target || e.srcElement;

            console.log('Source: ', source);

            if(source != this.viewerOverlayRef){
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
    
                /*if(viewerInfo.isModalOpened()) {
                    viewerInfo.closeModal();
                    return;
                }*/
    
                this.viewerOverlayRef.classList.toggle('active');
                this.optionsVisible = this.viewerOverlayRef.classList.contains('active');
            }

        },

        previousImage() {
            this.pagesCol.goPrevious();
            this.updateImage(true);
        },
    
        nextImage() {
            this.pagesCol.goNext();
            this.updateImage(true);
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
        }
    },
    setup() {
        return {
            imageViewerRef: Vue.ref(null),
            viewerOverlayRef: Vue.ref(null),
            currentImageRef: Vue.ref(null)
        }
    },
    mounted() {
        console.debug('Syncing viewer with page url...');
        const {page: pageNumber} = this.pageTracker.getParams();

        this.pagesCol.getAndSelect( (pageNumber <= 0 || pageNumber > this.pagesCol.size()) ? 0 : (pageNumber-1));

        this.updateImage(true);

        window.addEventListener('resize', this.handleWindowResize);
        document.addEventListener('keydown', this.handleKeyDownEvents);
    },
    unmounted() {
        window.removeEventListener('resize', this.handleWindowResize);
        document.removeEventListener('keydown', this.handleKeyDownEvents);
    }
}