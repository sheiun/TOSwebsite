
var Point = function(x, y, grid){
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
    };
    this.getY = function(){
        return self.y;
    };
    this.getGridX = function(){
        return Math.floor( self.x / BALL_SIZE);
    };
    this.getGridY = function(){
        return Math.floor( self.y / BALL_SIZE);
    };
    this.toGrid = function(){
        this.x = Math.floor( self.x / BALL_SIZE) * BALL_SIZE;
        this.y = Math.floor( self.y / BALL_SIZE) * BALL_SIZE;
        return this;
    };
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

var RANDOM = new Date().getTime();
function randomNext(){    
    var rand = Math.sin(RANDOM++) * 10000;
    return rand - Math.floor(rand);
}
function randomBySeed(seed){    
    var rand = Math.sin(seed) * 10000;
    return rand - Math.floor(rand);
}


// =================================================================
// =================================================================


var Direction8 = {
    TENKEY_1 :1, // </
    TENKEY_2 :2, // ↓
    TENKEY_3 :3, // \>
    TENKEY_4 :4, // ←
    TENKEY_5 :5, // x
    TENKEY_6 :6, // →
    TENKEY_7 :7, // <\
    TENKEY_8 :8, // ↑
    TENKEY_9 :9  // />
};
function getDirectionByPoints(lastPoint, newPoint){
    if( newPoint.getGridX() > lastPoint.getGridX() ){
        if( newPoint.getGridY() > lastPoint.getGridY() ){ return Direction8.TENKEY_3; }
        else if( newPoint.getGridY() < lastPoint.getGridY() ){ return Direction8.TENKEY_9; }
        else if( newPoint.getGridY() == lastPoint.getGridY() ){ return Direction8.TENKEY_6; }
    }else if( newPoint.getGridX() < lastPoint.getGridX() ){
        if( newPoint.getGridY() > lastPoint.getGridY() ){ return Direction8.TENKEY_1; }
        else if( newPoint.getGridY() < lastPoint.getGridY() ){ return Direction8.TENKEY_7; }
        else if( newPoint.getGridY() == lastPoint.getGridY() ){ return Direction8.TENKEY_4; }
    }else{
        if( newPoint.getGridY() > lastPoint.getGridY() ){ return Direction8.TENKEY_2; }
        else if( newPoint.getGridY() < lastPoint.getGridY() ){ return Direction8.TENKEY_8; }
        else{ return Direction8.TENKEY_5; }
    }
}
function getAngleByPoints(lastPoint, newPoint){
    var offsetX = newPoint.getX() - lastPoint.getX();
    var offsetY = newPoint.getY() - lastPoint.getY();
    var angle = Math.atan2(offsetY, offsetX) * ( 180.0 / Math.PI ) ;
    angle = (angle + 360) % 360;
    return angle;
}



// =================================================================
// =================================================================

var ICON_SIZE     = 50;
var BALL_SIZE     = 80;

var DELETE_SPEED  = 10;
var DROP_SPEED    = 5;

var SECOND_FRAMES = 40;

var MOVE_FRAME    = 6;
var REPLAY_SPEED  = BALL_SIZE / MOVE_FRAME;