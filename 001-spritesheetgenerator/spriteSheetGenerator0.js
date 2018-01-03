var IMAGE_DIR = 'images/'
    , FILE_NAME_LEGEND = 'legend.js'
    , FILE_NAME_SPRITES = 'sprites.png'
    , Jimp = require('jimp')
    , fs = require('fs')
    , legend = {}
    , files = []
    , sprites = []
    , input
    , startTime = new Date().getTime();
;

// get array of files
fs.readdirSync(IMAGE_DIR).forEach(function (file) {
    if (file.indexOf('.png') !== -1) {
        files.push(IMAGE_DIR + file);
    }
});

console.log(files);

new Jimp(32, files.length * 32, function (err, image) {
    nextImage(this, 0, files.length);
});

function nextImage(composed, current, max) {
    if (current < max) {
        Jimp.read(files[current]).then(function (img) {
            composed.composite(img.resize(32, 32), 0, current * 32);
            setTimeout(function () {
                nextImage(composed, current + 1, max);
            }, 0);
        }).catch(function (err) {
            console.log(err);
        });
    } else {
        writeToFile(composed);
    }
}

function writeToFile(composed) {
    composed.deflateLevel(6);
    composed.filterType(Jimp.PNG_FILTER_AUTO);
    composed.write(FILE_NAME_SPRITES, function (writeError) {
        var total = new Date().getTime() - startTime;
        console.log(writeError);
        console.log('written in ' + total + ' ms');
    });

}
