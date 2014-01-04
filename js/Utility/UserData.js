var UserData = function(id, verticesVec, texture) {
    this.id = null;
    this.texture = null;
    this.skin = null;
    this.type = "splinter";
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
        circle = new createjs.Shape();

        circle.graphics.beginBitmapFill(image);

        circle.graphics.moveTo(verticesVec[0].x * Global.scale, verticesVec[0].y * Global.scale);
        for (var i = 1; i < verticesVec.length; i++) {
            circle.graphics.lineTo(verticesVec[i].x * Global.scale, verticesVec[i].y * Global.scale);
        }
        circle.graphics.lineTo(verticesVec[0].x * Global.scale, verticesVec[0].y * Global.scale);
        circle.graphics.closePath();

        stage.addChild(circle);
        stage.update();
        //bitmap.mask = circle;
        this.skin = circle;

    }
};