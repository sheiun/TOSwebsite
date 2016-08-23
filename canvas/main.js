
var fieldManager       = null;
var sceneManagerField  = null;
var historyManager     = null;
var environmentManager = null;

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

(function(){
    var oldLog = console.log;
    console.log = function (message) {        
        $('#log').append( '\n'+message );
        oldLog.apply(console, arguments);
    };
})();

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
    };
    this.clone = function(){
        return new Point(self.x, self.y, false);
    };
};

var MouseInfo = function(){
    var self = this;
    console.log('MouseInfo.start');
    this.point = new Point();
    console.log('MouseInfo.point');
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

$(document).ready( function(){
    console.log('startReady');
try{

    // check device
    if( TOUCH_DEVICE ){
        $('nav').hide();
    }

    // read url message and load 
    historyManager = new HistoryManager();
    console.log('historyManager.new');
    historyManager.initialize();
    console.log('historyManager.initialize');
    environmentManager = new EnvironmentManager();
    console.log('environmentManager.new');
    environmentManager.initialize();
    console.log('environmentManager.initialize');

    // build canvas object
    sceneManagerField = new SceneManager( $("#DragCanvas"), TOUCH_DEVICE );
    console.log('sceneManagerField.new');
    sceneManagerField.startInterval(false);
    console.log('sceneManagerField.startInterval');
    fieldManager = new FieldManager( $("#DragCanvas"), historyManager, environmentManager );
    console.log('fieldManager.new');
    sceneManagerField.changeScene(fieldManager);
    console.log('fieldManager.changeScene');

    
}catch(e){
    $('#catch').text(e);
}


});