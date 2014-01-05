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
var maskFilter;
var cursor;
var text;
var light;

function init2() {
    image = new Image();
    image.onload = handleComplete2;
    image.src = "images/white.png";

    stage = gameContext.stage;
}

function handleComplete2() {

    createjs.Touch.enable(gameContext.stage);
    stage.enableMouseOver();

    stage.addEventListener("stagemousedown", handleMouseDown);
    stage.addEventListener("stagemouseup", handleMouseUp);
    drawingCanvas = new createjs.Shape();
    
    light = new createjs.Bitmap(image);
    light.filters = [new createjs.BlurFilter(15, 15, 2)];
    light.cache(0, 0, gameContext.settings.screeSize.width, gameContext.settings.screeSize.height);
    light.alpha = 0.5;


    stage.addChild(light);
    updateCacheImage(false);

    cursor = new createjs.Shape(new createjs.Graphics().beginFill("#FFFFFF").drawCircle(0, 0, 50));
    cursor.cursor = "pointer";
}

function handleMouseDown(event) {
    oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
    oldMidPt = oldPt;
    isDrawing = true;

    handleMouseMove(event);
}

function handleMouseMove(event) {
    if (!isDrawing) {
        stage.update();
        return;
    }
    drawingCanvas.graphics.beginFill("rgba(0,0,0,0.12)").drawCircle(stage.mouseX, stage.mouseY, 100);
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

    light.filters = [maskFilter];

    if (update) {
        light.updateCache(0, 0, gameContext.settings.screeSize.width, gameContext.settings.screeSize.height);
    } else {
        light.cache(0, 0, gameContext.settings.screeSize.width, gameContext.settings.screeSize.height);
    }
    light.sourceRect = new createjs.Rectangle(0, 0, gameContext.settings.screeSize.width, gameContext.settings.screeSize.height);
    stage.update();
}