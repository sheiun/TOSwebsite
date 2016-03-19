//==============================================================
// Team Variable
//==============================================================
var COUPLE_RAND_STACK = [];

function saveSkillVariable(){
    var json = 
    [
        TEAM_LEADER_SKILL_VAR,
        TEAM_FRIEND_SKILL_VAR,
        TEAM_SKILL_VAR,
    ];
    return JSON.stringify(json);
}
function loadSkillVariable(msg){
    var json = JSON.parse(msg);
    TEAM_LEADER_SKILL_VAR   = json[0];
    TEAM_FRIEND_SKILL_VAR   = json[1];
    TEAM_SKILL_VAR          = json[2];
}

//==============================================================
// BrokeBoundary
//==============================================================
var startBrokeBoundary = function(){
    $('#timeRange').val(10);
    $("#timeLimit").text("限制時間");
    $("#freeDrag").text("一般移動");
    $("#randomPanel").closest("button").prop("disabled", true);
    $("#optionalPanel").closest("button").prop("disabled", true);
    $("#initial").closest("button").prop("disabled", true);
    $("#final").closest("button").prop("disabled", true);
    $("#replay").closest("button").prop("disabled", true);

    MOVE_OUT_OF_TIME = false;
    TIME_LIMIT = 10;
    TIME_IS_LIMIT = true;
    START_TIME = new Date().getTime() / 1000;
    TIME_RUNNING = true;
    TIME_INTERVAL = setInterval( function(){ dragTimer(); }, 10);
    MAIN_STATE = "count";


    $("#dragContainment").attr("td", 6).attr("tr", 8);
    resetHistory();
    resetDropStack();
    resetComboStack();
    resetColors();
    resetBase();
    initialTable();

    for(var i = 3; i < TR_NUM; i++){
        for(var j = 0; j < TD_NUM; j++){
            id = (i-3)*TD_NUM+j;
            if( id < INITIAL_PANEL.length && INITIAL_PANEL[id] ){
                var item = INITIAL_PANEL[id];
                if( item ){
                    $("#dragContainment tr td").eq(i*TD_NUM+j).append( newElementByItem(item) );
                }
            }
        }
    }
    for(var i = 0; i < TD_NUM; i++){
        var num = 0;
        for(var j = TR_NUM-1; j >= 0; j--){
            if( $("#dragContainment tr td").eq(j*TD_NUM+i).children().length == 0 ){
                DROP_STACK[i].push( newElementByID(i) );
                num++;
            }else{
                if( num > 0 ){
                    var imgs = $("#dragContainment tr td").eq(j*TD_NUM+i).find("img").remove();
                    $(imgs).attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP+j*HEIGHT);
                    $("#dragContainment tr td").eq((j+num)*TD_NUM+i).append(imgs);
                }
            }
        }
        var length = DROP_STACK[i].length;
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
            max_drop = $(this).attr("drop") > max_drop ? $(this).attr("drop") : max_drop;
            $(this).offset({top: $(this).attr("toTop"), left: $(this).attr("toLeft")});
            $(this).animate({"top": "+="+parseInt($(this).attr("drop"))*HEIGHT+"px" },
                            {duration: parseInt($(this).attr("drop"))*DROP_TIME});
            $(this).removeAttr("drop").removeAttr("toTop").removeAttr("toLeft");
        }
    });
    setTimeout( function(){
        resetDraggable();
        startDragging();
    }, max_drop*DROP_TIME );

    window.scrollTo(0, $("#clock").offset().top);
}

var endBrokeBoundary = function(){ 
    $('#timeRange').val(5);
    $("#randomPanel").closest("button").prop("disabled", false);
    $("#optionalPanel").closest("button").prop("disabled", false);
    $("#initial").closest("button").prop("disabled", false);
    $("#final").closest("button").prop("disabled", false);
    $("#replay").closest("button").prop("disabled", false);
    $("#dragContainment").attr("td", 6).attr("tr", 5);
    $('#clipboard').attr("data-clipboard-text", "null");
    TIME_LIMIT = 5;
    resetHistory();
    resetBase();
    initialTable();

    for(var i = 0; i < TR_NUM; i++){
        for(var j = 0; j < TD_NUM; j++){
            id = (i+3)*TD_NUM+j;
            if( id < INITIAL_PANEL.length && INITIAL_PANEL[id] ){
                var item = INITIAL_PANEL[id];
                if( item ){
                    $("#dragContainment tr td").eq(i*TD_NUM+j).append( newElementByItem(item) );
                }
            }
        }
    }
    window.scrollTo(0, $("#clock").offset().top-3*HEIGHT);
    checkAttack();
}

//==============================================================
// Base Skill
//==============================================================
var none = function(){}
var noneSetting = function(){ return {}; }

function getStackOfPanelByColor(color){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        if( c == color ){
            stack.push(i);
        }
    }
    return stack;
}
function getStackOfPanelByColorArr(colorArr){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        if( colorArr.indexOf(c) >= 0 ){
            stack.push(i);
        }
    }
    return stack;
}

function turnElementToColorByID(id, color){
    var imgs = $("#dragContainment tr td").eq(id).find("img");
    imgs.attr('color', color);
    var item = imgs.attr("item");
    item = color + item.substr(1);
    var hide_items = newElementByItem(item);

    $(hide_items[0]).hide();
    $(hide_items[1]).hide();
    $("#dragContainment tr td").eq(id).find("img").fadeOut( FADEOUT_TIME, function(){
        $(this).remove();
        $("#dragContainment tr td").eq(id).append( hide_items );
        $("#dragContainment tr td").eq(id).find("img").fadeIn( FADEOUT_TIME );
        resetDraggable();
        startDragging();
    });
}

// 隊伍屬性包含全部 > colorArr
function checkMembersColorHasColorArr( colorArr ){
    $.each(TEAM_MEMBERS, function(i, member){
        if( colorArr.indexOf( member['color'] ) >= 0 ){
            colorArr.splice( colorArr.indexOf( member['color'] ), 1 );
        }
    });
    return colorArr.length == 0;

}
// 隊伍屬性包含只在 < colorArr
function checkMembersColorInColorArr( colorArr ){
    var check = true;
    $.each(TEAM_MEMBERS, function(i, member){
        if( colorArr.indexOf( member['color'] ) < 0 ){
            check = false;
        }
    });
    return check;
}
// 隊伍屬性相當 == colorArr
function checkMembersColorOnlyInColorArr( colorArr ){
    return checkMembersColorInColorArr( colorArr ) && checkMembersColorHasColorArr( colorArr );
}