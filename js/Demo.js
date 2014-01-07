var gameContext;
var fullScreen = false;
function init() {
    Resource.load(manifest, handleComplete);
}
function handleComplete() {
    $("#mainDiv").show();
    $("#cover").hide();
    start();
}
function start() {
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
}

$(document).ready(function() {
    init();
    $(document).shortkeys({
        'd': function() {
            gameContext.toggleDebug();

        }
    });

    $(document).on('clickx', function() {
        if (!fullScreen) {
            $(document).fullScreen(true);
            $("#mainDiv").show();
            $("#cover").hide();

            $(document).bind("fullscreenchange", function() {
                //start();
                fullScreen = true;
            });
        }
    });

    $("#debug").change(function() {
        gameContext.toggleDebug(this.checked);
    });

    $("#gravity").change(function() {
        Global.world.gravity.y = $(this).val() / 100;
        gameContext.refreshSettings();
    });
});