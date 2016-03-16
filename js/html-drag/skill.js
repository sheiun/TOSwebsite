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
// ElementFactor
//==============================================================
var ElementFactor3Setting = function( MEMBER ){
    return {
        'COLOR' : MEMBER['color'],
    };
}
var ElementFactor3Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor3'+direct] = {
        factor    : function( member ){ return 3; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}
var ElementFactor3_5Setting = function( MEMBER ){
    return {
        'COLOR' : MEMBER['color'],
    };
}
var ElementFactor3_5Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor3'+direct] = {
        factor    : function( member ){ return 3.5; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}

var TeamNordicAttack = function( VAR, direct ){
    COUNT_STRONG_COEFF += 0.15;
}
var TeamNordicSetting = function( MEMBER ){
    var color = MEMBER['color'];
    for(var i = 0; i < TD_NUM; i++){
        COLOR_PROB[i][ color ] = 0.25;
    }
}

//==============================================================
// ChinaGod
//==============================================================
var ChinaDAttack = function( VAR, direct ){
    COUNT_COMBO_COEFF += 1.25;
}

//==============================================================
// Babylon
//==============================================================
var BabylonSetting = function( MEMBER ){
    return {
        'COLOR' : MEMBER['color'],
    };
}
var BabylonSkill = function( VAR ){
    var color = VAR['COLOR'];
    for(var i = 0; i < TD_NUM; i++){
        var trigger = false;
        for(var set of STRAIGHT_SETS[i]){
            if( set.size >= 4 ){
                trigger = true;
                break;
            }
        }
        if( trigger && DROP_WAVES == 0 ){
            for(var id = (TR_NUM-1)*TD_NUM+i; id >= 0; id -= TD_NUM ){
                if( REMOVE_STACK.indexOf(id) >= 0 ){
                    REMOVE_STACK.splice( REMOVE_STACK.indexOf(id), 1 );
                    DROP_STACK[i].push( newElementByItem( color ) );
                    break;
                }
            }
        }
    };
}
var BabylonAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['Babylon'+direct] = {
        factor    : function( member ){ return 3; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == color ){
                return true;
            }
            return false;
        },
    };
}
var TeamBabylonAttack = function( VAR, direct ){
    COUNT_FACTOR['TeamBabylon'] = {
        factor    : function( member ){
            var straight = 0;
            for(var i = 0; i < TD_NUM; i++ ){
                for( var set of ALL_GROUP_SET_STACK[0]['STRAIGHT_SETS'][i] ){
                    if( set.size >= 4 ){
                        straight += 1;
                        break;
                    }
                }
            }
            if( straight < 2 ){ return 1; }
            else{
                return Math.min( 1+((straight-1)*0.1), 1.5 );
            }            
        },
        prob      : 1,
        condition : function( member ){ return true; },
    };
}

//==============================================================
// DarkLucifer
//==============================================================
var DarkLuciferSetting = function( MEMBER ){
    return {
        'COLOR' : 'h',
    };
}
var DarkLuciferAttack = function( VAR, direct ){
    COUNT_FACTOR['DarkLucifer'+direct] = {
        factor    : function( member ){ return 2.5; },
        prob      : 1,
        condition : function( member ){ return true; },
    };
}
var TeamDarkLuciferAttack = function( VAR, direct ){
    if( TEAM_LEADER["type"] == "SPIRIT" && 
        MEMBER_1["type"] == "SPIRIT" && 
        MEMBER_1["type"] == "SPIRIT" && 
        MEMBER_1["type"] == "SPIRIT" && 
        MEMBER_1["type"] == "SPIRIT" && 
        TEAM_FRIEND["type"] == "SPIRIT" ){

        COUNT_BELONG_COLOR['h']['w'] = 1;
        COUNT_BELONG_COLOR['h']['f'] = 1;
        COUNT_BELONG_COLOR['h']['p'] = 1;
        COUNT_BELONG_COLOR['h']['l'] = 1;
        COUNT_BELONG_COLOR['h']['d'] = 1;

        COUNT_FACTOR['TeamDarkLucifer'] = {
            factor    : function( member ){
                var straight = 0;
                for(var i = 0; i < TD_NUM; i++ ){
                    for( var set of ALL_GROUP_SET_STACK[0]['STRAIGHT_SETS'][i] ){
                        if( set.size >= 4 ){
                            straight += 1;
                            break;
                        }
                    }
                }
                if( straight < 2 ){ return 1; }
                else{
                    return Math.min( 1+((straight-1)*0.1), 1.5 );
                }            
            },
            prob      : 1,
            condition : function( member ){ return true; },
        };
    }
}

