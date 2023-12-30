
const ObjectUtil = require('./object-util');

const parser = new DOMParser();

function parseTemplate(htmlTemplate) {
    const dom = parser.parseFromString(htmlTemplate, 'text/html');
    if(dom.children.length == 0) {
        throw new Error('Empty children template');
    }

    return dom.body.firstChild;
}

function injectTemplate(htmlTemplate, parent) {

    const dom = parser.parseFromString(htmlTemplate, 'text/html');
    if(dom.children.length == 0) {
        throw new Error('Empty children template');
    }

    let domChild = dom.body.firstChild;
    while(domChild) {
        const nextSibling = domChild.nextElementSibling;
        parent.append(domChild);
        domChild = nextSibling;
    }
}

function requireElement(parent, selector) {
    return ObjectUtil.requireNonNull(parent.querySelector(selector), `${selector} not found`);
}

module.exports = {
    parseTemplate,
    injectTemplate,
    requireElement
}