var LightBulb = function(context) {
    this.context = context;
    this.type = "light_bulb";
    this.body = null;
    this.active = false;
    this.init();
};

LightBulb.prototype = {
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
        var image = Resource.get(this.type);
        this.bodyVector = new Vector2D(image.width, image.height);

        this.createSkin(image);
//
//        this.skin.cache(0, 0, image.width, image.height);
//        this.skin.snapToPixel = true;
//
//        this.skin.skewY = 50;
//        //this.skin.x = ((image_width - 1) * i) * Math.cos(this.skin.skewY / 180 * Math.PI);
//        this.skin.filters = [this.getColorMatrixFilter(this.skin.skewY)];
//        this.skin.snapToPixel = true;
//        this.skin.updateCache();

        this.createEntityBody(positionVector, image);

        this.context.stage.addChild(this.skin);
        Entity.prototype.spawn.call(this);
    },
    getColorMatrixFilter: function(value) {
        var cm = new createjs.ColorMatrix();
        cm.adjustBrightness(value * 0.75);
        return new createjs.ColorMatrixFilter(cm);
    },
    getPoint: function() {
        var x = this.skin.x;
        var y = this.skin.y;

        var angle = Math.atan2(y, x);

        var deltaX = x + Math.cos(angle);
        var deltaY = y + Math.sin(angle) * 220;
        return new Vector2D(deltaX, deltaY);
    },
    addMarker: function(position) {
        var stage = new createjs.Stage();
        //Create a Shape DisplayObject.
        circle = new createjs.Shape();
        circle.graphics.beginFill("red").drawCircle(0, 0, 10);
        //Set position of Shape instance.
        circle.x = position.x;
        circle.y = position.y;
        circle.alpha = 0.2;
        //Add Shape instance to stage display list.
        stage.addChild(circle);
        //Update stage will render next frame
        stage.update();

        return circle;
    },
    update: function() {
        if (this.active === true) {
            Entity.prototype.update.call(this);
        }
        var point = this.getPoint();
        Visual.Effects.castLight(point, 500);
    },
    getSkin: function() {
        return Entity.prototype.getSkin.call(this);
    },
    getBody: function() {
        return Entity.prototype.getBody.call(this);
    },
    createSkin: function(image) {
        this.skin = EntitySkin.createBitmap(image);
        //bitmap.regX = vec.x / 2;
        //bitmap.regY = vec.y / 2;
        // this.skin.scaleX = -1;
        this.skin.scaleY = -1;
    },
    createEntityBody: function(postion, image) {
        var _this = this;
        var vertices = [];

        var callback = function(json) {
            var bodyDef = new b2BodyDef();
            bodyDef.position.Set(postion.x / Global.scale, postion.y / Global.scale);
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.userData = _this;

            var body = _this.context.world.CreateBody(bodyDef);
            var polygons = json.rigidBodies[0].polygons;

            for (var p = 0; p < polygons.length; p++) {
                var fixtureDef = new b2FixtureDef();
                fixtureDef.density = 100;
                fixtureDef.friction = 0.5;
                fixtureDef.restitution = 0.1;

                vertices = [];
                var set = polygons[p];

                for (var s = 0; s < set.length; s++) {
                    vertices.push(new b2Vec2(set[s].x * (image.width / Global.scale), set[s].y * (150 / Global.scale)));
                }

                var polygonShape = new b2PolygonShape();
                polygonShape.SetAsArray(vertices, vertices.length);
                fixtureDef.shape = polygonShape;
                body.CreateFixture(fixtureDef);
            }
            _this.body = body;
            _this.body.SetAngle(postion.rotation);
            _this.active = true;
        };
        Resource.loadJson("assets/light_bulb.json", callback, false);
    }
};