//==============================================================
// Greek
//==============================================================
var GreekSetting = function( MEMBER ){
    return {
        'COLOR' : MEMBER['color'],
        'COUNT' : 0,
    };
}
var GreekSkill = function( VAR ){
    var color = VAR['COLOR'];
    var check_straight = 0;
    var check_horizontal = 0;
    for(var i = 0; i < TD_NUM; i++ ){ check_straight += STRAIGHT_SETS[i].length; }
    for(var i = 0; i < TR_NUM; i++ ){ check_horizontal += HORIZONTAL_SETS[i].length; }

    var num = 0;
    num += VAR['COUNT'];
    for(var set of GROUP_SETS[color]){
        num += set.size;
    }

    while( num >= 3 ){
        num -= 3;
        var rand_i;
        if( COMBO_TIMES == 1 && check_straight == 1 ||
            COMBO_TIMES == 1 && check_horizontal == 1 ){
            console.log(REMOVE_STACK);
            rand_i = Math.floor( randomBySeed() * ( REMOVE_STACK.length-1 ) );
        }else{
            rand_i = Math.floor( randomBySeed() *REMOVE_STACK.length );
        }
        var id = REMOVE_STACK[rand_i];
        REMOVE_STACK.splice(rand_i,1);
        STRONG_STACK[id] = color+'+';
    }

    VAR['COUNT'] = num;
}

var TeamGreekSetting = function( LEADER, FRIEND ){
    return {
        'COLOR' : LEADER['color'],
        'COUNT' : {'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0},
        'EXTRA_COMBO': 0
    };
}
var TeamGreekExtraComboReset = function( VAR ){
    VAR['EXTRA_COMBO'] = 0;
    VAR['COUNT'] = 0;
    setExtraComboShow( VAR['EXTRA_COMBO'] );
}
var TeamGreekExtraCombo = function( VAR ){    
    if( randomBySeed() < 0.7 ){
        VAR['EXTRA_COMBO'] += 1;
        setExtraComboShow( VAR['EXTRA_COMBO'] );
    }
}
var TeamGreekSkill = function( VAR ){
    var color = VAR['COLOR'];
    var comboTimes = VAR['COUNT'];
    for(var key in GROUP_SETS){
        comboTimes += GROUP_SETS[key].length;
    }
    while( comboTimes >= 5 ){
        comboTimes -= 5;
        for(var num = 0; num < REMOVE_STACK.length && num < 2; num ++){
            var rand_i = Math.floor( randomBySeed() * REMOVE_STACK.length );
            var id = REMOVE_STACK[rand_i];
            REMOVE_STACK.splice(rand_i,1);
            STRONG_STACK[id] = color;
        }
    }
    VAR['COUNT'] = comboTimes;
}
var TeamGreekAttack = function( VAR, direct ){
    COUNT_COMBO += VAR['EXTRA_COMBO'];
}

var HeartQueenSetting = function( MEMBER ){
    return {
        'COLOR' : 'h',
        'COUNT' : 0,
    };
}

//==============================================================
// Couple
//==============================================================
var CoupleSetting = function( MEMBER ){
    TEAM_COLORS_CHANGEABLE = false;
    GROUP_SIZE[ MEMBER['color'] ] = 2;
    GROUP_SIZE['h'] = 2;
    return {
        'COLOR' : MEMBER['color'],
        'COUNT' : 0,
    };
}
var CoupleEndSkill = function( VAR ){
    var color = VAR['COLOR'];
    var ld_stack = getStackOfPanelByColorArr(['l', 'd']);
    var wh_stack = getStackOfPanelByColorArr(['w', 'h']);
    var fp_stack = getStackOfPanelByColorArr(['f', 'p']);

    for( var num = 2; num > 0; num-- ){
        for( var colors of [ ['l', 'd'], ['w', 'h'], ['f', 'p'] ] ){
            var stack = getStackOfPanelByColorArr( colors );
            if( stack.length > 0 ){
                var rand_i = Math.floor( randomBySeed() * stack.length );
                var id = stack[rand_i];
                stack.splice(rand_i,1);
                turnElementToColorByID(id, color);
                break;
            }
        }
    }
}
var TeamCoupleAttackFF = function( VAR, direct ){
    COUNT_FACTOR['COUPLE_FF'] = {
        factor    : function( member ){ return 6; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == 'f' ){ return true; }
            return false;
        },
    };
}
var TeamCoupleAttackPP = function( VAR, direct ){
    COUNT_FACTOR['COUPLE_PP'] = {
        factor    : function( member ){ return 6; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == 'p' ){ return true; }
            return false;
        },
    };
}
var TeamCoupleAttackFP = function( VAR, direct ){
    COUNT_BELONG_COLOR['f']['p'] = 1;
    COUNT_BELONG_COLOR['p']['f'] = 1;
    COUNT_FACTOR['COUPLE_FP'] = {
        factor    : function( member ){ return 3; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == 'f' ||  member['color'] == 'p' ){ return true; }
            return false;
        },
    };
}

