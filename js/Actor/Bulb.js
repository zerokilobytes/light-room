var Bulb = function(context) {
    this.context = context;
    this.init();
};

Bulb.prototype = {
    init: function() {
        this.type = "enemy";
        this.bodyVector = new Vector2D(154, 255);
        Entity.prototype.init.call(this);
        this.scaleVector = new Vector2D(1, 1);
        this.canRotate = false;
    },
    show: function(positionVector) {
        this.spawn(positionVector);
    },
    spawn: function(positionVector) {
        this.enabled = true;
        var scale = this.context.settings.scale;

        this.skin = this.createSkin(Resource.get('bulb'), positionVector, this.bodyVector);
        this.body = this.createEntityBody(positionVector, scale).body;
        this.body.SetAngle(0);
        this.context.stage.addChild(this.skin.getBitmap());

        Entity.prototype.spawn.call(this);
    },
    update: function() {
       
        Entity.prototype.update.call(this);
        this.skin.getBitmap().rotation = this.body.GetAngle() * (180 / Math.PI);

    },
    getSkin: function() {
        return Entity.prototype.getSkin.call(this);
    },
    getBody: function() {
        return Entity.prototype.getBody.call(this);
    },
    createSkin: function(image, positionVector) {
        return Entity.prototype.createSkin.call(this, image, positionVector, this.bodyVector);
    },
    createEntityBody: function(postion, scale) {
        return Entity.prototype.createEntityBody.call(this, postion, scale);
    },
    destroy: function() {
        Visual.Effects.displayToadExplosion(this.getAbsolutePosition());
        Sound.play(Sound.EXPLODE);
        Entity.prototype.destroy.call(this);

        for (var i = 1; i <= 3; i++) {
            var a = MathFunc.getRandomArbitrary(1, 360) * Math.PI / 180;
            var pos = this.getAbsolutePosition();
            var rad = 30;
            var radX = rad * Math.cos(a);
            var radY = rad * Math.sin(a);
            var piece = new BodyPart(this.context);
            piece.spawn(new Vector2D(pos.x + radX, pos.y + radY));
            this.context.modelManager.add(piece);
        }
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