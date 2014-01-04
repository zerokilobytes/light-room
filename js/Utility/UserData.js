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
        var bitmap = new createjs.Bitmap(image);

        this.id = id;
        this.texture = texture;
        // I use the matrix so that I can have the center of the shape I'm drawing match the center of the BitmapData image - I "move" the BitmapData projection left by half its width and up by half its height.
        // var m = new Matrix();
        var m = new createjs.Matrix2D();
        m.tx = -texture.width * 0.5;
        m.ty = -texture.height * 0.5;
        //m.scale(1, 1);
        // I then draw lines from each vertex to the next, in clockwise order and use the beginBitmapFill() method to add the texture.
        //this.graphics.lineStyle(1);





        var stage = new createjs.Stage();
        //Create a Shape DisplayObject.
        circle = new createjs.Shape();
        //circle.graphics.clear();

        //this.graphics.clear();
        //circle.graphics.beginStroke("#FFFFFF");
        //circle.graphics.beginBitmapFill(image, "no-repeat", m);


        circle.graphics.setStrokeStyle(1).beginStroke("red");

        circle.graphics.moveTo(verticesVec[0].x * Global.scale, verticesVec[0].y * Global.scale);
        for (var i = 1; i < verticesVec.length; i++) {
            circle.graphics.lineTo(verticesVec[i].x * Global.scale, verticesVec[i].y * Global.scale);
        }
        circle.graphics.lineTo(verticesVec[0].x * Global.scale, verticesVec[0].y * Global.scale);
        circle.graphics.closePath();


        //Update stage will render next frame



        //
        //circle.x = image.width;
        //circle.y = image.height;
        //circle.graphics.beginBitmapFill(image);

        stage.addChild(circle);
        stage.update();
        //bitmap.mask = circle;
        this.skin = bitmap;

        /* this.graphics.beginBitmapFill(texture, m, true, true);
         this.graphics.moveTo(verticesVec[0].x * 30, verticesVec[0].y * 30);
         for (var i = 1; i < verticesVec.length; i++) {
         this.graphics.lineTo(verticesVec[i].x * 30, verticesVec[i].y * 30);
         }
         this.graphics.lineTo(verticesVec[0].x * 30, verticesVec[0].y * 30);
         this.graphics.endFill();*/
    }
};