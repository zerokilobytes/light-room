var Bulb = function(context) {
    this.context = context;
    this.type = "bulb";
    this.init();
};

Bulb.prototype = {
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
        var image = Resource.get(this.type);

        this.bodyVector = new Vector2D(image.width, image.height);

        this.createSkin(image);
        this.createEntityBody(positionVector);

        this.context.stage.addChild(this.skin);

        Entity.prototype.spawn.call(this);
    },
    update: function() {
        Entity.prototype.update.call(this);
    },
    getSkin: function() {
        return Entity.prototype.getSkin.call(this);
    },
    getBody: function() {
        return Entity.prototype.getBody.call(this);
    },
    createSkin: function(image) {
        this.skin = EntitySkin.createBitmap(image);
    },
    createEntityBody: function(postion) {
        var scale = Global.scale;
        var pos = new Vector2D(postion.x / scale, postion.y / scale);
        var vec = new Vector2D((this.bodyVector.x / 2.0) / scale, (this.bodyVector.y / 2.0) / scale);

        var body = EntityBody.getPolygonShape(this.context, pos, vec);

        body.SetUserData(this);
        body.SetAngle(postion.rotation);
        this.body = body;

    },
    destroy: function() {
        Visual.Effects.displayToadExplosion(this.getAbsolutePosition());
        Sound.play(Sound.EXPLODE);
        Entity.prototype.destroy.call(this);
    },
    removeSkin: function() {
        Entity.prototype.removeSkin.call(this);
    },
    getPosition: function() {
        return this.body.GetPosition();
    },
    getAbsolutePosition: function() {
        return Entity.prototype.getAbsolutePosition.call(this);
    }
};