
const ImagePage = require('./image-page');

function of(pages, loadSize = 5) {
    return new PageCollection(pages, loadSize);
}

function PageCollection(pages, loadSize) {

    let self = this;

    self.loadedPages = {};
    self.currentIndex = 0;

    self.size = size;
    self.get = get;
    self.getAndSelect = getAndSelect;
    self.hasNext = hasNext;
    self.hasPrevious = hasPrevious;
    self.goNext = goNext;
    self.goPrevious = goPrevious;
    self.getCurrent = getCurrent;

    init();
    
    function init() {
        for(let i = 0; i < Math.min(loadSize, pages.length); i++){
            self.loadedPages[i] = new ImagePage(pages[i]);
        }
    }
    
    function size() {
        return pages.length;
    }

    function getAndSelect(index){
        const r = self.get(index);
        self.currentIndex = index;
        return r;
    }

    function hasNext() {
        return self.currentIndex < (pages.length - 1);
    }

    function hasPrevious() {
        return self.currentIndex > 0;
    }

    function goNext(){
        return self.getAndSelect(self.currentIndex + 1);
    }

    function goPrevious() {
        return self.getAndSelect(self.currentIndex - 1);
    }

    function get(index = 0) {
        if(index <= 0 && index >= pages.length){
            throw Error('IndexOutOfBounds: ', index, '. Collection size: ', size());
        }

        let img = self.loadedPages[index];
        if(!img) {
            img = new ImagePage(pages[i]);
        }

        return img;
    }

    function getCurrent() {
        return self.get(self.currentIndex);
    }

}

module.exports = {
    of
};