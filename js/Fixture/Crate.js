var Crate = function(context) {
    this.context = context;
    this.numEnterPoints = 0;
    this.explosionCuts = 15;
    this.explodingBodies = [];
    this.explosionRadius = 50;
    this.init();
};

Crate.prototype = {
    init: function() {
        Entity.prototype.init.call(this);

        this.type = "enemy";
        this.bodyVector = new Vector2D(100, 100);
        this.canRotate = true;
    },
    show: function(positionVector) {
        this.spawn(positionVector);
    },
    spawn: function(positionVector) {
        var _this = this;
        this.enabled = true;
        var image = Resource.get('crate');

        this.createSkin(image, this.bodyVector);
//        this.createEntityBody(positionVector);
//        this.context.stage.addChild(this.skin);
//        Entity.prototype.spawn.call(this);

        var crateBitmap = new BitmapData(100, 100);
        crateBitmap.draw(image);

        // this vector stores the clockwise local coordinates of the 100x100 pixels crate
        var crateCoordVector = [new b2Vec2(-50, -50), new b2Vec2(50, -50), new b2Vec2(50, 50), new b2Vec2(-50, 50)];
        // then createBody builds the final body and applies the bitmap.
        // the first two arguments are the X and Y position of the center of the crate, in pixels
        this.createBody(95, 420, crateCoordVector, crateBitmap);

        // You can see the reason for creating the enterPointsVec in the coments in the intersection() method.
        enterPointsVec = [];
        enterPointsVec.length = this.numEnterPoints;
        // listeners
        MouseManager.down(this, function(e) {
            _this.boom(e);
        });
    },
    det: function(x1, y1, x2, y2, x3, y3) {
        // This is a function which finds the determinant of a 3x3 matrix.
        // If you studied matrices, you'd know that it returns a positive number if three given points are in clockwise order, negative if they are in anti-clockwise order and zero if they lie on the same line.
        // Another useful thing about determinants is that their absolute value is two times the face of the triangle, formed by the three given points.
        return x1 * y2 + x2 * y3 + x3 * y1 - y1 * x2 - y2 * x3 - y3 * x1;
    },
    createBody: function(xPos, yPos, verticesArr, texture) {
        var worldScale = Global.scale;
        var world = this.context.world;
        // I need this temp vector to convert pixels coordinates to Box2D meters coordinates
        var vec = [];
        for (var i = 0; i < verticesArr.length; i++) {
            vec.push(new b2Vec2(verticesArr[i].x / worldScale, verticesArr[i].y / worldScale));
        }
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        var boxDef = new b2PolygonShape();
        boxDef.SetAsVector(vec);
        bodyDef.position.Set(xPos / worldScale, yPos / worldScale);
        // custom userData used to map the texture

        this.addChild(bodyDef.userData);
        var fixtureDef = new b2FixtureDef();
        fixtureDef.density = 1;
        fixtureDef.friction = 0.2;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = boxDef;
        var tempBox = world.CreateBody(bodyDef);
        tempBox.SetUserData(new UserData(this.numEnterPoints, vec, texture));
        tempBox.CreateFixture(fixtureDef);
        this.numEnterPoints++;

        this.body = tempBox;
    },
    boom: function(e) {
        var _this = this;
        console.log(e);
        var world = this.context.world;
        var cutAngle;
        explosionX = e.pageX;
        explosionY = e.pageY;



        var intersection = function(fixture, point, normal, fraction) {

            if (_this.explodingBodies.indexOf(fixture.GetBody()) !== -1) {
                var spr = fixture.GetBody().GetUserData();
                console.log(spr);
                if (spr) {
                    var userD = spr;
                    if (enterPointsVec[userD.id]) {
                        // If this body has already had an intersection point, then it now has two intersection points, thus it must be split in two - thats where the splitObj() method comes in.
                        _this.splitObj(fixture.GetBody(), enterPointsVec[userD.id], point.Copy());
                    }
                    else {
                        enterPointsVec[userD.id] = point;
                    }
                }
            }
            return 1;
        };

        // I am looking for a body under my mouse
        var clickedBody = MouseManager.getBodyAtXY(new b2Vec2(explosionX / Global.scale, explosionY / Global.scale));

        if (clickedBody !== null) {

            // storing the exploding bodies in a vector. I need to do it since I do not want other bodies
            // to be affected by the raycast and explode

            this.explodingBodies.push(clickedBody);

            // the explosion begins!
            for (var i = 1; i <= this.explosionCuts; i++) {
                // choosing a random angle
                cutAngle = Math.random() * Math.PI * 2;
                // creating the two points to be used for the raycast, according to the random angle and mouse position
                // also notice how I need to add a little offset (i/10) or Box2D will crash. Probably it's not able to 
                // determine raycast on objects whose area is very very close to zero (or zero)
                var p1 = new b2Vec2((explosionX + i / 10 - 2000 * Math.cos(cutAngle)) / Global.scale, (explosionY - 2000 * Math.sin(cutAngle)) / Global.scale);
                var p2 = new b2Vec2((explosionX + 2000 * Math.cos(cutAngle)) / Global.scale, (explosionY + 2000 * Math.sin(cutAngle)) / Global.scale);
                world.RayCast(intersection, p1, p2);
                world.RayCast(intersection, p2, p1);
                enterPointsVec = [];
                enterPointsVec.length = this.numEnterPoints;

            }
        }
    },
    getArea: function(vs, count) {
        var area = 0.0;
        var p1X = 0.0;
        var p1Y = 0.0;
        var inv3 = 1.0 / 3.0;
        for (var i = 0; i < count; ++i) {
            var p2 = vs[i];
            var p3 = i + 1 < count ? vs[i + 1] : vs[0];
            var e1X = p2.x - p1X;
            var e1Y = p2.y - p1Y;
            var e2X = p3.x - p1X;
            var e2Y = p3.y - p1Y;
            var D = (e1X * e2Y - e1Y * e2X);
            var triangleArea = 0.5 * D;
            area += triangleArea;
        }
        return area;
    },
    arrangeClockwise: function(vec) {
        // The algorithm is simple: 
        // First, it arranges all given points in ascending order, according to their x-coordinate.
        // Secondly, it takes the leftmost and rightmost points (lets call them C and D), and creates tempVec, where the points arranged in clockwise order will be stored.
        // Then, it iterates over the vertices vector, and uses the det() method I talked about earlier. It starts putting the points above CD from the beginning of the vector, and the points below CD from the end of the vector. 
        // That was it!
        var n = vec.length, d, i1 = 1, i2 = n - 1;
        var tempVec = [];
        tempVec.length = n;
        var C, D;

        //vec.sort(comp1);
        tempVec[0] = vec[0];
        C = vec[0];
        D = vec[n - 1];
        for (var i = 1; i < n - 1; i++) {
            d = this.det(C.x, C.y, D.x, D.y, vec[i].x, vec[i].y);
            if (d < 0) {
                tempVec[i1++] = vec[i];
            }
            else {
                tempVec[i2--] = vec[i];
            }
        }
        tempVec[i1] = vec[n - 1];
        return tempVec;
    },
    setExplosionVelocity: function(b) {
        var distX = b.GetWorldCenter().x * Global.scale - explosionX;
        if (distX < 0) {
            if (distX < -this.explosionRadius) {
                distX = 0;
            }
            else {
                distX = -this.explosionRadius - distX;
            }
        }
        else {
            if (distX > this.explosionRadius) {
                distX = 0;
            }
            else {
                distX = this.explosionRadius - distX;
            }
        }
        var distY = b.GetWorldCenter().y * Global.scale - explosionY;
        if (distY < 0) {
            if (distY < -this.explosionRadius) {
                distY = 0;
            }
            else {
                distY = -this.explosionRadius - distY;
            }
        }
        else {
            if (distY > this.explosionRadius) {
                distY = 0;
            }
            else {
                distY = this.explosionRadius - distY;
            }
        }
        distX *= 0.25;
        distY *= 0.25;
        return new b2Vec2(distX, distY);
    },
    splitObj: function(sliceBody, A, B) {
        var world = this.context.world;
        var origFixture = sliceBody.GetFixtureList();
        var poly = origFixture.GetShape();
        var verticesVec = poly.GetVertices();
        var numVertices = poly.GetVertexCount();
        var shape1Vertices = [], shape2Vertices = [];
        var origUserData = sliceBody.GetUserData();
        var origUserDataId = origUserData.id;
        var d;
        var polyShape = new b2PolygonShape();
        var body;
        // First, I destroy the original body and remove its Sprite representation from the childlist.
        world.DestroyBody(sliceBody);
        this.removeChild(origUserData);
        // The world.RayCast() method returns points in world coordinates, so I use the b2Body.GetLocalPoint() to convert them to local coordinates.;
        A = sliceBody.GetLocalPoint(A);
        B = sliceBody.GetLocalPoint(B);
        // I use shape1Vertices and shape2Vertices to store the vertices of the two new shapes that are about to be created. 
        // Since both point A and B are vertices of the two new shapes, I add them to both vectors.
        shape1Vertices.push(A, B);
        shape2Vertices.push(A, B);
        // I iterate over all vertices of the original body. ;
        // I use the function det() ("det" stands for "determinant") to see on which side of AB each point is standing on. The parameters it needs are the coordinates of 3 points:
        // - if it returns a value >0, then the three points are in clockwise order (the point is under AB)
        // - if it returns a value =0, then the three points lie on the same line (the point is on AB)
        // - if it returns a value <0, then the three points are in counter-clockwise order (the point is above AB). 
        for (var i = 0; i < numVertices; i++) {
            d = this.det(A.x, A.y, B.x, B.y, verticesVec[i].x, verticesVec[i].y);
            if (d > 0) {
                shape1Vertices.push(verticesVec[i]);
            }
            else {
                shape2Vertices.push(verticesVec[i]);
            }
        }
        // In order to be able to create the two new shapes, I need to have the vertices arranged in clockwise order.
        // I call my custom method, arrangeClockwise(), which takes as a parameter a vector, representing the coordinates of the shape's vertices and returns a new vector, with the same points arranged clockwise.
        shape1Vertices = this.arrangeClockwise(shape1Vertices);
        shape2Vertices = this.arrangeClockwise(shape2Vertices);
        // setting the properties of the two newly created shapes
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position = sliceBody.GetPosition();
        var fixtureDef = new b2FixtureDef();
        fixtureDef.density = origFixture.GetDensity();
        fixtureDef.friction = origFixture.GetFriction();
        fixtureDef.restitution = origFixture.GetRestitution();
        // creating the first shape, if big enough
        if (this.getArea(shape1Vertices, shape1Vertices.length) >= 0.05) {
            polyShape.SetAsVector(shape1Vertices);
            fixtureDef.shape = polyShape;
            bodyDef.userData = new UserData(origUserDataId, shape1Vertices, origUserData.texture);
            this.addChild(bodyDef.userData);
            enterPointsVec[origUserDataId] = null;
            body = world.CreateBody(bodyDef);
            body.SetAngle(sliceBody.GetAngle());
            body.CreateFixture(fixtureDef);
            // setting a velocity for the debris
            body.SetLinearVelocity(this.setExplosionVelocity(body));
            // the shape will be also part of the explosion and can explode too
            this.explodingBodies.push(body);
        }
        // creating the second shape, if big enough
        if (this.getArea(shape2Vertices, shape2Vertices.length) >= 0.05) {
            polyShape.SetAsVector(shape2Vertices);
            fixtureDef.shape = polyShape;
            bodyDef.userData = new UserData(this.numEnterPoints, shape2Vertices, origUserData.texture);
            this.addChild(bodyDef.userData);
            enterPointsVec.push(null);
            this.numEnterPoints++;
            body = world.CreateBody(bodyDef);
            body.SetAngle(sliceBody.GetAngle());
            body.CreateFixture(fixtureDef);
            // setting a velocity for the debris
            body.SetLinearVelocity(this.setExplosionVelocity(body));
            // the shape will be also part of the explosion and can explode too
            this.explodingBodies.push(body);
        }
    },
    removeChild: function(child) {

    },
    addChild: function(child) {

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
    createEntityBody: function(postion) {
        var scale = Global.scale;
        var pos = new Vector2D(postion.x / scale, postion.y / scale);
        var vec = new Vector2D((this.bodyVector.x / 2.0) / scale, (this.bodyVector.y / 2.0) / scale);

        var body = EntityBody.getPolygonShape(this.context, pos, vec);

        body.SetUserData(this);
        body.SetAngle(postion.rotation);
        this.body = body;

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
    }
};