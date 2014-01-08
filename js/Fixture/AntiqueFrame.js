var AntiqueFrame = function(context) {
    this.context = context;
    this.type = "frame";
    this.body = null;
    this.active = false;
    this.bulb = null;
    this.interval = 0;
    this.direction = 1;
    this.monaSprite = null;
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

        this.mona1Bitmap = this.createSkin(mona1);
        this.mona1Bitmap.x = positionVector.x;
        this.mona1Bitmap.y = positionVector.y;

        //this.mona1Bitmap.skewX = -10;
        //mona1Bitmap.skewY = 2;

        this.context.stage.addChild(bgBitmap);

        this.loadSprite();
        this.monaSprite.x = positionVector.x - 170;
        this.monaSprite.y = positionVector.y - 220;

        this.context.stage.addChild(frameBitmap);

        this.play();
        Entity.prototype.spawn.call(this);

       
    },
    update: function() {

    },
    loadSprite: function() {
        var spriteSheet =
                {
                    "images": [Resource.loader.getResult("mona_sprite")],
                    "animations": {
                        forward: {
                            frames: [0, 1, 2, 3],
                            next: "backward",
                            frequency: 32
                        },
                        backward: {
                            frames: [3, 2, 1, 0],
                            next: "forward",
                            frequency: 32
                        }
                    },
                    "frames": {"width": 373, "height": 462, "regX": 0, "count": 4, "regY": 0}
                };
        // Spritesheet creation
        var sheet = new createjs.SpriteSheet(spriteSheet);

        // BitmaAnimation 
        this.monaSprite = new createjs.BitmapAnimation(sheet);

        // Display the smoke BitmapAnimation
        this.context.stage.addChild(this.monaSprite);
    },
    play: function() {
        var animation = "forward";

        // Start the animation
        this.monaSprite.gotoAndPlay(animation);
    },
    getBody: function() {
        return Entity.prototype.getBody.call(this);
    },
    createSkin: function(image) {
        return EntitySkin.createBitmap(image);
    }
};