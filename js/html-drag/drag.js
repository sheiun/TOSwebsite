
//==============================================================
// BASIC LENGTH
//==============================================================
var WIDTH = 80;
var HEIGHT = 80;

var TR_INDEX;
var TD_INDEX;
var BASE_LEFT;
var BASE_TOP;
var TR_NUM = parseInt( $("#dragContainment").attr("tr") );
var TD_NUM = parseInt( $("#dragContainment").attr("td") );

var ACCURACY = 0.6;

//==============================================================
// GLOBAL VARIABLE
//==============================================================
var COLORS = ['w', 'f', 'p', 'l', 'd', 'h'];
var TEAM_COLORS = [ ];
var CREATE_COLOR = null;

var STRAIGHT_SETS = [];
var HORIZONTAL_SETS = [];
var COLOR_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
var COLOR_SETS_PREPARE = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
var GROUP_SIZE = {'w':3, 'f':3, 'p':3, 'l':3, 'd':3, 'h':3};
var GROUP_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
var COLOR_RANDOM = Math.floor( Math.random() * 1000 );

var REMOVE_STACK = [];
var STRONG_STACK = {};
var DROP_STACK = [];
var DROP_WAVES = 0;
var COMBO_TIMES = 0;
var COMBO_STACK = [];
var COMBO_SHOW = 0;
var HISTORY_SHOW = 0;
var HISTORY_RANDOM = COLOR_RANDOM;
var HISTORY_SKILL_VARIABLE;

var DRAG_ANIMATE_TIME = 100;
var REMOVE_TIME = 100;
var FADEOUT_TIME = 200;
var DROP_TIME = 150;

var MOVING = false;
var MOVE_OUT_OF_TIME = false;
var START_TIME = 0;
var TIME_INTERVAL;
var TIME_RUNNING = false;
var TIME_GRADIENT;
var TIME_RECT;

var HISTORY = [];
var INITIAL_PANEL = [];
var FINAL_PANEL = [];
var CLIPBOARD;
var MIN_SHIFT = 8;
var MAX_SHIFT = 50;

var MAIN_STATE;

//==============================================================
// CONTROL PARAMETER
//==============================================================
var TIME_IS_LIMIT = true;
var TIME_LIMIT = 5;
var DROPABLE = false;
var AUTO_REMOVE = true;
var REPLAY_SPEED = 300;
var AUDIO = true;

var TEAM_COLORS_CHANGEABLE = true;
var TEAM_LEADER_LEFT = null;
var TEAM_LEADER_RIGHT = null;

//==============================================================
// Button click functions
//==============================================================
$(document).ready( function(){
    //initail autoHidingNavbar
    $(".navbar-fixed-top").autoHidingNavbar();

    //initial Clipboard
    CLIPBOARD = new Clipboard( document.getElementById('clipboard') );
    CLIPBOARD.on('success', function(e) {
        alert("\n\n此次模擬結果網址：\n\n"+$("#clipboard").attr("data-clipboard-text")+"\n\n此網址已複製到剪貼簿。\n\n");
    });
    CLIPBOARD.on('error', function(e) {
        alert("製造網址時產生錯誤，敬請見諒。\n\n建議使用Chrome進行作業。");
    });

    //initial Scrollbar
    $("#Scrollbar").mCustomScrollbar({
        axis:"y",
        theme:"minimal-dark"
    });
    var amount=Math.max.apply(Math,$("#HorizontalScrollbar li").map(function(){return $(this).outerWidth(true);}).get());
    $("#HorizontalScrollbar").mCustomScrollbar({
        axis:"x",
        theme:"minimal-dark",
        advanced:{
            autoExpandHorizontalScroll:true
        },
        snapAmount: amount,
    });

    //load history if exist
    if( $.url("?record") ){
        parseUploadJson( LZString.decompressFromEncodedURIComponent( $.url("?record") ) );
    }else{
        newRandomPlain();
    }

    MAIN_STATE = "count";
    closeCanvas();
    resetTimeDiv();
    setComboShow();
    setHistoryShow();
});

function newRandomPlain(){
    resetColors();
    initialTable();
    initialColor();
    if( $("#optionalPanel").text() == "版面製作中" ){
        $("#dragContainment tr td").mousedown( function(){ setElementByOption(this); } );
    }else{
        nextMoveWave();
    }
}
function newOptionalPlain(){
    $("#optionalPanel").text("版面製作中");
    $("#optionalPanel").closest("button").attr("onclick","endOptionalPlain()");
    $("#dragContainment tr td").mousedown( function(){ setElementByOption(this); } );
    MAIN_STATE = "create";
    AUTO_REMOVE = false;
    resetMoveTime();
    stopDragging();
}
function endOptionalPlain(){
    $("#optionalPanel").text("開始自選版面");
    $("#optionalPanel").closest("button").attr("onclick","newOptionalPlain()");
    $("#dragContainment tr td").unbind("mousedown");
    $("#panelControl button").css('background','');
    CREATE_COLOR = null;
    returnMainState();
    returnAutoRemove();
    nextMoveWave();
}
function setColor(color, n){
    CREATE_COLOR = color;
    $("#mouseImg").remove();
    $("#panelControl button").css('background','');
    $("#panelControl button").eq(n).css('background','lightgray');
}
function setElementByOption(e){
    if( CREATE_COLOR != null ){
        $(e).find("img").remove()
        $(e).append( newElementByItem(CREATE_COLOR) );
    }
}

function toggleFreeDrag(){
    if( $("#freeDrag").text() == "自由移動" ){
        $("#freeDrag").text("一般移動");
        MAIN_STATE = "count";
    }else{
        $("#freeDrag").text("自由移動");
        MAIN_STATE = "freeDrag";
    }
}
function returnMainState(){
    if( $("#freeDrag").text() == "自由移動" ){
        MAIN_STATE = "freeDrag";
    }else{
        MAIN_STATE = "count";
    }
}
function toggleTimeLimit(){
    if( $("#timeLimit").text() == "限制時間" ){
        $("#timeLimit").text("無限時間");
        $("#timeRange").hide();
        TIME_IS_LIMIT = false;
    }else{
        $("#timeLimit").text("限制時間");
        $("#timeRange").show();
        TIME_IS_LIMIT = true;
        TIME_LIMIT = 5;
    }
}
function toggleAutoRemove(){
    if( $("#autoRemove").text() == "自動消除" ){
        $("#autoRemove").text("保持待機");
        AUTO_REMOVE = false;
    }else{
        $("#autoRemove").text("自動消除");
        AUTO_REMOVE = true;
        checkGroups();
    }
}
function returnAutoRemove(){
    if( $("#autoRemove").text() == "自動消除" ){
        AUTO_REMOVE = true;
    }else{
        AUTO_REMOVE = false;
    }
}
function toggleDropable(){
    if( $("#dropable").text() == "取消落珠" ){
        $("#dropable").text("隨機落珠");
        DROPABLE = true;
        resetColors();
    }else{
        $("#dropable").text("取消落珠");
        DROPABLE = false;
    }
}
function toggleAudio(){
    if( $("#playAudio").text() == "播放音效" ){
        $("#playAudio").text("關閉音效");
        AUDIO = false;
    }else{
        $("#playAudio").text("播放音效");
        AUDIO = true;
    }
}

