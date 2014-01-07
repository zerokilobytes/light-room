var AntiqueFrame = function(context) {
    this.context = context;
    this.type = "frame";
    this.body = null;
    this.active = false;
    this.bulb = null;
    this.init();
};

AntiqueFrame.prototype = {
    init: function() {
        Entity.prototype.init.call(this);

        this.bodyVector = null;
        this.canRotate = true;
    },
    show: function(positionVector) {
        this.spawn(positionVector);
    },
    spawn: function(positionVector) {
        this.enabled = true;
        var frame = Resource.get("frame");
        var background = Resource.get("mona_bg");
        var mona1 = Resource.get("mona1");

        this.bodyVector = new Vector2D(frame.width, frame.height);

        var frameBitmap = this.createSkin(frame);
        frameBitmap.x = positionVector.x;
        frameBitmap.y = positionVector.y;

        var bgBitmap = this.createSkin(background);
        bgBitmap.x = positionVector.x;
        bgBitmap.y = positionVector.y;

        var mona1Bitmap = this.createSkin(mona1);
        mona1Bitmap.x = positionVector.x;
        mona1Bitmap.y = positionVector.y;

        this.context.stage.addChild(bgBitmap);
        this.context.stage.addChild(mona1Bitmap);
        this.context.stage.addChild(frameBitmap);

        Entity.prototype.spawn.call(this);
    },
    update: function() {
        //Entity.prototype.update.call(this);
    },
    getSkin: function() {
        return Entity.prototype.getSkin.call(this);
    },
    getBody: function() {
        return Entity.prototype.getBody.call(this);
    },
    createSkin: function(image) {
        return EntitySkin.createBitmap(image);
    }
};