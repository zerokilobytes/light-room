var Sound = function() {

};

Sound.prototype = {
};

Sound.AVE_MARIA = "ave_maria";

Sound.context = null;

Sound.preload = function(manifest) {
    createjs.Sound.registerManifest(manifest);
};

Sound.register = function(context) {
    Sound.context = context;

};

Sound.play = function(sound, complete) {
    //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
    //var instance = createjs.Sound.play(9, createjs.Sound.INTERRUPT_NONE, 0, 0, false, 1);
    //var instance = createjs.Sound.play(sound, createjs.Sound.INTERRUPT_ALL, 0, 0, 0, 1);
    var instance = createjs.Sound.play(sound, true);
    if (instance === null || instance.playState === createjs.Sound.PLAY_FAILED) {
        return;
    }
    if (complete) {
        instance.addEventListener("complete", complete);
    }
};

Sound.stop = function() {
    createjs.Sound.stop();
};