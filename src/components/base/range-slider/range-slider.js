
require('./range-slider.css');

const fs = require('fs');

module.exports = {
    template: fs.readFileSync(__dirname + '/range-slider.html', 'utf-8'),
    props: ['max', 'value'],
    methods: {
        notifyChange(event) {
            this.$emit('value-changed', event.target.value);
        }
    }
}