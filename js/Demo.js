var gameContext;
function init() {
    Resource.load(manifest, handleComplete);
}
function handleComplete() {
    settings = new Settings(Global.gameSettings);
    settings.screeSize = Browser.getSize();
    gameContext = new GameContext(settings, test1);
    gameContext.start();


    //createjs.Ticker.setFPS(Global.FPS);
    createjs.Ticker.useRAF = true;
    Global.FPS = createjs.Ticker.getFPS();
    createjs.Ticker.addListener(function() {
        gameContext.update();
    });
    init2();
}
;

$(document).ready(function() {
    init();
    $(document).shortkeys({
        'm': function() {
            gameContext.toggleDebug();
        }
    });

    $('#pauseButton').on('click', function() {
        gameContext.toggleDebug();
        gameContext.togglePlay();
    });

    $("#debug").change(function() {
        gameContext.toggleDebug(this.checked);
    });

    $("#gravity").change(function() {
        Global.world.gravity.y = $(this).val() / 100;
        gameContext.refreshSettings();
    });
});

var stage;
var isDrawing;
var drawingCanvas;
var oldPt;
var oldMidPt;
var displayCanvas;
var image;
var bitmap;
var maskFilter;
var cursor;
var text;
var blur;

function init2() {
    


    image = new Image();
    image.onload = handleComplete2;
    image.src = "images/wall.jpg";

    stage = gameContext.stage;
    text = new createjs.Text("Loading...", "20px Arial", "#999999");
    text.set({x: gameContext.stage.canvas.width / 2, y: gameContext.stage.canvas.height - 80});
    text.textAlign = "center";
}

function handleComplete2() {

    createjs.Touch.enable(gameContext.stage);
    stage.enableMouseOver();

    stage.addEventListener("stagemousedown", handleMouseDown);
    stage.addEventListener("stagemouseup", handleMouseUp);
    stage.addEventListener("stagemousemove", handleMouseMove);
    drawingCanvas = new createjs.Shape();
    bitmap = new createjs.Bitmap(image);

    blur = new createjs.Bitmap(image);
    blur.filters = [new createjs.BlurFilter(15, 15, 2)];
    blur.cache(0, 0, gameContext.settings.screeSize.width, gameContext.settings.screeSize.height);
    blur.alpha = 0.5;

    text.text = "Welcome to the dark room";

    stage.addChild(blur, text, bitmap);
    updateCacheImage(false);

    cursor = new createjs.Shape(new createjs.Graphics().beginFill("#FFFFFF").drawCircle(0, 0, 50));
    cursor.cursor = "pointer";

    //stage.addChild(cursor);
}

function handleMouseDown(event) {
    oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
    oldMidPt = oldPt;
    isDrawing = true;
}

function handleMouseMove(event) {
    cursor.x = stage.mouseX;
    cursor.y = stage.mouseY;

    if (!isDrawing) {
        stage.update();
        return;
    }

    var midPoint = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

    drawingCanvas.graphics.setStrokeStyle(100, "round", "round")
            .beginStroke("rgba(0,0,0,0.15)")
            .moveTo(midPoint.x, midPoint.y)
            .curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

    oldPt.x = stage.mouseX;
    oldPt.y = stage.mouseY;

    oldMidPt.x = midPoint.x;
    oldMidPt.y = midPoint.y;

    updateCacheImage(true);

}

function handleMouseUp(event) {
    updateCacheImage(true);
    isDrawing = false;
}

function updateCacheImage(update) {
    if (update) {
        drawingCanvas.updateCache();
    } else {
        drawingCanvas.cache(0, 0, gameContext.settings.screeSize.width, gameContext.settings.screeSize.height);
    }

    maskFilter = new createjs.AlphaMaskFilter(drawingCanvas.cacheCanvas);

    bitmap.filters = [maskFilter];
    if (update) {
        bitmap.updateCache(0, 0, gameContext.settings.screeSize.width, gameContext.settings.screeSize.height);
    } else {
        bitmap.cache(0, 0, gameContext.settings.screeSize.width, gameContext.settings.screeSize.height);
    }

    stage.update();
}

