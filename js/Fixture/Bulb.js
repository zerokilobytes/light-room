var Bulb = function(context) {
    this.context = context;
    this.rotation = 0;
    this.active = false;
    this.arrowHead = null;
    this.arrowTail = null;
    this.virtualArrow = null;
    this.lastTime = null;
    this.fireRate = 200;
    this.init();
};

Bulb.prototype = {
    init: function() {
        this.type = "fixture";
        this.bowCenter = null;
        this.bodyVector = new Vector2D(281, 236);
        this.scaleVector = new Vector2D(.75, .75);
        Guid.prototype.set.call(this);
    },
    spawn: function(data) {
        this.enabled = true;

        this.lastTime = new Date();
        //this.bowCenter = new Vector2D(data.x, data.y);
        //this.arrowHead = this.addMarker(new Vector2D(data.x, data.y));
        this.context.stage.addChild(this.arrowHead);
        this.rotation = data.rotation;
        this.context.stage.update();

        this.skin = this.createSkin(
                Resource.get('bulb'),
                new Vector2D(data.x, data.y),
                new Vector2D(this.bodyVector.x / 2, this.bodyVector.y / 2));

        this.skin.getBitmap().rotation = this.rotation;
        this.context.stage.addChild(this.skin.getBitmap());
        var _this = this;

        this.context.stage.addEventListener("stagemousedown", function(event) {
           
        });

        this.context.stage.addEventListener("stagemouseup", function(event) {
            _this.active = false;
        });

        this.context.stage.addEventListener("stagemousemove", function(event) {
            if (_this.active) {
                //_this.updatePosition(new Vector2D(event.stageX, event.stageY));
            }
        });
    },
    getPosition: function() {
        return this.bowCenter;
    },
    update: function() {
        var fireRate = this.context.modelManager.fireRate;
        var currentTime = new Date();
        var diff = currentTime.getTime() - this.lastTime.getTime();
        if (diff >= fireRate) {
            this.lastTime = currentTime;
            this.fire();
        }
    },
    fire: function() {

        if (this.active) {
            var space = 10;
            var arrowCount = Global.arrow.count;
            for (i = 0; i < arrowCount; i++) {
                this.context.addArrow(new Vector2D(this.arrowHead.x + i * space, this.arrowHead.y), this.getPosition());
            }
        }
    },
    updatePosition: function(position) {
        var radius = 70;
        var angleRadian = Math.atan2(position.y - this.bowCenter.y, position.x - this.bowCenter.x);
        var angle = angleRadian * 180 / Math.PI;
        this.skin.getBitmap().rotation = angle + 90;

        this.arrowHead.x = this.bowCenter.x - Math.cos(angleRadian + MathFunc.toRadiant(180)) * radius;
        this.arrowHead.y = this.bowCenter.y - Math.sin(angleRadian + MathFunc.toRadiant(180)) * radius;
    },
    createSkin: function(image, positionVector, centerVector) {
        var skin = new EntitySkin(image, positionVector, centerVector, this.scaleVector);
        return skin;
    },
    addMarker: function(position) {
        var stage = new createjs.Stage();
        //Create a Shape DisplayObject.
        circle = new createjs.Shape();
        circle.graphics.beginFill("red").drawCircle(0, 0, 10);
        //Set position of Shape instance.
        circle.x = position.x;
        circle.y = position.y;
        circle.alpha = 0.2;
        //Add Shape instance to stage display list.
        stage.addChild(circle);
        //Update stage will render next frame
        stage.update();

        return circle;
    },
    getRotation: function() {
        return this.rotation;
    }
};
