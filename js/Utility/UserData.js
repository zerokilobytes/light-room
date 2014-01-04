var UserData = function(id, verticesVec, texture, type) {
    this.id = null;
    this.texture = null;
    this.skin = null;
    this.type = type;
    this.init(id, verticesVec, texture);
};

UserData.prototype = {
    init: function(id, verticesVec, texture) {
        var image = Resource.get('crate');

        this.id = id;
        this.texture = texture;

        var m = new createjs.Matrix2D();
        m.tx = -texture.width * 0.5;
        m.ty = -texture.height * 0.5;

        var stage = new createjs.Stage();
        //Create a Shape DisplayObject.
        shape = new createjs.Shape();

        shape.graphics.beginBitmapFill(image);

        shape.graphics.moveTo(verticesVec[0].x * Global.scale, verticesVec[0].y * Global.scale);
        for (var i = 1; i < verticesVec.length; i++) {
            shape.graphics.lineTo(verticesVec[i].x * Global.scale, verticesVec[i].y * Global.scale);
        }
        shape.graphics.lineTo(verticesVec[0].x * Global.scale, verticesVec[0].y * Global.scale);
        shape.graphics.closePath();

        stage.addChild(shape);
        stage.update();
        this.skin = shape;
    }
};