var Visual = function() {
    throw new Error("Visual object cannot be instantiated");
};

Visual.prototype = {
};

Visual.context = null;
Visual.light = null;

Visual.register = function(context) {
    Visual.context = context;
    Visual.Effects.loadToadExplosion();
    Visual.light = new Light(context);
};

Visual.Effects = function() {

};

Visual.Effects.prototype = {
};

Visual.Effects.castLight = function(position, radius) {
    Visual.light.radius = radius;
    Visual.light.update(position, radius);
}

Visual.Effects.loadToadExplosion = function() {
    //var spriteSheet = {"images": [Resource.loader.getResult("bulb")], "animations": {"jump": [10, 19], "boom": [0, 9]}, "frames": {"height": 94, "regX": 0, "count": 20, "regY": 0, "width": 96}};

    // Spritesheet creation
    //var sheet = new createjs.SpriteSheet(spriteSheet);

    // BitmaAnimation 
    //Visual.Effects.toadExplosion = new createjs.BitmapAnimation(sheet);
};

Visual.Effects.displayToadExplosion = function(e) {
    // Display the smoke BitmapAnimation
    Visual.context.stage.addChild(Visual.Effects.toadExplosion);

    // Start the animation using the label ("boom" or "jump")
    Visual.Effects.toadExplosion.gotoAndPlay("boom");

    // Set the smoke position (equal to mouse position)
    Visual.Effects.toadExplosion.x = e.x;
    Visual.Effects.toadExplosion.y = e.y;

    // Remove smoke when animation ends
    Visual.Effects.toadExplosion.onAnimationEnd = function() {
        Visual.context.stage.removeChild(Visual.Effects.toadExplosion);
    };
};