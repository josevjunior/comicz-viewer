
const fs = require('fs');

module.exports = {
    template: fs.readFileSync(__dirname + '/plain-button.html', 'utf-8')
}