var IMAGE_DIR = 'images/'
    , FILE_NAME_LEGEND = 'legend.js'
    , FILE_NAME_SPRITES = 'sprites.png'
    , Jimp = require('jimp')
    , fs = require('fs')
    , legend = {}
    , files = []
    , done = []
    , sprites = []
    , input
    , startTime = new Date().getTime();
;

// get array of files
fs.readdirSync(IMAGE_DIR).forEach(function (file) {
    if (file.indexOf('.png') !== -1) {
        files.push(IMAGE_DIR + file);
        done++;
    }
});

console.log(files);

new Jimp(32, files.length * 32, function (err, image) {
    var composed = this;
    for (var i = 0, l = files.length; i < l; i++) {
        (function (i) {
            console.log(i + ' is beginning');
            Jimp.read(files[i]).then(function (img) {
                composed.composite(img.resize(32, 32), 0, i * 32);
                console.log(i + ' is done');
                done--;
                if (done === 0) {
                    composed.deflateLevel(6);
                    composed.filterType(Jimp.PNG_FILTER_AUTO);
                    composed.write(FILE_NAME_SPRITES, function (writeError) {
                        var total = new Date().getTime() - startTime;
                        console.log(writeError);
                        console.log('written in ' + total + ' ms');
                    });
                }
            }).catch(function (err) {
                console.log(err);
            });
        })(i);
    }

});
