//==============================================================
// Skill Variable
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