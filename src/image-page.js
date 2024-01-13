
function ImagePage(pageUrl){
    
    // Propeties
    let self = this;
    self.img = undefined;
    
    let loaded = false;
    let errorOnLoad = false;
    let resolver = undefined; 
    let rejector = undefined; 

    // Methods
    self.ready = ready;

    init();

    function init() {
        const imgEl = new Image();
        imgEl.onload = function() {
            loaded = true;
            if(resolver) {
                setTimeout(() => resolver());
            }
        }

        imgEl.onerror = function() {
            loaded = true;
            errorOnLoad = true;
            if(rejector){
                setTimeout(() => rejector());
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