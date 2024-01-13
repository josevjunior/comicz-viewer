
const fs = require('fs');

module.exports = {
    template: fs.readFileSync(__dirname + '/fit-width-icon.svg', 'utf-8')
}