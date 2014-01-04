var Pot = function(context) {
    this.context = context;
    this.type = "pot";
    this.init();
};

Pot.prototype = {
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
        //this.skin.scaleY = -1;
        //this.skin.scaleX = -1;
    },
    createEntityBody: function(postion) {
        var _this = this;
//        var scale = Global.scale;
//        var pos = new Vector2D(postion.x / scale, postion.y / scale);
//        var vec = new Vector2D((this.bodyVector.x / 2.0) / scale, (this.bodyVector.y / 2.0) / scale);
//
//        var body = EntityBody.getPolygonShape(this.context, pos, vec);
//
//        body.SetUserData(this);
//        body.SetAngle(postion.rotation);
//        this.body = body;
        var vertices = [];

        var callback = function(json) {
            var bodyDef = new b2BodyDef();

            bodyDef.position.Set(postion.x / Global.scale, postion.y / Global.scale);
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.userData = _this;

            var body = _this.context.world.CreateBody(bodyDef);

            var polygons = json.rigidBodies[0].polygons;
            console.log(polygons);
            for (var p = 0; p < polygons.length; p++) {
                var fixtureDef = new b2FixtureDef();
                fixtureDef.density = 100;
                fixtureDef.friction = 0.5;
                fixtureDef.restitution = 0.1;

                vertices = [];
                var set = polygons[p];

                for (var s = 0; s < set.length; s++) {
                    vertices.push(new b2Vec2(set[s].x * (256 / Global.scale), set[s].y * (256 / Global.scale)));
                }
                var polygonShape = new b2PolygonShape();
                polygonShape.SetAsArray(vertices, vertices.length);
                fixtureDef.shape = polygonShape;
                body.CreateFixture(fixtureDef);
            }
            _this.body = body;
            //body.SetAngle(0);
        };
        Resource.loadJson("assets/pot.json", callback);
    }
};