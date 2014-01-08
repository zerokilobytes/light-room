var Curtain = function(context) {
    this.context = context;
    this.type = "curtain";
    this.body = null;
    this.active = false;
    this.init();
};

Curtain.prototype = {
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
        var curtain = Resource.get("curtain");
        var x = this.context.settings.screeSize.width - 200;

        var curtainBitmap = this.createSkin(curtain);
        curtainBitmap.x = x;
        curtainBitmap.y = positionVector.y;

        this.context.stage.addChild(curtainBitmap);

        Entity.prototype.spawn.call(this);
    },
    update: function() {

    },
    getBody: function() {
        return Entity.prototype.getBody.call(this);
    },
    createSkin: function(image) {
        return EntitySkin.createBitmap(image);
    }
};