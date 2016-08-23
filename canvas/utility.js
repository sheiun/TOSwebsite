
// =================================================================
// 觸控判定
// =================================================================
var TOUCH_DEVICE = false;
if (navigator.userAgent.indexOf('iPhone') > 0
    || navigator.userAgent.indexOf('iPod') > 0
    || navigator.userAgent.indexOf('iPad') > 0
    || navigator.userAgent.indexOf('Android') > 0) {
    TOUCH_DEVICE = true;
}
// =================================================================


var Point = function(x, y, grid=true){
    var self = this;
    if(grid){
        this.x = x * BALL_SIZE;
        this.y = y * BALL_SIZE;
    }else{
        this.x = x;
        this.y = y;
    }

    this.getX = function(){
        return self.x;
    }
    this.getY = function(){
        return self.y;
    }
    this.getGridX = function(){
        return Math.floor( self.x / BALL_SIZE);
    }
    this.getGridY = function(){
        return Math.floor( self.y / BALL_SIZE);
    }
    this.toGrid = function(){
        this.x = Math.floor( self.x / BALL_SIZE) * BALL_SIZE;
        this.y = Math.floor( self.y / BALL_SIZE) * BALL_SIZE;
    }
    this.clone = function(){
        return new Point(self.x, self.y, false);
    };
};

var MouseInfo = function(){
    var self = this;
    this.point = new Point();
    this.lastPressed = false;
    this.pressed = false;
    this.clone = function(){
        var ret = new MouseInfo();
        ret.point = self.point.clone();
        ret.pressed = self.pressed;
        ret.lastPressed = self.lastPressed;
        return ret;
    };
};


// =================================================================
// =================================================================
// =================================================================
// =================================================================

var RANDOM = new Date().getTime();
function randomNext(){    
    var rand = Math.sin(RANDOM++) * 10000;
    return rand - Math.floor(rand);
}
function randomBySeed(seed){    
    var rand = Math.sin(seed) * 10000;
    return rand - Math.floor(rand);
}


var CREATE_COLOR = null;
function setColor(color, n){
    CREATE_COLOR = color;
    $("#ColorSelector button").css('background','');
    $("#ColorSelector button").eq(n).css('background','black');
}