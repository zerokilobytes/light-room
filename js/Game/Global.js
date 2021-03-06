var Global = function() {
    throw Error("Cannot instantiate Global");
};

Global.prototype = {
};
Global.FPS = 60;

Global.gameSettings = {
    scale: 60,
    screeSize: {
        width: 800,
        height: 800
    }
};

Global.world = {
    gravity: {
        x: 0,
        y: 9.81
    }
};

Global.scale = 60;

Global.model = {
    spawnRate: 400,
    fireRate: 300
};

Global.arrow = {
    count: 1,
    velocity: {
        x: 50,
        y: 50
    }
};

Global.toad = {
    gravity: {
        x: 0,
        y: 9.81
    }
};