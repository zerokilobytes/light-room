var Light = function(context) {
    this.context = context;
    this.radius = 500;
    this.glow = null;
    this.drawingCanvas = null;
    this.init();
};

Light.prototype = {
    init: function() {
        var stage = this.context.stage;
        var image = Resource.get('white');

        createjs.Touch.enable(stage);
        stage.enableMouseOver();
        this.drawingCanvas = new createjs.Shape();

        this.glow = new createjs.Bitmap(image);
        this.glow.filters = [new createjs.BlurFilter(30, 30, 1)];
        this.glow.cache(0, 0, this.context.settings.screeSize.width, this.context.settings.screeSize.height);
        this.glow.alpha = 0.5;

        stage.addChild(this.glow);
        this.updateCacheImage(false);
    },
    show: function(position) {

        this.drawingCanvas.graphics.beginFill("rgba(0,0,0,0.09)").drawCircle(position.x, position.y, this.radius);
        this.updateCacheImage(true);
    },
    update: function(position) {
        this.drawingCanvas.graphics.clear();
        this.show(position);
    },
    updateCacheImage: function(update) {
        var stage = this.context.stage;

        if (update) {
            this.drawingCanvas.updateCache();
        } else {
            this.drawingCanvas.cache(0, 0, this.context.settings.screeSize.width, this.context.settings.screeSize.height);
        }

        var maskFilter = new createjs.AlphaMaskFilter(this.drawingCanvas.cacheCanvas);

        this.glow.filters = [maskFilter];

        if (update) {
            this.glow.updateCache(0, 0, this.context.settings.screeSize.width, this.context.settings.screeSize.height);
        } else {
            this.glow.cache(0, 0, this.context.settings.screeSize.width, this.context.settings.screeSize.height);
        }
        stage.update();
    }
};