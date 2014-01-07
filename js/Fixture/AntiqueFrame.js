var AntiqueFrame = function(context) {
    this.context = context;
    this.type = "frame";
    this.body = null;
    this.active = false;
    this.bulb = null;
    this.interval = 0;
    this.direction = 1;
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
        var _this = this;
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

        this.mona1Bitmap = this.createSkin(mona1);
        this.mona1Bitmap.x = positionVector.x;
        this.mona1Bitmap.y = positionVector.y;

        //this.mona1Bitmap.skewX = -10;
        //mona1Bitmap.skewY = 2;

        this.context.stage.addChild(bgBitmap);
        this.context.stage.addChild(this.mona1Bitmap);
        this.context.stage.addChild(frameBitmap);

        Entity.prototype.spawn.call(this);

        var timer = function move() {
//            if (_this.lapse > 0 && _this.lapse % 2 === 0) {
//                // console.log(_this.lapse);
//            }
//            else {
//
//            }

            if (_this.interval >= 3) {
                _this.direction = _this.direction * -1;
            }

            if (_this.interval <= -3) {
                _this.direction = 1;
            }

            setTimeout(timer, 500);
            _this.interval = _this.interval + _this.direction;
        };

        timer();
    },
    update: function() {
        var sin = Math.sin(MathFunc.toRadiant(this.interval));
        var cos = Math.cos(MathFunc.toRadiant(this.interval));
        this.mona1Bitmap.skewY = sin * 100;
        //this.mona1Bitmap.skewX = cos * 1 * this.direction;
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