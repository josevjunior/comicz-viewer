
require('./spinner.css');
const fs = require('fs');

module.exports = {
    template: fs.readFileSync(__dirname + '/spinner.html', 'utf-8')
}