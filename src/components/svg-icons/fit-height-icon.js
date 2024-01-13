
const fs = require('fs');

module.exports = {
    template: fs.readFileSync(__dirname + '/fit-height-icon.svg', 'utf-8')
}