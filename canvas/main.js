
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


$(document).ready( function(){
    console.log('startReady');
try{
    // check device
    if( TOUCH_DEVICE ){
        $('nav').hide();
    }

    var p = new CanvasPoint(0, 1);
    console.log(p);
    var m = new MouseInfo();
    console.log(m);
    
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