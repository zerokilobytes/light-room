var EntityBody = function(context, postion, sizeVector, scale) {
    this.context = context;
    this.postion = postion;
    this.scale = scale;
    this.sizeVector = sizeVector;
    this.body = null;

    this.init();
};

EntityBody.prototype = {
    init: function() {

        /* var birdFixture = new b2FixtureDef;
         birdFixture.density = 1.0;
         birdFixture.friction = 0.5;
         birdFixture.restitution = 0.3;
         birdFixture.shape = new b2CircleShape(this.sizeVector.x / this.scale);
         var birdBodyDef = new b2BodyDef;
         birdBodyDef.type = b2Body.b2_dynamicBody;
         birdBodyDef.position.x = this.postion.x / this.scale;
         birdBodyDef.position.y = this.postion.y / this.scale;
         //console.log(this.context);
         this.body = this.context.world.CreateBody(birdBodyDef);
         this.body.CreateFixture(birdFixture);
         this.body.SetUserData(this);
         */

    },
    getDefinition: function() {
        return this.body;
    },
    getRotation: function() {
        return this.body.rotation;
    }
};

EntityBody.getPolygonShape = function(context, postion, sizeVector) {
    var polygonShape = new b2PolygonShape();
    polygonShape.SetAsBox(sizeVector.x, sizeVector.y);


    var birdFixture = new b2FixtureDef;

    birdFixture.density = MathFunc.getRandomArbitrary(1, 5);
    birdFixture.friction = MathFunc.getRandomArbitrary(0.1, 1);
    birdFixture.restitution = MathFunc.getRandomArbitrary(0.2, 1);
    birdFixture.shape = polygonShape;
    var birdBodyDef = new b2BodyDef;
    birdBodyDef.type = b2Body.b2_dynamicBody;
    birdBodyDef.position.x = postion.x;
    birdBodyDef.position.y = postion.y;

    var body = context.world.CreateBody(birdBodyDef);
    body.CreateFixture(birdFixture);
    //this.body.SetUserData(this);

    //var angle = MathFunc.getRandomArbitrary(180, 360) * Math.PI / 180;
    //var velocityX = MathFunc.getRandomArbitrary(2, 10) * -1;
    //var velocityY = MathFunc.getRandomArbitrary(0.1, 2.0) * -1;
    //body.SetLinearVelocity(new b2Vec2(Math.cos(angle) * velocityX, Math.sin(angle) * velocityY));
    //body.SetAngle(angle);
    return body;
};