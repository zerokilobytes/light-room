var Pendulum = function(context) {
    this.context = context;
    this.init();
};

Pendulum.prototype = {
    init: function() {
        Entity.prototype.init.call(this);

        this.type = "pendulum";
        this.bodyVector = new Vector2D(154, 255);
        this.canRotate = false;
    },
    show: function(positionVector) {
        this.spawn(positionVector);
    },
    spawn: function(positionVector) {
       
        this.enabled = true;
        this.createEntityBody(positionVector);

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
    },
    revoluteJoint: function(bodyA, bodyB, anchorA, anchorB) {
        var world = this.context.world;
        var revoluteJointDef = new b2RevoluteJointDef();
        revoluteJointDef.localAnchorA.Set(anchorA.x, anchorA.y);
        revoluteJointDef.localAnchorB.Set(anchorB.x, anchorB.y);
        revoluteJointDef.bodyA = bodyA;
        revoluteJointDef.bodyB = bodyB;
        world.CreateJoint(revoluteJointDef);
    },
    createEntityBody: function(data) {
        var world = this.context.world;
        var worldScale = Global.scale;
        // number of links forming the rope
        var links = 6;
        // according to the number of links, I am setting the length of a single chain piace
        var chainLength = 100 / links;

        // ceiling polygon shape
        var polygonShape = new b2PolygonShape();
        polygonShape.SetAsBox(5 / worldScale, 5 / worldScale);
        // ceiling fixture;
        var fixtureDef = new b2FixtureDef();
        fixtureDef.density = 1;
        fixtureDef.friction = 1;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;
        // ceiling body
        var bodyDef = new b2BodyDef();
        bodyDef.position.Set(data.x / worldScale, data.y / worldScale);
        // ceiling creation;
        var wall = world.CreateBody(bodyDef);
        wall.CreateFixture(fixtureDef);
        // link polygon shape
        polygonShape.SetAsBox(1 / worldScale, chainLength / worldScale);
        // link fixture;
        fixtureDef.density = 5;
        fixtureDef.shape = polygonShape;
        // link body
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.userData = {name: "rope", guid: this.guid};
        // link creation
        for (var i = 0; i < links; i++) {
            bodyDef.position.Set(data.x / worldScale, (chainLength + 2 * chainLength * i) / worldScale);
            if (i === 0) {
                var link = world.CreateBody(bodyDef);
                link.CreateFixture(fixtureDef);
                this.revoluteJoint(wall, link, new b2Vec2(0, 0), new b2Vec2(0, -chainLength / worldScale));
            }
            else {
                var newLink = world.CreateBody(bodyDef);
                newLink.CreateFixture(fixtureDef);
                this.revoluteJoint(link, newLink, new b2Vec2(0, chainLength / worldScale), new b2Vec2(0, -chainLength / worldScale));
                link = newLink;
            }
        }


        var fixtureDef = new b2FixtureDef();
        fixtureDef.density = 0;
        fixtureDef.friction = 1;
        fixtureDef.restitution = 0.5;


        var bodyDef2 = new b2BodyDef();
        bodyDef2.position = bodyDef.position;
        bodyDef2.type = b2Body.b2_dynamicBody;
        bodyDef2.userData = {name: "box"};

        // attaching the ball at the end of the rope
        //fixtureDef.shape = circleShape;
        var circleShape = new b2PolygonShape();
        circleShape.SetAsBox(32 / worldScale, 32 / worldScale);
        fixtureDef.shape = circleShape;

        this.steelBall = world.CreateBody(bodyDef2);
        this.steelBall.CreateFixture(fixtureDef);
        this.revoluteJoint(link, this.steelBall, new b2Vec2(0, chainLength / worldScale), new b2Vec2(0, 0));
    }
};