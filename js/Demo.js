var gameContext;
function init() {
    Resource.load(manifest, handleComplete);
}
function handleComplete() {

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

    $(document).on('click', function() {
        $(document).fullScreen(true);
        $("#mainDiv").show();
        $("#cover").hide();

        $(document).bind("fullscreenchange", function() {
            start();
        });


    });

    $("#debug").change(function() {
        gameContext.toggleDebug(this.checked);
    });

    $("#gravity").change(function() {
        Global.world.gravity.y = $(this).val() / 100;
        gameContext.refreshSettings();
    });
});