function initialPlain(){
    backInitColor();
    nextMoveWave();
}
function finalPlain(){
    backFinalColor();
    nextMoveWave();
}
function replay(){
    $("#randomPanel").closest("button").prop("disabled", true);
    $("#optionalPanel").closest("button").prop("disabled", true);
    $("#initial").closest("button").prop("disabled", true);
    $("#final").closest("button").prop("disabled", true);
    $("#replay").closest("button").prop("disabled", true);

    MAIN_STATE = "review";
    AUTO_REMOVE = false;
    COLOR_RANDOM = HISTORY_RANDOM;
    loadSkillVariable(HISTORY_SKILL_VARIABLE);
    backInitColor();
    resetComboStack();
    replayHistory();
}
function endReplayHistory(){
    returnMainState();
    returnAutoRemove();
    $("#randomPanel").closest("button").prop("disabled", false);
    $("#optionalPanel").closest("button").prop("disabled", false);
    $("#initial").closest("button").prop("disabled", false);
    $("#final").closest("button").prop("disabled", false);
    $("#replay").closest("button").prop("disabled", false);
    $("#review").text("顯示軌跡");
    closeCanvas();;
    endMoveWave();
}
function toggleReviewPath(){
    if( $("#review").text() == "顯示軌跡" ){
        $("#review").text("隱藏軌跡");
        MAIN_STATE = "review";        
        AUTO_REMOVE = false;
        resetCanvas();
        drawPath();
    }else{
        $("#review").text("顯示軌跡");
        returnMainState();
        returnAutoRemove();
        closeCanvas();
        nextMoveWave();
    }
}

function showResult(){
    console.log(HISTORY);
    console.log(INITIAL_PANEL);
}
function showTime(now){    
    var timeFraction = ( TIME_LIMIT - ( now - START_TIME ) )/TIME_LIMIT;
    $("#timeRect").css( "clip", "rect(0px, "+
        parseInt($("#timeBack").css("width"))*timeFraction+"px,"+
        parseInt($("#timeBack").css("height"))+"px, 0px)" );
}
function setHistoryShow(){    
    $("#historyNum").text( HISTORY_SHOW );
}
function setComboShow(){    
    $("#comboNum").text( COMBO_SHOW );
}
function resetComboBox(){
    $("#comboBox").children().remove();
    $("#comboBox").attr("wave",-1);
}
function makeComboSet(setArr){
    var set_stack = [];
    for(var id of setArr){
        if( $("#dragContainment tr td").eq(id).children().length != 0 ){
            var src = $("#dragContainment tr td").eq(id).find("img.over").attr("src");
            var item = src.split('/')[src.split('/').length-1].split('.')[0];
            var img = newElementByItem(item)[0].removeClass("draggable over").addClass("comboBox");
            set_stack.push(img);
        }
    }
    return set_stack;
}
function addComboSet(comboSet){
    if( parseInt( $("#comboBox").attr("wave") ) < 0 ){
        $("#comboBox").attr("wave",DROP_WAVES);
        $("#comboBox").append( $("<div align=\"center\">首消</div><hr>").addClass("comboLabel") );
    }else if( parseInt( $("#comboBox").attr("wave") ) == 0 && DROP_WAVES > 0 ){
        $("#comboBox").attr("wave",DROP_WAVES);
        $("#comboBox").append( $("<div align=\"center\">落消</div><hr>").addClass("comboLabel") );
    }
    var div = $("<div>").addClass("imgComboSet");
    for(var e of comboSet){
        div.append(e);
    }
    $("#comboBox").append(div.append("<hr>"));

    $("#Scrollbar").mCustomScrollbar("update");
}
function addColorIntoBar(){
    if( CREATE_COLOR != null ){
        var id = parseInt( $("#optionalColors").attr("IDmaker") );
        $("#optionalColors").attr("IDmaker", id+1);
        var element = $("<img>").attr("src", mapImgSrc(CREATE_COLOR) );
        element.attr("color",CREATE_COLOR).attr("onclick","removeSelfColor("+id+")");
        var li = $("<li></li>").attr("id","li_"+id).append(element);
        $("#optionalColors li").eq(-1).before(li);

        $("#HorizontalScrollbar").mCustomScrollbar("update");
        setOptionalColors();
    }
}
function removeSelfColor(id){
    $("#li_"+id).remove();
    setOptionalColors();
}
function setOptionalColors(){
    COLORS = [];
    $("#optionalColors li").each(function(){
        if( $(this).find("img").length > 0 ){
            COLORS.push( $(this).find("img").attr("color") );
        }
    });
    resetColors();
}

function scroll_top(){
    $("html, body").animate({ scrollTop: 0 }, "fast");
};
function scroll_bottom(){
    $("html, body").animate({ scrollTop: $(document).height() }, "fast");
};
function hide_navbar(){
    $('.navbar-fixed-top').autoHidingNavbar('hide');
}

