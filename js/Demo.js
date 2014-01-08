var gameContext;
var fullScreen = false;
var loaded = false;
var playing = false;
function init() {
    Resource.load(manifest, handleComplete);
    Sound.preload(manifest);
}
function handleComplete() {
    //$("#mainDiv").show();
    //$("#cover").hide();
    //start();
    loaded = true;
    settings = new Settings(Global.gameSettings);
    settings.screeSize = Browser.getSize();
    gameContext = new GameContext(settings, test1);
}
function start() {
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
        if (!fullScreen && loaded === true) {



            //$(document).fullScreen(true);
            $("#mainDiv").show();
            $("#cover").hide();


            start();
            $(document).bind("fullscreenchange", function() {
                start();
                fullScreen = true;
            });
        }
    });

    $('.trigger, #gameCanvas, #debugCanvas').on("mouseover", function() {
        play_music();
    });
    $('.trigger, #gameCanvas, #debugCanvas').on("mousemove", function() {
        play_music();
    });
    $('.trigger, #gameCanvas, #debugCanvas').on("mouseenter", function() {
        play_music();
    });

    function play_music() {
        if (loaded === true && playing === false) {
            playing = true;
            var play = function() {
                Sound.play(Sound.AVE_MARIA, play);
            };
            Sound.play(Sound.AVE_MARIA, play);
        }
    }
    ;

    $("#debug").change(function() {
        gameContext.toggleDebug(this.checked);
    });

    $("#gravity").change(function() {
        Global.world.gravity.y = $(this).val() / 100;
        gameContext.refreshSettings();
    });
});