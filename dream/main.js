
var historyManager     = null;
var environmentManager = null;

var sceneManager       = null;
var fieldManager       = null;

var teamManager        = null;
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

window.requestAnimFrame = (function(callback){
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1);
            };
})();

window.cancelAnimationFrame = (function(callback){
    return  window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame || 
            window.webkitCancelRequestAnimationFrame || 
            window.mozCancelAnimationFrame || 
            window.mozCancelRequestAnimationFrame ||
            function(id) {
                clearTimeout(id);;
            };
})(); 

$(document).ready( function(){

    // check device 大小整理
    if( TOUCH_DEVICE ){
        BALL_SIZE    = 60;
        REPLAY_SPEED = BALL_SIZE / MOVE_FRAME;
        SHIFT_BIAS   = BALL_SIZE / 20;
            
        $("#ScrollButton").hide();
        $("#ColorSelector img").addClass('img-btn-sm');
        $("#EditModeButton .btn-lg").removeClass("btn-lg").addClass("btn-md");
        $("#MoveModeButton .btn-lg").removeClass("btn-lg").addClass("btn-md");
        $('.selectpicker').selectpicker({ style:'btn-default btn-md' });
        $("#ReplayModeButton .btn-lg").removeClass("btn-lg").addClass("btn-md");

        var comboDiv = $("#ComboDiv").remove();
        $("#MobileComboDiv").append(comboDiv);
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
    comboManager = new ComboManager( $('#ComboScrollbar'), $('#ComboInfo'), historyManager );
    comboManager.initialize();
    dropColorManager = new DropColorManager( $("#DropColorSelector"), $("#DropColorScrollbar"), environmentManager );
    dropColorManager.initialize();
    teamManager = new TeamManager( $("#TeamMember") );
    teamManager.initialize();

    fieldManager = new FieldManager( sceneManager, $("#DragCanvas"), historyManager, environmentManager );
    sceneManager.changeScene(fieldManager); 

    gameMode = GAME_MODE.MOVE;
	environmentManager.newDrop = true;
    fieldManager.setStrategy( new FieldStrategyReMove(fieldManager, false) );

	// 隊伍變化時記得要重設
	$("#LeaderMember").change(function(){ environmentManager.resetTeamComposition(); });
	$("#FriendMember").change(function(){ environmentManager.resetTeamComposition(); });
});
