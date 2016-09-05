
var historyManager     = null;
var environmentManager = null;

var sceneManager       = null;
var fieldManager       = null;
var barManager         = null;
var comboManager       = null;
var dropColorManager   = null;

var gameMode = GAME_MODE.EMPTY;

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
        // check device 大小整理
        if( TOUCH_DEVICE ){
            //$('nav').hide();

            BALL_SIZE = 60;
            REPLAY_SPEED = BALL_SIZE / MOVE_FRAME;
            SHIFT_BIAS = BALL_SIZE / 20;
            
            $("#ColorSelector img").addClass('img-btn-sm');
            $("#EditModeButton .btn-lg").removeClass("btn-lg").addClass("btn-md");
            $("#MoveModeButton .btn-lg").removeClass("btn-lg").addClass("btn-md");
            $('.selectpicker').selectpicker({ style:'btn-default btn-md' });
            $("#ReplayModeButton .btn-lg").removeClass("btn-lg").addClass("btn-md");

            $('#DragCanvas').css('background-size', (BALL_SIZE*4)+' px '+(BALL_SIZE*4)+' px');
        }else{
            $("#ColorSelector img").addClass('img-btn-lg');
            $('.selectpicker').selectpicker({ style:'btn-default btn-lg' });
        }

        //initail autoHidingNavbar
        $(".navbar-fixed-top").autoHidingNavbar();

        // 歷史紀錄和環境設定
        historyManager = new HistoryManager();
        historyManager.initialize();

        environmentManager = new EnvironmentManager();
        environmentManager.initialize();

        // 主畫面和動畫設定
        sceneManager = new SceneManager( $("#DragCanvas"), TOUCH_DEVICE );
        sceneManager.startInterval(false);

        // 其他元件設定
        barManager = new BarManager( $("#BarCanvas"), environmentManager );
        barManager.initialize();
        comboManager = new ComboManager( $('#comboScrollbar'), $('#comboInfo'), historyManager );
        comboManager.initialize();
        dropColorManager = new DropColorManager( $("#DropColorSelector"), $("#DropColorScrollbar"), environmentManager );
        dropColorManager.initialize();

        // 分析網址
        parseUrl();

        fieldManager = new FieldManager( sceneManager, $("#DragCanvas"), historyManager, environmentManager );
        sceneManager.changeScene(fieldManager);

        $("#EditModeButton").hide();
        $("#MoveModeButton").hide();
        $("#ReplayModeButton").hide();

        $("#webmenu").msDropDown({
            visibleRows: 3,
            rowHeight: 80,
            openDirection: 'alwaysDown',
        });
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

    gameMode = GAME_MODE.EDIT;
    fieldManager.setStrategy(new FieldStrategyEdit(fieldManager));
}
function setMoveMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").hide();
    $("#MoveModeButton").show();
    $("#ReplayModeButton").hide();

    checkPanelLoader();
    gameMode = GAME_MODE.MOVE;
    fieldManager.setStrategy( new FieldStrategyMove(fieldManager, false) );
}
function setReplayMode(button){
    $("#MainButton button").css('background','').css('color','black');
    $(button).css('background','#4d3900').css('color','white');
    $("#EditModeButton").hide();
    $("#MoveModeButton").hide();
    $("#ReplayModeButton").show();

    gameMode = GAME_MODE.REPLAY;
    fieldManager.setStrategy( new FieldStrategyMove(fieldManager, true) );
}
