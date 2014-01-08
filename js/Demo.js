var gameContext;
var fullScreen = false;
var loaded = false;
var playing = false;
function init() {
    Resource.load(manifest, handleComplete);
    //Sound.preload(manifest);
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
        //play_music();
    });
    $('.trigger, #gameCanvas, #debugCanvas').on("mousemove", function() {
        //play_music();
    });
    $('.trigger, #gameCanvas, #debugCanvas').on("mouseenter", function() {
        //play_music();
    });

    function registerSound() {
        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashPlugin]);
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.addEventListener("fileload", createjs.proxy(loadHandler, this));
        createjs.Sound.registerSound("sounds/ave_maria.mp3", "ave_maria");
        function loadHandler(event) {
            console.log("Sound Loaded");
            // This is fired for each sound that is registered.
            var instance = createjs.Sound.play("ave_maria");  // play using id.  Could also use full source path or event.src.
            instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
            instance.volume = 0.5;
        }
    }

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
    registerSound();
});