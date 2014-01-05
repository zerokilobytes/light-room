var Lamp = function(context) {
    this.context = context;
    this.type = "lamp";
    this.body = null;
    this.active = false;
    this.bulb = null;
    this.init();
};

Lamp.prototype = {
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
        var ropeImg = Resource.get("rope");

        this.bodyVector = new Vector2D(ropeImg.width, ropeImg.height);

        this.createSkin(ropeImg);
        this.createEntityBody(positionVector, ropeImg);

        this.context.stage.addChild(this.skin);

        Entity.prototype.spawn.call(this);
    },
    //Function to create a round ball, sphere like object
    createBall: function(world, x, y, radius, options) {
        //default setting
        options = $.extend(true, {
            'density': 1.0,
            'friction': 1.0,
            'restitution': 0.5,
            'type': b2Body.b2_staticBody
        }, options);

        var body_def = new b2BodyDef();
        var fix_def = new b2FixtureDef();

        fix_def.density = options.density || 1.0;
        fix_def.friction = 0.5;
        fix_def.restitution = 0.5;

        var shape = new b2CircleShape(radius);
        fix_def.shape = shape;

        body_def.position.Set(x, y);

        body_def.linearDamping = 0.0;
        body_def.angularDamping = 0.0;

        body_def.type = options.type;
        body_def.userData = options.user_data;

        var b = world.CreateBody(body_def);
        b.CreateFixture(fix_def);

        return b;
    },
    update: function() {
        if (this.active === true) {
            Entity.prototype.update.call(this);
        }
         this.bulb.update();
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
    createBox: function(world, x, y, width, height, options) {
        //default setting
        options = $.extend(true, {
            'density': 1.0,
            'friction': 1.0,
            'restitution': 0.5,
            'type': b2Body.b2_dynamicBody
        }, options);

        var body_def = new b2BodyDef();
        var fix_def = new b2FixtureDef();

        fix_def.density = options.density;
        fix_def.friction = options.friction;
        fix_def.restitution = options.restitution;

        fix_def.shape = new b2PolygonShape();

        fix_def.shape.SetAsBox(width / 2, height / 2);

        body_def.position.Set(x, y);
        body_def.linearDamping = 0.5;
        body_def.angularDamping = 0.5;

        body_def.type = options.type;
        body_def.userData = options.user_data;

        var b = world.CreateBody(body_def);
        var f = b.CreateFixture(fix_def);

        return b;
    },
    createEntityBody: function(postion, image) {
        var _this = this;
        var world = this.context.world;
        var width = 60;
        var height = 60;

        var ball = this.createBall(world, postion.x / Global.scale, postion.y / Global.scale, 1, {type: b2Body.b2_staticBody});
        var box = this.createBox(world, postion.x / Global.scale, postion.y / Global.scale, width / Global.scale, height / Global.scale, {type: b2Body.b2_dynamicBody});

        this.bulb = new LightBulb(this.context);
        this.bulb.spawn({x: 200, y: 160});

        distance_joint = new b2RevoluteJointDef();
        distance_joint.bodyA = ball;
        distance_joint.bodyB = this.bulb.body;

        console.log(this.bulb.body);

        //connect the centers - center in local coordinate - relative to body is 0,0
        distance_joint.localAnchorA = new b2Vec2(0, 0);
        distance_joint.localAnchorB = new b2Vec2(1, 7);
        //length of joint
        distance_joint.length = 6;
        distance_joint.enableMotor = false;
        distance_joint.referenceAngle = 0 * Math.PI / 3;
        distance_joint.collideConnected = false;

        //distance_joint.Initialize(ball,  bulb.body,  bulb.body.GetWorldCenter());
        // distance_joint.Initialize(ball, bulb.body, b2Vec2(0, 0), b2Vec2(0, 0));
        //add the joint to the world
        world.CreateJoint(distance_joint);
    }
};