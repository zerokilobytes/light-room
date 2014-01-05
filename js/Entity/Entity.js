var Entity = function() {
    throw new Error("Entity object cannot be instantiated");
};
Entity.prototype = {
    init: function() {
        this.skin = null;
        this.body = null;
        this.actor = null;
        this.scaleVector = new Vector2D(1.0, 1.0);
    },
    spawn: function() {

    },
    update: function() {
        var scale = Global.scale;
        
        if (this.canRotate) {
            this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
        }
        if (this.skin) {
            this.skin.x = (this.body.GetWorldCenter().x * scale);
            this.skin.y = (this.body.GetWorldCenter().y * scale);
        }
    },
    createSkin: function(image, positionVector, centerVector) {

    },
    createEntityBody: function(postion, scale) {

    },
    destroy: function() {
        this.enabled = false;
        var position = this.getPosition();
        var world = this.context.world;
        var body = this.body;
        world.DestroyBody(body);
        this.removeSkin();
        if (this.type === "enemy") {
            this.context.modelManager.pop(position);
        }
    },
    removeSkin: function() {
        this.context.stage.removeChild(this.skin.getBitmap());
    },
    pop: function(position) {
        this.context.modelManager.pop(position);
    },
    getAbsolutePosition: function() {
        var scale = Global.scale;
        var box2dVec = this.body.GetPosition();
        return new Vector2D(box2dVec.x * scale, box2dVec.y * scale);
    }
};