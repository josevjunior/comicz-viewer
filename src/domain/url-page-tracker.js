
const validParams = ['page'];

function UrlPageTracker(targetWindow) {

    const self = this;

    let trackParams = parseParamsFromUrl();

    self.getParams = getParams;
    self.updateParams = updateParams;

    function getParams() {
        return trackParams;
    }

    function parseParamsFromUrl() {
        const urlParams = new URLSearchParams(targetWindow.location.search);

        return  {
            page: forceParseInt(urlParams.get('cz-page'))
        }
    }

    function updateParams() {

        const newQueryParam = {};

        validParams.forEach(function (paramName) {

            const paramValue = trackParams[paramName];
            newQueryParam[`cz-${paramName}`] = `${paramValue}`;

        });

        const url = new URL(targetWindow.location);
        Object.keys(newQueryParam).forEach(function (paramName) {
            url.searchParams.set(paramName, newQueryParam[paramName]);
        });
        targetWindow.history.pushState({}, '', url);
    }

    function forceParseInt(value) {
        if(!value) {
            return 1;
        }

        const intValue = parseInt(value);
        if(isNaN(intValue) || !isFinite(intValue)) {
            return 1;
        }

        return intValue;
    }

}

module.exports = UrlPageTracker;