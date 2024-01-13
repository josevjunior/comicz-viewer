
require('./viewer-info.css');

const fs = require('fs');
const consts = require('../../constants');
const userPrefs = require('../../user-pref');

module.exports = {
    template: fs.readFileSync(`${__dirname}/viewer-info.html`, 'utf-8'),
    props: ['title', 'backToSiteFn', 'sharePageFn', 'currentPage', 'pagesAmount'],
    data() {
        return {
            isOverlayOpen: false,
            isSideBarOpen: false,
            prefs: userPrefs.getPreferences(),
            FULL_HEIGHT_ZOOM: consts.FULL_HEIGHT_ZOOM,
            FULL_WIDTH_ZOOM: consts.FULL_WIDTH_ZOOM
        }
    },
    computed: {
        fitHeightSelected() {
            return consts.FULL_HEIGHT_ZOOM == this.prefs.zoomType;
        },
        fitWidthSelected() {
            return consts.FULL_WIDTH_ZOOM == this.prefs.zoomType;
        }
    },
    methods: {
        goBackToSite(){
            if(this.backToSiteFn)
                this.backToSiteFn()
        },
        sharePage(){
            if(this.sharePageFn)
                this.sharePageFn()
        },
        notifyZoomSelected(zoomType){
            this.prefs.zoomType = zoomType;
            userPrefs.savePreferences(this.prefs);
            this.$emit('zoom-type-selected', zoomType);

        },
        notifySliderChanged(newValue){
            this.$emit('slider-changed', newValue)
        },
        openModal() {
            this.isSideBarOpen = !this.isSideBarOpen;
        }
    }
};