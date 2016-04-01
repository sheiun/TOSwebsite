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
//==============================================================
// Base Skill
//==============================================================
//==============================================================
var None = function(){}
var NoneSetting = function(){ return {}; }
var NoneMapping = function(){
    return 0;
}


//==============================================================
// utility function
//==============================================================
function randomBySeed(){    
    var rand = Math.sin(COLOR_RANDOM++) * 10000;
    return rand - Math.floor(rand);
}
function randomBySepcialSeed(seed){
    var rand = Math.sin(seed) * 10000;
    return rand - Math.floor(rand);
}
function selectRandomItemFromArrBySeed( array, seed = 'COLOR_RANDOM' ){
    var rand = ( seed == 'COLOR_RANDOM' ) ? randomBySeed() : randomBySepcialSeed( seed );
    return array[ Math.floor( rand * array.length ) ];
}
function selectAndRemoveRandomItemFromArrBySeed( array, seed = 'COLOR_RANDOM' ){
    var rand = ( seed == 'COLOR_RANDOM' ) ? randomBySeed() : randomBySepcialSeed( seed );
    var rand_i = Math.floor( rand * array.length );
    var id = array[rand_i];
    array.splice(rand_i, 1);
    return id;
}

function getArrayOfObjectValue(Obj){
    return $.map(Obj, function(value, index) { return [value]; });
}

//==============================================================
// Panel Element function
//==============================================================
function checkHasElementByColorWithoutStrong(color){
    var color_stack = getStackOfPanelByColorWithoutStrong(color);
    return color_stack.length > 0;
}
function checkHasElementByColor(color){
    var color_stack = getStackOfPanelByColor(color);
    return color_stack.length > 0;
}
function checkHasElementByColorArr(colorArr){
    var color_stack = getStackOfPanelByColorArr(colorArr);
    return color_stack.length > 0;
}
function getStackOfPanelByColorWithoutStrong(color){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        var strong = parseInt( $("#dragContainment tr td").eq(i).find("img.over").attr("strong") );
        if( c == color && !(strong > 0) ){
            stack.push(i);
        }
    }
    return stack;
}
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
function turnRandomElementToColorByConfig( config ){
    // config: color, num, priorityColors
    var color = config['color'];
    for( var num = config['num']; num > 0; num-- ){
        for( var colors of config['priorityColors'] ){
            var stack = getStackOfPanelByColorArr( colors );
            if( stack.length > 0 ){
                var id = selectAndRemoveRandomItemFromArrBySeed( stack );
                turnElementToColorByID(id, color);
                break;
            }
        }
    }
}
function turnElementToStrongByID(id){
    var imgs = $("#dragContainment tr td").eq(id).find("img");
    var item = imgs.attr("item");
    item = item + "+";
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

function findMaxColorOfColorArr( colorArr ){
    var colors = {};
    var max = 0;
    var tmp_colors = [];
    for( var i = 0; i < TD_NUM*TR_NUM; i++ ){
        var c = $("#dragContainment tr td img.over ").eq(i).attr("color");
        if( colorArr.indexOf(c) >= 0 ){
            colors[c] = ( c in colors ) ? colors[c]+1 : 0;
        }
    }
    for(var c in colors){
        if( colors[c] > max ){
            max = colors[c];
            tmp_colors = [ c ];
        }else if( colors[c] == max && max > 0 ){
            tmp_colors.push(c);
        }
    }
    return { colors: tmp_colors, num: max };
}

//==============================================================
// check Team members 
//==============================================================
function checkMembersColorByConfig( config ){
    var countColor = {};
    var check = true;
    for(var c of config['colors'] ){
        countColor[c] = 0;
    }
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['color'] in countColor ){
            countColor[ member['color'] ] += 1;
        }else if( member['id'] == 'EMPTY' ){
        }else if( 'OTHER' in countColor ){
            countColor[ 'OTHER' ] += 1;
        }
    });
    var countArr = getArrayOfObjectValue(countColor);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkMembersTypeByConfig( config ){
    var countType = {};
    var check = true;
    for(var type of config['types']){
        countType[type] = 0;
    }
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['type'] in countType ){
            countType[ member['type'] ] += 1;
        }else if( member['id'] == 'EMPTY' ){
        }else if( 'OTHER' in countType ){
            countType[ 'OTHER' ] += 1;
        }
    });
    var countArr = getArrayOfObjectValue(countType);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkMembersIDByConfig( config ){
    var countId = {};
    var check = true;
    for(var id of config['ID']){
        countId[id] = 0;
    }
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['id'] in countId ){
            countId[ member['id'] ] += 1;
        }else if( member['id'] == 'EMPTY' ){
        }else if( 'OTHER' in countId ){
            countId[ 'OTHER' ] += 1;
        }
    });
    var countArr = getArrayOfObjectValue(countId);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}
