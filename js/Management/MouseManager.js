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

MouseManager.getBody = function(e)
{
    var p = get_real(new b2Vec2(e.pageX / 60, e.pageY / 60));
    mouse_x = p.x;
    mouse_y = p.y;

    // var mouse_x = e.screenX;
    // var mouse_y = e.screenY;

    var mouse_p = new b2Vec2(mouse_x, mouse_y);
    var aabb = new b2AABB();

    aabb.lowerBound.Set(mouse_x - 0.001, mouse_y - 0.001);
    aabb.upperBound.Set(mouse_x + 0.001, mouse_y + 0.001);
    var body = null;

    // Query the world for overlapping shapes.
    function GetBodyCallback(fixture)
    {
        var shape = fixture.GetShape();

        if (fixture.GetBody().GetType() !== b2Body.b2_staticBody)
        {
            var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);
            if (inside)
            {
                body = fixture.GetBody();
                return false;
            }
        }
        return true;
    }
    MouseManager.context.world.QueryAABB(GetBodyCallback, aabb);
    return body;
};

function get_real(p) {
    var height = MouseManager.context.settings.screeSize.height / 60;
    return new b2Vec2(p.x + 0, height - p.y);
}