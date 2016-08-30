
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

/*
(function(){
    var oldLog = console.log;
    console.log = function (message) {
        $('#log').append( '\n'+message );
        oldLog.apply(console, arguments);
    };
})();*/

$(document).ready( function(){
    //try{
        // check device
        if( TOUCH_DEVICE ){
            $('nav').hide();
        }

        // read url message and load 
        historyManager = new HistoryManager();
        historyManager.initialize();
        environmentManager = new EnvironmentManager();
        environmentManager.initialize();

        // build canvas object
        sceneManagerField = new SceneManager( $("#DragCanvas"), TOUCH_DEVICE );
        sceneManagerField.startInterval(false);
        fieldManager = new FieldManager( sceneManagerField, $("#DragCanvas"), historyManager, environmentManager );
        sceneManagerField.changeScene(fieldManager);
        
    //}catch(e){  
    //    $('#log').append( '\n'+e );
    //}

});



function setEditMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").show();
    $("#MoveModeButton").hide();
    $("#ReplayModeButton").hide();

    fieldManager.setStrategy(new FieldStrategyEdit(fieldManager));
}
function setMoveMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").hide();
    $("#MoveModeButton").show();
    $("#ReplayModeButton").hide();

    fieldManager.setStrategy(
        //new FieldStrategyDropDelete(fieldManager, null, null)
        new FieldStrategyMove(fieldManager, false)
    );
}
function setReplayMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").hide();
    $("#MoveModeButton").hide();
    $("#ReplayModeButton").show();

    fieldManager.setStrategy( 
        new FieldStrategyMove(fieldManager, true) 
    );
}