function checkActiveSkillIDByConfig( config ){
    var countId = {};
    var check = true;
    for(var id of config['ID']){
        countId[id] = 0;
    }

    $.each(TEAM_ACTIVE_SKILL, function(place, actives){
        $.each(actives, function(i, active){
            if( active['id'] in countId ){
                countId[ active['id'] ] += 1;
            }else if( active['id'] == 'EMPTY' ){
            }else if( 'OTHER' in countId ){
                countId[ 'OTHER' ] += 1;
            }
        });
    });
    var countArr = getArrayOfObjectValue(countId);
    for(var eq of config['check'] ){
        eq = eq.formatByArray( countArr );
        if( ! eval(eq) ){
            check = false;
        }
    }
    return check;
}

//==============================================================
// color belongs function
//==============================================================
function addColorBelongsByConfig( config ){
    for( var c in config ){
        for( var belong_color in config[c] ){
            if( c in COUNT_BELONG_COLOR && belong_color in COUNT_BELONG_COLOR[c] ){
                COUNT_BELONG_COLOR[c][belong_color] += config[c][belong_color];
            }
        }
    }
}
function setColorBelongsByConfig( config ){
    for( var c in config ){
        for( var belong_color in config[c] ){
            if( c in COUNT_BELONG_COLOR && belong_color in COUNT_BELONG_COLOR[c] ){
                COUNT_BELONG_COLOR[c][belong_color] = config[c][belong_color];
            }
        }
    }
}

//==============================================================
// count First Straight/Horizental function
//==============================================================
function countFirstStraightNum( length ){
    var straight = 0;
    for(var i = 0; i < TD_NUM; i++ ){
        if( checkFirstStraightByPlace( length, i ) ){
            straight += 1;
        }
    }
    return straight;
}
function checkFirstStraightByPlace( length, place ){
    for( var set of ALL_GROUP_SET_STACK[0]['STRAIGHT_SETS'][place] ){
        if( set.size >= length ){
            return true;
        }
    }
    return false;
}
function checkFirstHorizentalClearByPlace( place ){
    var base_line = [];
    for(var i = TD_NUM*( place ); i < TD_NUM*( place+1 ); i++){
        base_line.push( i );
    }
    for(var obj of COMBO_STACK){
        if( obj['drop_wave'] == 0 ){
            for(var i of obj['set']){
                if( base_line.indexOf(i) >= 0 ){
                    base_line.splice( base_line.indexOf(i), 1 );
                }
            }
        }
    }
    return base_line.length == 0;
}

//==============================================================
// StartRun function
//==============================================================
function setStartRunByPlayTypeAndTime( play_type, time ){
    setTimeLimit( time );
    setPlayType( play_type );

    START_TIME = new Date().getTime() / 1000;
    TIME_RUNNING = true;
    TIME_INTERVAL = setInterval( function(){ dragTimer(); }, 10);
    MAIN_STATE = MAIN_STATE_ENUM.TIME_TO_MOVE;    
}