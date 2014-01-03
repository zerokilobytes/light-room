var MouseManager = function() {

};

MouseManager.prototype = {
};

MouseManager.isMousedown = false;
MouseManager.context = {};

MouseManager.register = function(context) {
    MouseManager.context = context;
    $(MouseManager.gameCanvas).on("mouseover", function(e) {
        e.preventDefault();
        $(this).addClass("mouseDown");
    }).on("mouseup", function() {
        //$(this).removeClass("mouseDown");
    });

    $(MouseManager.gameCanvas).on("mousedown", function(e) {
        e.preventDefault();
        $(this).addClass("mouseDown");
    }).on("mouseup", function() {
        //$(this).removeClass("mouseDown");
    });

    console.log(MouseManager.gameCanvas);
};

MouseManager.down = function(context, callback) {
    $("#gameCanvas").mousedown(function(e) {
        MouseManager.isMousedown = true;
        if (typeof callback === "function") {
            callback(e);
        } else {
            callback.call(context, e);
        }
    });
};

MouseManager.up = function(context, callback) {
    $("#gameCanvas").mouseup(function(e) {
        MouseManager.isMousedown = false;
        if (typeof callback === "function") {
            callback(e);
        } else {
            callback.call(context, e);
        }
    });
};

MouseManager.move = function(context, callback) {
    $("#gameCanvas").mousemove(function(e) {
        if (typeof callback === "function") {
            callback(e);
        } else {
            callback.call(context, e);
        }
    });
};
MouseManager.getBody = function(e, includeStatic) {
    var _world = MouseManager.context.world;
    var _mousePVec = new b2Vec2();
    _mouseXWorldPhys = e.pageX / Global.scale;
    _mouseYWorldPhys = e.pageY / Global.scale;

    _mousePVec.Set(_mouseXWorldPhys, _mouseYWorldPhys);
    var aabb = new b2AABB();
    aabb.lowerBound.Set(_mouseXWorldPhys - 0.001, _mouseYWorldPhys - 0.001);
    aabb.upperBound.Set(_mouseXWorldPhys + 0.001, _mouseYWorldPhys + 0.001);
    var body = null;
    var fixture;

    // Query the world for overlapping shapes.
    function GetBodyCallback(fixture)
    {
        var shape = fixture.GetShape();
        if (fixture.GetBody().GetType() !== b2Body.b2_staticBody || includeStatic)
        {
            var inside = shape.TestPoint(fixture.GetBody().GetTransform(), _mousePVec);
            if (inside)
            {
                body = fixture.GetBody();
                return false;
            }
        }
        return true;
    }
    _world.QueryAABB(GetBodyCallback, aabb);
    return body;
};