$("#file").change(function (){
    if( $(this).val() !== '' ){
        upload();
    }
});
$('#timeRange').change(function (){
    $(this).val( Math.max( parseInt($(this).attr("min")), 
        Math.min( parseInt($(this).attr("max")), parseInt($(this).val()) ) ) );
    TIME_LIMIT = $(this).val();
});
$('#speedSelect').change(function (){
    REPLAY_SPEED = parseInt($(this).val());
});
$('#colorSelect').change(function (){
    var colorArr = $(this).val().split(",");
    for(var i = 0; i < colorArr.length; i++){
        $("#panelControl button").eq(i).attr("onclick","setColor('"+colorArr[i]+"',"+i+")");
        $("#panelControl button img").eq(i).attr("src",mapImgSrc(colorArr[i]));
    }
});
$("#dropColorSelect").change(function (){
    if( $(this).val() == "optional" ){

        $("#optionalColors li img").closest("li").remove();
        var id = 0;
        for(var c of ["w", "f", "p", "l", "d", "h"]){
            var element = $("<img>").attr("src", mapImgSrc(c) );
            element.attr("color",c).attr("onclick","removeSelfColor("+id+")");
            var li = $("<li></li>").attr("id","li_"+id).append(element);
            $("#optionalColors li").eq(-1).before(li);
            id++;
        }
        $("#optionalColors").attr("IDmaker", id);

        $("#HorizontalScrollbar").show();
        setOptionalColors();
    }else{
        $("#HorizontalScrollbar").hide();
        COLORS = $(this).val().split(",");
        resetColors();
    }
});
$("#teamLeftSelect").change(function (){
    TEAM_LEADER_LEFT = $(this).val();
    console.log(TEAM_LEADER_LEFT);
    if( TEAM_LEADER_LEFT == "COUPLE-f" || TEAM_LEADER_LEFT == "COUPLE-p" ){
        TEAM_COLORS_CHANGEABLE = false;
        resetColors();
    }
    if( TEAM_LEADER_LEFT == "COUPLE-f" ){
        GROUP_SIZE['f'] = 2;
        GROUP_SIZE['h'] = 2;
    }
    if( TEAM_LEADER_LEFT == "COUPLE-p" ){
        GROUP_SIZE['p'] = 2;
        GROUP_SIZE['h'] = 2;
    }
    if( TEAM_LEADER_LEFT != "COUPLE-f"  && TEAM_LEADER_RIGHT != "COUPLE-f" ){
        GROUP_SIZE['f'] = 3;
    }
    if( TEAM_LEADER_RIGHT != "COUPLE-p" && TEAM_LEADER_LEFT != "COUPLE-p"  ){
        GROUP_SIZE['p'] = 3;
    }
    if( TEAM_LEADER_LEFT != "COUPLE-f" && TEAM_LEADER_RIGHT != "COUPLE-f" &&
        TEAM_LEADER_LEFT != "COUPLE-p" && TEAM_LEADER_RIGHT != "COUPLE-p" ){
        GROUP_SIZE['h'] = 3;
        TEAM_COLORS_CHANGEABLE = true;
        resetColors();
    }
});
$("#teamRightSelect").change(function (){
    TEAM_LEADER_RIGHT = $(this).val();
    if( TEAM_LEADER_RIGHT == "COUPLE-f" || TEAM_LEADER_RIGHT == "COUPLE-p" ){
        TEAM_COLORS_CHANGEABLE = false;
        resetColors();
    }
    if( TEAM_LEADER_RIGHT == "COUPLE-f" ){
        GROUP_SIZE['f'] = 2;
        GROUP_SIZE['h'] = 2;
    }
    if( TEAM_LEADER_RIGHT == "COUPLE-p" ){
        GROUP_SIZE['p'] = 2;
        GROUP_SIZE['h'] = 2;
    }
    if( TEAM_LEADER_LEFT != "COUPLE-f"  && TEAM_LEADER_RIGHT != "COUPLE-f" ){
        GROUP_SIZE['f'] = 3;
    }
    if( TEAM_LEADER_RIGHT != "COUPLE-p" && TEAM_LEADER_LEFT != "COUPLE-p"  ){
        GROUP_SIZE['p'] = 3;
    }
    if( TEAM_LEADER_LEFT != "COUPLE-f" && TEAM_LEADER_RIGHT != "COUPLE-f" &&
        TEAM_LEADER_LEFT != "COUPLE-p" && TEAM_LEADER_RIGHT != "COUPLE-p" ){
        GROUP_SIZE['h'] = 3;
        TEAM_COLORS_CHANGEABLE = true;
        resetColors();
    }
});

//==============================================================
// reset functions
//==============================================================
function resetDraggable(){
    $("#dragContainment tr td img").removeAttr("style");
    $("img.draggable").draggable({
        containment: "#dragContainment",
        zIndex: 2500,
        start: function(event, ui){
            countGridPositon(this);
            if( (MOVING && MAIN_STATE == "freeDrag") || TIME_RUNNING ){ 
                return; 
            }
            initialMoveWave();
        },
        drag: function(event, ui) {
            if( MOVE_OUT_OF_TIME ){ return false; }
            dragPosition(this);
        },
        stop: function(){
            if( !MOVE_OUT_OF_TIME ){
                endPosition(this);
            }
            if( MAIN_STATE == "freeDrag" && !MOVE_OUT_OF_TIME ){
                HISTORY.push(null);
                resetDraggable();
                startDragging();
            }
            if( MAIN_STATE == "count" && !MOVE_OUT_OF_TIME ){
                endMoveWave();
            }
        },
    });
}

function resetBase(){
    TR_NUM = parseInt( $("#dragContainment").attr("tr") );
    TD_NUM = parseInt( $("#dragContainment").attr("td") );
    BASE_LEFT = $("#dragContainment td").eq(0).offset().left;
    BASE_TOP = $("#dragContainment td").eq(0).offset().top;
}
function resetColors(){
    TEAM_COLORS = []; 
    for(var i = 0; i < TD_NUM; i++){
        if( TEAM_COLORS_CHANGEABLE ){
            TEAM_COLORS.push( COLORS );
        }else{
            TEAM_COLORS.push(['w', 'f', 'p', 'l', 'd', 'h']);
        }
    }
}
function resetColorSet(){
    STRAIGHT_SETS = [];
    for(var i = 0; i < TD_NUM; i++){
        STRAIGHT_SETS.push([]);
    }
    HORIZONTAL_SETS = [];
    for(var i = 0; i < TR_NUM; i++){
        HORIZONTAL_SETS.push([]);
    }
    COLOR_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
    COLOR_SETS_PREPARE = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
}
function resetGroupSet(){
    GROUP_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
}
function resetDropStack(){
    REMOVE_STACK = [];
    STRONG_STACK = {};
    DROP_STACK = [];
    for(var i = 0; i < TD_NUM; i++){
        DROP_STACK.push([]);
    }
}
function resetComboStack(){    
    DROP_WAVES = 0;
    COMBO_TIMES = 0;
    COMBO_STACK = [];
    COMBO_SHOW = 0;
    setComboShow();
    resetComboBox();
}
function resetMoveTime(){
    MOVING = false;
    START_TIME = 0;
    TIME_RUNNING = false;
    clearInterval(TIME_INTERVAL);
}
function resetHistory(){
    HISTORY_SHOW = 0;
    HISTORY_RANDOM =  COLOR_RANDOM;
    HISTORY_SKILL_VARIABLE = saveSkillVariable();
    HISTORY = [];
    INITIAL_PANEL = [];
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        if( $("#dragContainment tr td").eq(i).find("img") == 0 ){
            INITIAL_PANEL.push( undefined );
        }else{
            try{
                var src = $("#dragContainment tr td").eq(i).find("img.over").attr("src");
                var item = src.split('/')[src.split('/').length-1].split('.')[0];
                INITIAL_PANEL.push( item );
            }catch(e){
                INITIAL_PANEL.push( undefined );
            }
        }
    }
    FINAL_PANEL = [];
}
function recordFinal(){
    FINAL_PANEL = [];
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        if( $("#dragContainment tr td").eq(i).find("img") == 0 ){
            INITIAL_PANEL.push( undefined );
        }else{
            try{
                var src = $("#dragContainment tr td").eq(i).find("img.over").attr("src");
                var item = src.split('/')[src.split('/').length-1].split('.')[0];
                FINAL_PANEL.push( item );
            }catch(e){
                FINAL_PANEL.push( undefined );
            }
        }
    }

    var record = LZString.compressToEncodedURIComponent( parseDownloadJson() );
    var url = $.url("hostname")+$.url("path")+"?record="+record;
    $('#clipboard').attr("data-clipboard-text", url);
}
function resetCanvas(){
    $('#dragCanvas').show();
    $('#dragCanvas').clearCanvas();
    $('#dragCanvas').offset( $("#dragContainment").offset() );
    $('#dragCanvas').attr("width",TD_NUM*WIDTH).attr("height",TR_NUM*HEIGHT);   
}
function closeCanvas(){
    $('#dragCanvas').hide();
    $('#dragCanvas').clearCanvas();
    $('#dragCanvas').offset( $("#dragContainment").offset() );
    $('#dragCanvas').attr("width",TD_NUM*WIDTH).attr("height",TR_NUM*HEIGHT);
}
function resetTimeDiv(){
    $("#clock").offset({left: $("#dragContainment").offset().left });
    $("#timeBack").css( "width", TD_NUM*WIDTH-($("#clock").width()/2) );
    $("#timeBack").css( "height", $("#clock").height()/2 );
    $("#timeBack").offset({top: $("#clock").offset().top+($("#clock").height()/4),
                            left: $("#clock").offset().left+($("#clock").width()/2) });
    $("#timeRect").css( "width", TD_NUM*WIDTH-($("#clock").width()/2) );
    $("#timeRect").css( "height", $("#clock").height()/2 );
    $("#timeRect").offset({top: $("#clock").offset().top+($("#clock").height()/4),
                            left: $("#clock").offset().left+($("#clock").width()/2) });
}
function renewTimeDiv(){
    resetTimeDiv();
    $("#timeRect").css( "clip", "rect(0px, "+
        parseInt($("#timeBack").css("width"))+"px,"+
        parseInt($("#timeBack").css("height"))+"px, 0px)" );
}


