
function ImagePage(pageUrl){
    
    // Propeties
    let self = this;
    self.img = undefined;
    self.loaded = false;
    self.errorOnLoad = false;

    let resolver = undefined; 
    let rejector = undefined; 

    // Methods
    self.ready = ready;

    init();

    function init() {
        const imgEl = new Image();
        imgEl.onload = function() {
            self.loaded = true;
            if(resolver) {
                resolver();
            }
        }

        imgEl.onerror = function() {
            self.loaded = true;
            self.errorOnLoad = true;
            if(rejector){
                rejector();
            }
            
        }

        imgEl.src = pageUrl;
        self.img = imgEl;
    }

    function ready() {
        return new Promise(function (resolve, reject) {
            if(loaded) {

                if(errorOnLoad){
                    reject();
                    return;
                }

                resolve();
                return;
            }

            self.resolver = resolve;
            self.rejector = reject;
        });
    }

}

module.exports = ImagePage;