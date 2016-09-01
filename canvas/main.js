
var historyManager     = null;
var environmentManager = null;

var sceneManagerField  = null;
var fieldManager       = null;
var barManager         = null;
var comboManager       = null;


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
            BALL_SIZE = 60;
            $('nav').hide();
            $('#DragCanvas').css('background-size', (BALL_SIZE*4)+' px '+(BALL_SIZE*4)+' px');
        }
        //initail autoHidingNavbar
        $(".navbar-fixed-top").autoHidingNavbar();
        //initial Scrollbar
        /*
        var amount=Math.max.apply(Math,$("#HorizontalScrollbar li").map(function(){return $(this).outerWidth(true);}).get());
        $("#HorizontalScrollbar").mCustomScrollbar({
            axis:"x",
            theme:"minimal-dark",
            advanced:{
                autoExpandHorizontalScroll:true
            },
            snapAmount: amount,
        });
        $("#BattleInfomationScrollbar").mCustomScrollbar({
            axis:"y",
            theme:"inset-dark"
        });*/
        $('.selectpicker').selectpicker({ style:'btn-default btn-lg' });

        // read url message and load 
        historyManager = new HistoryManager();
        historyManager.initialize();
        environmentManager = new EnvironmentManager();
        environmentManager.initialize();

        // build canvas object
        sceneManagerField = new SceneManager( $("#DragCanvas"), TOUCH_DEVICE );
        sceneManagerField.startInterval(false);

        barManager = new BarManager( $("#BarCanvas"), environmentManager );
        barManager.initialize();
        comboManager = new ComboManager( $('#comboScrollbar'), $('#comboInfo'), historyManager );
        comboManager.initialize();

        fieldManager = new FieldManager( sceneManagerField, $("#DragCanvas"), historyManager, environmentManager );
        sceneManagerField.changeScene(fieldManager);

        $("#EditModeButton").hide();
        $("#MoveModeButton").hide();
        $("#ReplayModeButton").hide();

        
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