function stopDragging(){
    MOVE_OUT_OF_TIME = true;
    $("#dragContainment tr td img").removeAttr("style");
    $("img.draggable").draggable({ disabled: true });
}
function startDragging(){
    MOVE_OUT_OF_TIME = false;
    $("img.draggable").draggable({ disabled: false });
}

function playAudioRemove(){
    if( !AUDIO ){ return; }
    if( COMBO_SHOW < 10 ){
        var mp3 = "sound/combo"+COMBO_SHOW+".mp3";
    }else{
        var mp3 = "sound/combo10.mp3";
    }
    var audio = new Audio(mp3);
    audio.volume = 0.5;
    audio.play();
}
function playAudioWrong(){
    if( !AUDIO ){ return; }
    var audio = new Audio('sound/wrong.mp3');
    audio.volume = 0.8;
    audio.play();
}

//==============================================================
// drag item analysis
//==============================================================
function countGridPositon(e){
    TD_INDEX = $(e).closest("td").index();
    TR_INDEX = $(e).closest("tr").index();
}

function endPosition(e){
    dragPosition(e);

    var over = $("<img></img>").attr("src",$(e).attr("src")).attr("color",$(e).attr("color")).addClass("draggable over");
    $("#dragContainment tr td").eq(TR_INDEX*TD_NUM+TD_INDEX).prepend(over);
    $(e).remove();
}

function dragPosition(e){
    $("#dragContainment tr td img").each( function(){
        if ( !$(this).is('.ui-draggable-dragging') && $(this).attr("animate") != "busy" ) {
            $(this).removeAttr('style');
        }
    } );

    var left = Math.max( 0, Math.min( $(e).offset().left - BASE_LEFT, WIDTH*(TD_NUM-1) ) );
    var top  = Math.max( 0, Math.min( $(e).offset().top  - BASE_TOP, HEIGHT*(TR_NUM-1) ) );
    var left_index = TD_INDEX;
    var top_index  = TR_INDEX;
    var left_vector = (left - (TD_INDEX*WIDTH) )/WIDTH;
    var top_vector  = (top  - (TR_INDEX*HEIGHT))/HEIGHT;
    var abs_left = Math.abs(left_vector);
    var abs_top = Math.abs(top_vector);

    if( abs_left > ACCURACY && abs_top > ACCURACY ){
        left_index += abs_left/left_vector;
        top_index  += abs_top/top_vector;
    }else if( abs_left - Math.max(abs_top-0.25,0) > ACCURACY ){
        left_index += abs_left/left_vector;
    }else if( abs_top - Math.max(abs_left-0.25,0) > ACCURACY ){
        top_index  += abs_top/top_vector;
    }

    if( left_index != TD_INDEX || top_index != TR_INDEX  ){
        if( !MOVING && !MOVE_OUT_OF_TIME && !TIME_RUNNING ){
            newMoveWave();
            MOVING = true;
            START_TIME = new Date().getTime() / 1000;
            HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );
            if( TIME_IS_LIMIT ){
                TIME_RUNNING = true;
                TIME_INTERVAL = setInterval( function(){ dragTimer(); }, 10);
            }
        }
        if( MAIN_STATE == "freeDrag" && MOVING &&!HISTORY.slice(-1)[0] ){
            HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );            
        }

        var td_base = $("#dragContainment tr td").eq(TR_INDEX*TD_NUM+TD_INDEX);
        var td_goal = $("#dragContainment tr td").eq(top_index*TD_NUM+left_index);
        var items = $(td_base).find("img");
        var item_base = $(td_base).find("img.under");
        var item_goal = $(td_goal).find("img");

        if( $(td_goal).children().length > 0 ){
            //檢查風化
            if( $(item_base).attr("src").indexOf("x") >= 0 || $(item_goal).attr("src").indexOf("x") >= 0 ){
                $("#dragContainment tr td img").removeAttr("style");      
                playAudioWrong();
                MOVE_OUT_OF_TIME = true;
                TIME_RUNNING = false;
                endMoveWave();
            }
        }

        if( $(td_goal).children().length > 0 ){
            var offset_base = $(item_base).offset();
            var offset_goal = $(item_goal).offset();
            var top_vector = (offset_base.top - offset_goal.top);
            var left_vector = (offset_base.left - offset_goal.left);

            items.remove();
            item_goal.remove();
            $(td_base).append(item_goal);
            $(td_goal).append(items);

            $(item_base).offset(offset_goal);
            $(item_goal).offset(offset_goal);
            $(item_goal).attr("animate","busy");
            $(item_goal).animate(   {top: "+="+top_vector+"px",left: "+="+left_vector+"px"},
                                    {   duration: DRAG_ANIMATE_TIME,
                                        complete: function(){
                                            $(this).removeAttr("animate");
                                        } } );
        }else{
            items.remove();
            $(td_goal).append(items);
            $(item_base).offset(offset_goal);
        }
        
        TD_INDEX = left_index;
        TR_INDEX = top_index;
        HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );
        HISTORY_SHOW += 1;
        setHistoryShow();
    }
}

