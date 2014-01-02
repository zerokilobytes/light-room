var Bulb = function(context) {
    this.context = context;
    this.init();
};

Bulb.prototype = {
    init: function() {
        Entity.prototype.init.call(this);

        this.type = "enemy";
        this.bodyVector = new Vector2D(154, 255);
        this.canRotate = false;
    },
    show: function(positionVector) {
        this.spawn(positionVector);
    },
    spawn: function(positionVector) {
        this.enabled = true;
        var image = Resource.get('bulb');

        this.createSkin(image, this.bodyVector);
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
    createSkin: function(image, positionVector) {
        this.skin = EntitySkin.createBitmap(image, positionVector);
    },
    createEntityBody: function(postion) {
        var scale = this.context.settings.scale;
        var pos = new Vector2D(postion.x / scale, postion.y / scale);
        var vec = new Vector2D((this.bodyVector.x / 2.0) / scale, (this.bodyVector.y / 2.0) / scale);

        var body = EntityBody.getPolygonShape(this.context, pos, vec);

        body.SetUserData(this);
        body.SetAngle(0);
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