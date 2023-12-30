
function requireNonNull(obj, msg){
    if(!obj){
        throw new Error(msg);
    }

    return obj;
}

function requireNonEmpty(obj, msg){
    if(!obj || (Array.isArray(obj) && obj.length == 0)){
        throw new Error(msg);
    }

    return obj[0];
}

module.exports = {
    requireNonNull,
    requireNonEmpty
}