//==============================================================
// timer
//==============================================================
function dragTimer(){
    var now = new Date().getTime() / 1000;
    showTime(now);

    if( TIME_IS_LIMIT && (now - START_TIME) > TIME_LIMIT ){
        MOVE_OUT_OF_TIME = true;
        TIME_RUNNING = false;
        endMoveWave();
    }
}

//==============================================================
// make element
//==============================================================
function initialTable(){
    $("#dragContainment tr").remove();
    for(var i = 0; i < TR_NUM; i++){
        var tr = $("<tr></tr>");
        for(var j = 0; j < TD_NUM; j++){
            $(tr).append($("<td></td>"));
        }
        $("#dragContainment").append(tr);
    }    
}

function initialColor(){
    for(var i = 0; i < TD_NUM; i++){
        for(var j = 0; j < TR_NUM; j ++){
            var target = $("#dragContainment tr td").eq(j*TD_NUM+i);
            if( $(target).children().length == 0 ){
                $(target).append( newElementByID(j*TD_NUM+i) );
            }
        }
    }
}

function mapColor(color){
    if( color ){
        return color[0];
    }else{
        return null;
    }
}
function mapImgSrc(color){
    if( color.indexOf('q') >= 0 ){ return "img/Icon/q.png"; }
    if( color.indexOf('x') >= 0 ){ return "img/Icon/x.png"; }
    return "img/Icon/"+color+".png";
}
function randomBySeed(){    
    var rand = Math.sin(COLOR_RANDOM++) * 10000;
    return rand - Math.floor(rand);
}

function newElementByID(id){
    var td_seat = id%TD_NUM;
    var colors = TEAM_COLORS[td_seat];
    var color = colors[ Math.floor( randomBySeed() * colors.length ) ];
    return newElementByItem(color);
}
function newElementByItem(item){
    var color = mapColor(item);
    if( color ){
        var strong = item.indexOf('+') >= 0;
        var src_path = mapImgSrc(item);
        var over = $("<img></img>").attr("src",src_path).attr("color",color).prop("strong",strong).addClass("draggable over");
        var under = $("<img></img>").attr("src",src_path).attr("color",color).prop("strong",strong).addClass("draggable under");
        return [over, under];
    }else{
        return null;
    }
}

//==============================================================
//  stage define 
//==============================================================
function initialMoveWave(){    
    resetBase();
    resetMoveTime();
}
function endMoveWave(){
    resetMoveTime();
    stopDragging();
    recordFinal();    
    checkGroups();
}
function nextMoveWave(){
    resetDraggable();
    startDragging();
    showResult();
}
function newMoveWave(){
    //Maybe used in next move
    resetComboStack();
    resetHistory();
    renewTimeDiv();
}

function checkGroups(){
    if( !AUTO_REMOVE ){ return; }

    resetBase();
    resetColorSet();
    resetGroupSet();
    resetDropStack();

    countColor();
    countGroup();

    var num = 0;
    for(var color in GROUP_SETS){
        num += GROUP_SETS[color].length;
        for(var set of GROUP_SETS[color]){
            var strong_amount = 0;
            for(var i of set){
                if( $("#dragContainment tr td img.over ").eq(i).prop('strong') ){
                    strong_amount += 1;
                }
            }

            var combo = {};
            combo['drop_wave'] = DROP_WAVES;
            combo['color'] = color;
            combo['amount'] = set.size;
            combo['strong_amount'] = strong_amount;
            combo['set'] = set
            COMBO_STACK.push(combo);
            COMBO_TIMES += 1;
        }
    }

    if( num == 0 ){
        if( TR_NUM > 5 ){
            endBrokeBoundary()
        }else{
            checkAttack();
        }
    }else{
        setTimeout( function(){
            removeGroups(TD_NUM*TR_NUM-1);
        }, REMOVE_TIME);        
    }
}

