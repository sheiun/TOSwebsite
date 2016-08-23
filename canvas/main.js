
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
        
        $('pre').text( $('pre').text()+'\n'+message );
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

    // read url message and load 
    historyManager = new HistoryManager();
    historyManager.initialize();
    console.log('historyManager.initialize');
    environmentManager = new EnvironmentManager();
    environmentManager.initialize();
    console.log('environmentManager.initialize');

    // build canvas object
    sceneManagerField = new SceneManager( $("#DragCanvas"), TOUCH_DEVICE );
    sceneManagerField.startInterval(false);
    fieldManager = new FieldManager( $("#DragCanvas"), historyManager, environmentManager );
    sceneManagerField.changeScene(fieldManager);

    
}catch(e){
    $('pre').text(e);
}


});