var SwordBrotherAttack = function( VAR, direct ){
    COUNT_BELONG_COLOR['l']['d'] += 0.5;
    COUNT_BELONG_COLOR['d']['l'] += 0.5;
    COUNT_FACTOR['SwordBrother'+direct] = {
        factor    : function( member ){ return 2.5; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == 'l' ||  member['color'] == 'd' ){ 
                return true;
            }
            return false;
        },
    };
    COUNT_FACTOR['SwordBrotherBoth'+direct] = {
        factor    : function( member ){ return 1.5; },
        prob      : 1,
        condition : function( member ){
            if( COUNT_AMOUNT['l'] > 0 && COUNT_AMOUNT['d'] > 0 ){
                return true;
            }
            return false;
        },
    };
}

var DevilCircleSetting = function( MEMBER ){
    TIME_LIMIT += 1;
    $('#timeRange').val( TIME_LIMIT );
    return {
        'COLOR' : MEMBER['color']
    };
}
var DevilCircleAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['DevilCircle'+direct] = {
        factor    : function( member ){ return 3; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    COUNT_FACTOR['DevilCircle5Set'+direct] = {
        factor    : function( member ){ return 1.5; },
        prob      : 1,
        condition : function( member ){
            for(var obj of COMBO_STACK){
                if( obj['color'] == color && obj['amount'] >= 5 ){
                    return true;
                }
            }
            return false;
        },
    };
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
    TIME_LIMIT = 10;
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
console.log(0);
    //checkAttack();
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

//==============================================================
//==============================================================
// WAKE SKILL
//==============================================================
//==============================================================
var HealthAttackRecoveryIncrease = function( MEMBER, place, wakeVar ){
    // wakeVar = "[+health,+attack,+recovery]"
    MEMBER['health']   += eval(wakeVar)[0];
    MEMBER['attack']   += eval(wakeVar)[1];
    MEMBER['recovery'] += eval(wakeVar)[2];
}

var DropIncrease = function( MEMBER, place, wakeVar ){
    // wakeVar = color
    var color = wakeVar;
    if( COLORS.indexOf(color) >= 0 ){
        COLOR_PROB[ place ][ color ] = 0.4;
    }
}

var StraightAttack = function( wakeVar, place, i ){
    // wakeVar = "[factor,straightSize]"
    COUNT_FACTOR['StraightAttack_'+place+'_'+i] = {
        factor    : function( member ){
            return  eval(wakeVar)[0];
        },
        prob      : 1,
        condition : function( member ){
            for( var set of ALL_GROUP_SET_STACK[0]['STRAIGHT_SETS'][place] ){
                if( set.size >= eval(wakeVar)[1] ){
                    return true;
                }
            }
            return false;
        },
    };    
}

var StraightRecover = function( wakeVar, place, i ){
    // wakeVar = "[factor,straightSize]"
    COUNT_RECOVER_FACTOR['StraightRecover_'+place+'_'+i] = {
        factor    : function( member ){
            return  eval(wakeVar)[0];
        },
        prob      : 1,
        condition : function( member ){
            for( var set of ALL_GROUP_SET_STACK[0]['STRAIGHT_SETS'][place] ){
                if( set.size >= eval(wakeVar)[1] ){
                    return true;
                }
            }
            return false;
        },
    };    
}