function checkStartSkill(){

}
function checkNewItemSkill(){

    if( TEAM_LEADER_LEFT  == "GREEK-w" ){ GreekSkill('w', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-w" ){ GreekSkill('w', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-f" ){ GreekSkill('f', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-f" ){ GreekSkill('f', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-p" ){ GreekSkill('p', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-p" ){ GreekSkill('p', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-l" ){ GreekSkill('l', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-l" ){ GreekSkill('l', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-d" ){ GreekSkill('d', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-d" ){ GreekSkill('d', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-h" ){ GreekSkill('h', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-h" ){ GreekSkill('h', 'right'); }

    if( TEAM_LEADER_LEFT  == "BIBLE-w" ){ BibleSkill('w'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-w" ){ BibleSkill('w'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-f" ){ BibleSkill('f'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-f" ){ BibleSkill('f'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-p" ){ BibleSkill('p'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-p" ){ BibleSkill('p'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-l" ){ BibleSkill('l'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-l" ){ BibleSkill('l'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-d" ){ BibleSkill('d'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-d" ){ BibleSkill('d'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-h" ){ BibleSkill('h'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-h" ){ BibleSkill('h'); }

    if( TEAM_LEADER_LEFT  == "GREEK-w" && TEAM_LEADER_RIGHT == "GREEK-w" ){ TeamGreekSkill("w"); }
    if( TEAM_LEADER_LEFT  == "GREEK-f" && TEAM_LEADER_RIGHT == "GREEK-f" ){ TeamGreekSkill("f"); }
    if( TEAM_LEADER_LEFT  == "GREEK-p" && TEAM_LEADER_RIGHT == "GREEK-p" ){ TeamGreekSkill("p"); }
    if( TEAM_LEADER_LEFT  == "GREEK-l" && TEAM_LEADER_RIGHT == "GREEK-l" ){ TeamGreekSkill("l"); }
    if( TEAM_LEADER_LEFT  == "GREEK-d" && TEAM_LEADER_RIGHT == "GREEK-d" ){ TeamGreekSkill("d"); }
}
function checkEndSkill(){

    if( TEAM_LEADER_LEFT  == "COUPLE-f" ){ coupleEndSkill("f"); }
    if( TEAM_LEADER_RIGHT == "COUPLE-f" ){ coupleEndSkill("f"); }
    if( TEAM_LEADER_LEFT  == "COUPLE-p" ){ coupleEndSkill("p"); }
    if( TEAM_LEADER_RIGHT == "COUPLE-p" ){ coupleEndSkill("p"); }

    nextMoveWave();

}
function checkAttack(){
    setTimeout(function(){
        checkEndSkill();
    }, 1000);
}

//==============================================================
// table color group analysis
//==============================================================
function countColor(){
    //count for straight
    for(var i = 0; i < TD_NUM; i++){
        for(var j = 0; j < TR_NUM; j ++){
            var set = new Set();
            var now = j*TD_NUM+i;
            var color = $("#dragContainment tr td").eq(now).find("img.over").attr("color");
            set.add(now);
            while( j < TR_NUM-1 ){
                var next = (j+1)*TD_NUM+i;
                var next_color = $("#dragContainment tr td").eq(next).find("img.over").attr("color");
                if( color && color == next_color ){
                    set.add(next);
                    j++;
                }else{
                    break;
                }
            }
            if( set.size >= GROUP_SIZE[color] ){
                COLOR_SETS[color].push(new Set(set));
                COLOR_SETS_PREPARE[color].push( new Set(set) );
                STRAIGHT_SETS[i].push(new Set(set));
            }
        }
    }
    //count for horizontal
    for(var i = 0; i < TR_NUM; i++){
        for(var j = 0; j < TD_NUM; j ++){
            var set = new Set();
            var now = i*TD_NUM+j;
            var color = $("#dragContainment tr td").eq(now).find("img.over").attr("color");
            set.add(now);
            while( j < TD_NUM-1 ){
                var next = i*TD_NUM+j+1;
                var next_color = $("#dragContainment tr td").eq(next).find("img.over").attr("color");
                if( color && color == next_color ){
                    set.add(next);
                    j++;
                }else{
                    break;
                }
            }
            if( set.size >= GROUP_SIZE[color] ){
                COLOR_SETS[color].push(new Set(set));
                COLOR_SETS_PREPARE[color].push(new Set(set));
                HORIZONTAL_SETS[i].push(new Set(set));
            }
        }
    }
}

function countGroup(){
    for(var key in COLOR_SETS_PREPARE){        
        while( COLOR_SETS_PREPARE[ key ].length > 0 ){
            var set = COLOR_SETS_PREPARE[ key ].pop();
            var setArr = Array.from(set);
            for(var id of setArr){
                for(var already_set of GROUP_SETS[ key ] ){
                    if(   already_set.has(id) ||
                        ( already_set.has(id+1) && id%TD_NUM < TD_NUM-1 ) ||
                        ( already_set.has(id-1) && id%TD_NUM > 0 ) ||
                        ( already_set.has(id+TD_NUM) && id < TD_NUM*(TR_NUM-1) ) ||
                        ( already_set.has(id-TD_NUM) && id >= TD_NUM ) ){
                        for(var already_i of already_set){
                            set.add(already_i);
                        }
                        GROUP_SETS[ key ].splice( GROUP_SETS[ key ].indexOf( already_set ), 1);
                    }
                }
            }
            GROUP_SETS[ key ].push(set);
        }
    }

}

//==============================================================
// remove & new group
//==============================================================
function removeGroups(next){    
    if( !AUTO_REMOVE ){ return; }

    var i = next;
    for( ; i >= 0; i--){
        if( REMOVE_STACK.indexOf(i) >= 0 ){ continue; }
        var isSet = inGroup(i);
        if( isSet ){
            setTimeout( function(){
                removePeriod(isSet, i-1);
            }, REMOVE_TIME );
            break;
        }
    }
    if( i < 0 ){
        newGroups();
    }
}
function removePeriod(set, next){
    var setArr = Array.from(set);
    var comboSet = makeComboSet( Array.from(set) );
    for(var id of setArr){
        if( !AUTO_REMOVE ){ break; }
        REMOVE_STACK.push(id);
        $("#dragContainment tr td").eq(id).find("img").fadeOut( FADEOUT_TIME, function (){
            $(this).remove();
        });
    }
    COMBO_SHOW += 1;
    setComboShow();
    addComboSet(comboSet);
    playAudioRemove();

    setTimeout( function(){
        removeGroups(next-1);
    }, FADEOUT_TIME );
}
function inGroup(id){
    for(var key in GROUP_SETS){
        for(var set of GROUP_SETS[key]){
            if( set.has(id) ){
                return set;
            }
        }
    }
    return false;
}

function newGroups(){
    if( !AUTO_REMOVE ){ return; }

    REMOVE_STACK.sort(function(a, b){return a-b});
    console.log(REMOVE_STACK);

    /*
    TODO
    希臘/巴比隊長技使用
    */
    checkNewItemSkill();

    for(var color in GROUP_SETS){
        for(var set of GROUP_SETS[color]){
            if( set.size >= 5 ){
                var rand_i = Math.floor( randomBySeed() * REMOVE_STACK.length );
                var id = REMOVE_STACK[rand_i];
                REMOVE_STACK.splice(rand_i,1);
                STRONG_STACK[id] = color+'+';
            }
        }
    }
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        if( REMOVE_STACK.indexOf(i) >= 0 ){
            if( DROPABLE ){
                var elements = newElementByID(i);
                if( elements ){
                    DROP_STACK[i%TD_NUM].push( elements );
                }
            }
        }else if( i in STRONG_STACK ){
            if( DROPABLE ){
                var elements = newElementByItem(STRONG_STACK[i]);
                if( elements ){
                    DROP_STACK[i%TD_NUM].push( elements );
                }
            }
        }
    }

    setTimeout( function(){
        DROP_WAVES += 1;
        dropGroups();
    }, REMOVE_TIME);
}

//==============================================================
// drop new element from stack
//==============================================================
function dropGroups(){
    if( !AUTO_REMOVE ){ return; }

    for(var i = 0; i < TD_NUM; i++){
        var num = 0;
        var length = DROP_STACK[i].length;
        for(var j = TR_NUM-1; j >= 0; j--){
            if( $("#dragContainment tr td").eq(j*TD_NUM+i).children().length == 0 ){
                num++;
            }else{
                if( num > 0 ){
                    var imgs = $("#dragContainment tr td").eq(j*TD_NUM+i).find("img").remove();
                    $(imgs).attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP+j*HEIGHT);
                    $("#dragContainment tr td").eq((j+num)*TD_NUM+i).append(imgs);
                }
            }
        }
        for(var n = 0; n < length; n++){
            var elements = DROP_STACK[i].pop();
            elements[0].attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP-(length-n)*HEIGHT);
            elements[1].attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP-(length-n)*HEIGHT);
            $("#dragContainment tr td").eq( (n+num-length)*TD_NUM+i ).append(elements);
        }
    }
    
    var max_drop = 0;
    $("#dragContainment tr td img").each(function(){
        if( $(this).attr("drop") ){
            max_drop = Math.max( $(this).attr("drop"), max_drop );
            $(this).offset({top: $(this).attr("toTop"), left: $(this).attr("toLeft")});
            $(this).animate({"top": "+="+parseInt($(this).attr("drop"))*HEIGHT+"px" },
                            {duration: parseInt($(this).attr("drop"))*DROP_TIME});
            $(this).removeAttr("drop").removeAttr("toTop").removeAttr("toLeft");
        }
    });

    setTimeout( function(){
        checkGroups();
    }, max_drop*DROP_TIME );
}

//==============================================================
// show history path
//==============================================================
function backInitColor(){
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        $("#dragContainment tr td").eq(i).children().remove();
        if( i < INITIAL_PANEL.length && INITIAL_PANEL[i] ){
            var item = INITIAL_PANEL[i];
            if( item ){
                $("#dragContainment tr td").eq(i).append( newElementByItem(item) );
            }
        }
    }
}
function backFinalColor(){
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        $("#dragContainment tr td").eq(i).children().remove();
        if( i < FINAL_PANEL.length && FINAL_PANEL[i] ){
            var item = FINAL_PANEL[i];
            if( item ){
                $("#dragContainment tr td").eq(i).append( newElementByItem(item) );
            }
        }
    }
}
    

function drawPath(){
    //clean prepare
    var line_history = [];
    var shift_analysis = {};
    var i = 0;
    var line_index = 0;
    while( i < HISTORY.length-1 && HISTORY[i] != null && HISTORY[i+1] != null ){
        var start = HISTORY[i];
        var goal = HISTORY[i+1];
        var vector = goal - start;
        var line_stack = [];
        if( i > 0 ){
            var pre_line = ( HISTORY[i-1] == null ) ? 'null' :'connectLine';
        }else{
            var pre_line = 'null';
        }

        line_stack.push( HISTORY[i] );
        line_stack.push( HISTORY[i+1] );

        var next_line = 'null';
        for(var j = ++i; j < HISTORY.length-1; j++ ){
            if( HISTORY[j+1] == null ){
                i = j+2;
                next_line = 'null';
                break;
            }
            var next_vector = HISTORY[j+1] - HISTORY[j];
            if( next_vector != vector ){
                if( next_vector == vector*(-1) ){
                    next_line = 'returnLine';
                }else{
                    next_line = 'connectLine';
                }
                break;
            }else{
                line_stack.push( HISTORY[j+1] );
                goal = HISTORY[j+1];
                i = j+1;
            }
        }

        var shift = findEmptyShift( shift_analysis, line_stack, mapVector(vector) );
        for(var id of line_stack){
            saveShiftTotal( shift_analysis, id, mapVector(vector), shift );
        }

        line_history.push({ 
            'start' : start,
            'goal'  : goal,
            'vector': mapVector(vector),
            'shift' : shift,
            'line_index': line_index,
            'pre_line'  : pre_line,
            'next_line' : next_line,
            'array' : line_stack
        });
        line_index++;
        if( next_line == 'returnLine' ){
            var self_stack = [ goal, goal ];
            var shift = findEmptyShift( shift_analysis, self_stack, mapReverseVector(vector) );
            saveShiftTotal( shift_analysis, goal, mapReverseVector(vector), shift );
            line_history.push({
                'start' : goal,
                'goal'  : goal,
                'vector': mapReverseVector(vector),
                'shift' : shift,
                'line_index': line_index,
                'pre_line'  : 'connectLine',
                'next_line' : 'connectLine',
                'array' : self_stack
            });
            line_index++;
        }
    }

    for(var l = 0; l < line_history.length; l++ ){
        var line = line_history[l];
        var start = line['start'];
        var goal = line['goal'];
        var vector = line['vector'];

        var startX = parseInt( line['start']%TD_NUM )*WIDTH +WIDTH/2;
        var startY = parseInt( line['start']/TD_NUM )*HEIGHT+HEIGHT/2;
        var goalX  = parseInt( line['goal']%TD_NUM ) *WIDTH +WIDTH/2;
        var goalY  = parseInt( line['goal']/TD_NUM ) *HEIGHT+HEIGHT/2;

        var start_shift = makeShiftBias(shift_analysis, line, vector);

        if(vector == "STRAIGHT"){
            startX += start_shift;
            goalX  += start_shift;
        }else if(vector == "HORIZONTAL"){
            startY += start_shift;
            goalY  += start_shift;
        }
        
        if( line['pre_line'] != 'null' ){
            var pre_line = line_history[l-1];
            var pre_vector = pre_line['vector'];
            var pre_shift = makeShiftBias(shift_analysis, pre_line, pre_vector);

            if(pre_vector == "STRAIGHT"){
                startX += pre_shift;
            }else if(pre_vector == "HORIZONTAL"){
                startY += pre_shift;
            }
        }

        if( line['next_line'] != 'null' ){
            var next_line = line_history[l+1];
            var next_vector = next_line['vector'];
            var goal_shift = makeShiftBias(shift_analysis, next_line, next_vector);

            if(next_vector == "STRAIGHT"){
                goalX  += goal_shift;
            }else if(next_vector == "HORIZONTAL"){
                goalY  += goal_shift;
            }
        }

        $('#dragCanvas').drawLine({
            strokeStyle: 'black',  fillStyle: 'black',
            strokeWidth: 5,         rounded: true,
            x1: startX,             y1: startY,
            x2: goalX,              y2: goalY
        }).drawLine({
            strokeStyle: 'white',
            strokeWidth: 3,         rounded: true,
            x1: startX,             y1: startY,
            x2: goalX,              y2: goalY
        });
    }

    drawTerminalCircle( shift_analysis, line_history[0], 'start' );
    drawTerminalCircle( shift_analysis, line_history[ line_history.length-1 ], 'goal' );
}
function findEmptyShift( shift_analysis, array, vector ){
    var total_shift = new Set();
    for(var id of array){
        if( id in shift_analysis ){
            if( vector in shift_analysis[ id ] ){
                for(var shift of shift_analysis[ id ][vector] ){
                    if( !(shift in total_shift) ){
                        total_shift.add(shift);
                    }
                }
            }
        }
    }
    var max_shift = 1;
    while( total_shift.has(max_shift) ){
        max_shift++;
    }
    return max_shift;
}
function saveShiftTotal( shift_analysis, id, vector, shift ){
    if( id in shift_analysis ){
        if( vector in shift_analysis[ id ] ){
            shift_analysis[ id ][vector].push(shift);            
            shift_analysis[ id ][vector].sort();
        }else{
            shift_analysis[ id ][vector] = [ shift ];
        }
    }else{
        shift_analysis[ id ] = {};
        shift_analysis[ id ][vector] = [ shift ];
    }
}
function mapVector(vector){
    if( vector == 6 || vector == -6 ){ return 'STRAIGHT'; }
    if( vector == 1 || vector == -1 ){ return 'HORIZONTAL'; }
    if( vector == 7 || vector == -7 ){ return 'NEGATIVE'; }
    if( vector == 5 || vector == -5 ){ return 'POSITIVE'; }
}
function mapReverseVector(vector){
    if( vector == 6 || vector == -6 ){ return 'HORIZONTAL'; }
    if( vector == 1 || vector == -1 ){ return 'STRAIGHT'; }
    if( vector == 7 || vector == -7 ){ return 'POSITIVE'; }
    if( vector == 5 || vector == -5 ){ return 'NEGATIVE'; }
}
function makeShiftBias(shift_analysis, line, vector){
    var max_shift = 0;
    for(var id of line['array']){
        var arr = shift_analysis[id][vector];
        max_shift = Math.max( arr[ arr.length-1 ], max_shift );
    }
    var shift = line['shift'] - ( 1+ (( max_shift - 1 )*0.5) );
    var shift_bias = Math.min( MAX_SHIFT, max_shift*MIN_SHIFT ) / max_shift;
    return shift * shift_bias;
}
function drawTerminalCircle(shift_analysis, line, terminal){    
    var point = line[terminal];
    var vector = line['vector'];
    var pointX = parseInt(point%TD_NUM)*WIDTH +WIDTH/2;
    var pointY = parseInt(point/TD_NUM)*HEIGHT+HEIGHT/2;
    var shift = makeShiftBias(shift_analysis, line, vector);

    if(vector == "STRAIGHT"){
        pointX += shift;
    }else if(vector == "HORIZONTAL"){
        pointY += shift;
    }

    color = (terminal == 'start') ? 'SpringGreen' : 'red';
    $('#dragCanvas').drawArc({
        fillStyle: color,
        strokeStyle: 'black',   strokeWidth: 3,
        x: pointX,              y: pointY,
        radius: 6,
    });
}

//==============================================================
//  replay history
//==============================================================
function replayHistory(){
    var i = 0;
    hafStartMove(i);
}
function hafStartMove(i){
    if( i < HISTORY.length-1 && HISTORY[i] != null && HISTORY[i+1] != null ){
        var id_start = HISTORY[i];
        var id_goal = HISTORY[i+1];
        var imgs_start = $("#dragContainment tr td").eq(id_start).find("img.over");
        var imgs_goal = $("#dragContainment tr td").eq(id_goal).find("img");
        var offset_start = $(imgs_start).offset();
        var offset_goal = $(imgs_goal).offset();
        var top_vector = offset_goal.top - offset_start.top;
        var left_vector = offset_goal.left - offset_start.left;
        $(imgs_start).offset(offset_start).zIndex(5);
        $(imgs_start).animate({top: "+="+top_vector+"px", left: "+="+left_vector+"px"},
                            {duration: REPLAY_SPEED} );

        setTimeout( function(){
            hafGoalMove(i);
        }, REPLAY_SPEED/2);
    }else{
        endReplayHistory();
    }
}
function hafGoalMove(i){
    if( i < HISTORY.length-1 && HISTORY[i] != null && HISTORY[i+1] != null ){
        var id_base = HISTORY[i];
        var id_goal = HISTORY[i+1];
        var imgs_base = $("#dragContainment tr td").eq(id_base).find("img.under");
        var imgs_goal = $("#dragContainment tr td").eq(id_goal).find("img");
        var offset_base = $(imgs_base).offset();
        var offset_goal = $(imgs_goal).offset();
        var top_vector = (offset_base.top - offset_goal.top);
        var left_vector = (offset_base.left - offset_goal.left);

        var imgs = $("#dragContainment tr td").eq(id_base).find("img").remove();
        var imgs2 = $("#dragContainment tr td").eq(id_goal).find("img").remove();
        $("#dragContainment tr td").eq(id_base).append(imgs2);
        $("#dragContainment tr td").eq(id_goal).append(imgs);

        $(imgs_base).offset(offset_goal);
        $(imgs_goal).offset(offset_goal);
        $(imgs_goal).animate({top: "+="+top_vector+"px",left: "+="+left_vector+"px"},
                            {duration: REPLAY_SPEED/3} );

        setTimeout( function(){
            var next = i+1;
            while( next < HISTORY.length-1 && ( HISTORY[next] == null || HISTORY[next+1] == null ) ){
                next++;
            }
            hafStartMove(next);
        }, REPLAY_SPEED/2);
    }
}

//==============================================================
// download & upload
//==============================================================
function download()
{
    var textToWrite = parseDownloadJson();
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = "data";
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        downloadLink.click();
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}
function parseDownloadJson(){
    var json = {
                    "HISTORY": HISTORY,
                    "HISTORY_SHOW": HISTORY_SHOW, 
                    "INITIAL_PANEL": INITIAL_PANEL,
                    "FINAL_PANEL": FINAL_PANEL,
                    "TD_NUM": TD_NUM,
                    "TR_NUM": TR_NUM,
                    "AUTO_REMOVE": AUTO_REMOVE,
                    "HISTORY_RANDOM": HISTORY_RANDOM,
                    "DROPABLE": DROPABLE,
                    "TEAM_COLORS": TEAM_COLORS,
                    "TEAM_LEADER_LEFT": TEAM_LEADER_LEFT,
                    "TEAM_LEADER_RIGHT": TEAM_LEADER_RIGHT,
                    "GROUP_SIZE": GROUP_SIZE,
                    "skillVariables": saveSkillVariable() 
                };
    return JSON.stringify(json);
}

function upload()
{
    var fileToLoad = $("#file")[0].files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        parseUploadJson(textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}
function parseUploadJson(msg){
    try{
        var json = JSON.parse(msg);
        HISTORY = json["HISTORY"];
        HISTORY_SHOW = json["HISTORY_SHOW"];
        INITIAL_PANEL = json["INITIAL_PANEL"];
        FINAL_PANEL = json["FINAL_PANEL"];
        TD_NUM = json["TD_NUM"];
        TR_NUM = json["TR_NUM"];
        HISTORY_RANDOM = json["HISTORY_RANDOM"];
        AUTO_REMOVE = json["AUTO_REMOVE"];
        DROPABLE = json["DROPABLE"];
        TEAM_COLORS = json["TEAM_COLORS"];
        TEAM_LEADER_LEFT = json["TEAM_LEADER_LEFT"];
        TEAM_LEADER_RIGHT = json["TEAM_LEADER_RIGHT"];
        GROUP_SIZE = json["GROUP_SIZE"];

        $("#dragContainment").attr("td", TD_NUM).attr("tr", TR_NUM);
        COLOR_RANDOM = HISTORY_RANDOM;
        if( DROPABLE ){
            $("#dropable").text("隨機落珠");
        }
        if( !AUTO_REMOVE ){
            $("#autoRemove").text("保持待機");
        }
        loadSkillVariable(json["skillVariables"]);

        if( INITIAL_PANEL.length > 0 ){
            initialTable();
            resetBase();
            backInitColor();
            nextMoveWave();
            setHistoryShow();
        }
    }catch(e){
        alert("檔案讀取失敗！！\n"+e);
        newRandomPlain();
    }
}