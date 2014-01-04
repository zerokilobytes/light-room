var EntitySkin = function() {
};

EntitySkin.prototype = {
};

EntitySkin.createBitmap = function(image) {
    var bitmap = new createjs.Bitmap(image);
    var vec = new Vector2D(image.width, image.height);

    bitmap.regX = vec.x / 2;
    bitmap.regY = vec.y / 2;
    bitmap.snapToPixel = true;
    bitmap.mouseEnabled = true;
    return bitmap;
};