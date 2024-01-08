
const fs = require('fs');

async function processCSSBundle() {

    const postcss = require('postcss');
    const autoprefixer = require('autoprefixer');
    const tailwindcss = require('tailwindcss');

    const postcssResult = await postcss([autoprefixer, tailwindcss]).process(fs.readFileSync('index.css', 'utf-8'), {from: 'index.css', to: 'dist/bundle.css'});

    fs.writeFile('dist/bundle.css', postcssResult.css, () => true);
    if ( postcssResult.map ) {
        fs.writeFile('dist/bundle.css.map', postcssResult.map.toString(), () => true)
    }
}

function processJSBundle(onFinish) {

    const browserify = require('browserify');

    const b = browserify('index.js', {standalone: 'ComiczViewer'});
    b.transform('browserify-css')
    .transform('brfs');

    const writeStream = fs.createWriteStream('./dist/bundle.js');
    if(onFinish) 
        writeStream.on('finish', onFinish);    

    b.bundle().pipe(writeStream);

}

(async function(){
    
    await processCSSBundle();
    processJSBundle(() => {
        const express = require('express');
        const app = express();

        app.use(express.static(__dirname + '/'));

        const port = 5500;
        app.listen(port, () => {
            console.log(`Listening to port ${port}...`)
        });
    });

})().then();

