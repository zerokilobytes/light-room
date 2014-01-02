var EntitySkin = function() {
};

EntitySkin.prototype = {
};

EntitySkin.createBitmap = function(image, positionVector) {
    var bitmap = new createjs.Bitmap(image);
    var scaleVector = {x: 1, y: 1};

    //Initialize Bitmap
    bitmap.x = positionVector.x;
    bitmap.y = positionVector.y;
    bitmap.regX = positionVector.x / 1;
    bitmap.regY = positionVector.y / 1;
    bitmap.snapToPixel = true;
    bitmap.mouseEnabled = true;

    //Scale Image
    //bitmap.scaleX = scaleVector.x;
    //bitmap.scaleY = scaleVector.y;
    return bitmap;
};