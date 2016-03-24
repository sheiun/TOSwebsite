
var BasicSetting = function( member ){
    return {
        COLOR    : member['color'],
        TYPE     : member['type'],
        COOLDOWN : this.coolDown,
    }
}

//==============================================================
// BrokeBoundary
//==============================================================
var BreakBoundarySetting = function(){

}
var BrokeBoundaryStart = function(){
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

var BrokeBoundaryEnd = function(){ 
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
}

var OverBeautyStart = function(){

}

//==============================================================
// Transfer function
//==============================================================
var RuneStrengthenCheck= function(){

}
var RuneStrengthenTransfer = function(){

}

//==============================================================
// Attack Effect function
//==============================================================
var AddtionalEffectCheck = function(){

}
var DesperateAttackEffect = function(){

}

//==============================================================
// Member Switch function
//==============================================================
var TeamMemberSwitchCheck = function(){

}
var TraceOfNotionSetting = function(){

}
var TraceOfNotionUpdate = function(){

}
var TraceOfNotionSwitch = function(){

}

//==============================================================
//==============================================================
// Skill Database
//==============================================================
//==============================================================

var ACTIVE_SKILLS = {
	NONE : {
		id        : 'NONE',
		label     : '無技能',
		info      : '',
        letter    : [0,0],
        coolDown  : 0,
        preSet    : BasicSetting,
	},
    BREAK_BOUNDARY : {
        id        : 'BREAK_BOUNDARY',
        label     : '界線突破 ‧ {0}',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升{0}屬性攻擊力',
        letter    : [0,0],
        coolDown  : 8,
        preSet    : BreakBoundarySetting,
        endCount  : BrokeBoundaryEnd,
        startRun  : BrokeBoundaryStart,
    },
    RUNE_STRENGTHEN : {
        id        : 'RUNE_STRENGTHEN',
        label     : '符石強化 ‧ {0}',
        info      : '{0}符石轉化為{0}強化符石',
        letter    : [0,0],
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        preSet    : BasicSetting,
        transfer  : RuneStrengthenTransfer,
    },
    DESPERATE_ATTACK : {
        id        : 'DESPERATE_ATTACK',
        label     : '拚死一擊',
        info      : '1 回合內，自身生命力愈低，全隊攻擊力愈高，最大 3 倍',
        letter    : [0,0],
        coolDown  : 10,
        check     : AddtionalEffectCheck,
        preSet    : BasicSetting,
        addEffect : DesperateAttackEffect,
    },
    OVER_BEAUTY   : {
        id        : 'OVER_BEAUTY',
        label     : '回眸傾城',
        info      : '',
        letter    : [0,0],
        coolDown  : 8,
        preSet    : BasicSetting,
        startRun  : OverBeautyStart,
    },
    TRACE_OF_NOTION : {
        id        : 'TRACE_OF_NOTION',
        label     : '印記之念 ‧ {0}',
        info      : '{0}屬性傷害持續提升，直至沒有消除一組 5 粒或以上的{0}屬性符石 (只計算首批消除的符石)。每累計消除 20 粒{0}符石，{0}屬性傷害加快提升。{0}屬性傷害會於每一層數 (Wave) 重置',
        letter    : [0,0],
        check     : TeamMemberSwitchCheck,
        preSet    : TraceOfNotionSetting,
        update    : TraceOfNotionUpdate,
        addSwitch : TraceOfNotionSwitch,
    }
};
