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
        this.enabled = true;
        var image = Resource.get(this.type);

        this.bodyVector = new Vector2D(image.width, image.height);

        this.createSkin(image);
        this.createEntityBody(positionVector, image);

        this.context.stage.addChild(this.skin);

        Entity.prototype.spawn.call(this);
    },
    update: function() {
        if (this.active === true) {
            Entity.prototype.update.call(this);
        }
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
            _this.active = true;
        };
        Resource.loadJson("assets/light_bulb.json", callback);
    }
};