var PhysicsManager = function(context) {

    this.init();
};

PhysicsManager.prototype = {
};
PhysicsManager.context = null;
PhysicsManager.mouseJoint = false;

PhysicsManager.register = function(context) {
    PhysicsManager.context = context;
    MouseManager.up(PhysicsManager, function(e) {

    });

    MouseManager.down(PhysicsManager, function(e) {

    });

    MouseManager.move(PhysicsManager, function(e) {
        var _world = PhysicsManager.context.world;

        _mouseXWorldPhys = e.pageX / Global.scale;
        _mouseYWorldPhys = e.pageY / Global.scale;

        if (MouseManager.isMousedown && !PhysicsManager.mouseJoint) {

            var body = MouseManager.getBody(e, true);
            if (body) {
                //console.log(body);

                var md = new b2MouseJointDef();
                md.bodyA = _world.GetGroundBody();
                md.bodyB = body;
                md.target.Set(_mouseXWorldPhys, _mouseYWorldPhys);
                md.collideConnected = true;
                md.maxForce = 300.0 * body.GetMass();
                PhysicsManager.mouseJoint = _world.CreateJoint(md);
                body.SetAwake(true);
            }
        }

        if (!MouseManager.isMousedown)
        {
            if (PhysicsManager.mouseJoint) {
                _world.DestroyJoint(PhysicsManager.mouseJoint);
                PhysicsManager.mouseJoint = null;
            }
        }

        if (PhysicsManager.mouseJoint) {
            var p2 = new b2Vec2(_mouseXWorldPhys, _mouseYWorldPhys);
            PhysicsManager.mouseJoint.SetTarget(p2);
        }
    });
};