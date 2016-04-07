//==============================================================
//==============================================================
// Active Skill Function
//==============================================================
//==============================================================

var BasicActiveSetting = function( member, place, i ){
    return {
        COLOR    : member['color'],
        TYPE     : member['type'],
        COOLDOWN : this.coolDown,
        PLACE    : place,
        i        : i,
    };
}

var BasicActiveCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i );
}
function basicActiveCheck( VAR, place, i ){
    if( MAIN_STATE == MAIN_STATE_ENUM.READY && VAR['COOLDOWN'] == 0 ){
        return true;
    }
    return false;
}

//==============================================================
// BrokeBoundary / Start Run Function
//==============================================================
var StartRunSetting = function( member, place, i ){
    return {
        COLOR     : member['color'],
        TYPE      : member['type'],
        COOLDOWN  : this.coolDown,
        PLACE    : place,
        i        : i,
        USING     : false,
    }
}
var BrokeBoundaryStart = function( place, i ){
    VAR = this.variable;
    VAR['COOLDOWN'] = this.coolDown;
    VAR['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };

    disbalePanelControl( true );
    setStartRunByPlayTypeAndTime( PLAY_TYPE_ENUM.DRAG, 10 );

    $("#dragContainment").attr("td", 6).attr("tr", 8);
    resetHistory();
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
    window.scrollTo(0, $("#clock").offset().top);

    setTimeout( function(){
        resetDraggable();
        startDragging();
    }, max_drop*DROP_TIME );
}
var BrokeBoundaryEnd = function( place, i ){
    VAR = this.variable;
    if( !VAR['USING'] ){ return false; }
    VAR['USING'] = false;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];

    disbalePanelControl( false );
    setTimeLimit( 5 );

    $('#clipboard').attr("data-clipboard-text", "null");
    $("#dragContainment").attr("td", 6).attr("tr", 5);
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

var OverBeautyStart = function( place, i ){
    VAR = this.variable;
    VAR['COOLDOWN'] = this.coolDown;
    VAR['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };

    disbalePanelControl( true );
    setStartRunByPlayTypeAndTime( PLAY_TYPE_ENUM.FREE, 10 );
    resetHistory();
    resetBase();
}
var OverBeautyEnd = function( place, i ){
    VAR = this.variable;
    if( !VAR['USING'] ){ return false; }
    VAR['USING'] = false;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];

    disbalePanelControl( false );
    setTimeLimit( 5 );
    setPlayType( PLAY_TYPE_ENUM.DRAG );
}

//==============================================================
// Transfer function
//==============================================================
var RuneStrengthenCheck= function( place, i ){
    VAR = this.variable;
    if( basicActiveCheck( VAR, place, i ) &&
        checkHasElementByColorWithoutStrong( VAR['COLOR'] ) ){
        return true;
    }
    return false;
}
var RuneStrengthenTransfer = function( place, i ){
    VAR = this.variable;
    VAR['COOLDOWN'] = this.coolDown;
    var stack = getStackOfPanelByColor( VAR['COLOR'] );
    for(var id of stack){
        turnElementToStrongByID(id);
    }
}

//==============================================================
// Attack Effect function
//==============================================================
var AddtionalEffectCheck = function( place, i ){
    var checkEffect = true;
    $.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
        if( effect['id'] == this.id ){
            checkEffect = false;
            return false;
        }
    });
    return basicActiveCheck( this.variable, place, i ) && checkEffect;
}
var DesperateAttackEffect = function( place, i ){
    VAR = this.variable;
    VAR['COOLDOWN'] = this.coolDown;
    var effect = NewAdditionalEffect( this.id );
    effect['variable'] = effect['preSet']( place, i, VAR );

    additionalEffectAdd( effect );
}

//==============================================================
// Member Switch function
//==============================================================
var TeamMemberSwitchCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) && !( this.id in USING_ACTIVE_SKILL_STACK );
}

var TraceOfNotionSetting = function( member, place, i ){
    return {
        COLOR    : member['color'],
        TYPE     : member['type'],
        COOLDOWN : this.coolDown,
        PLACE    : place,
        i        : i,
        USING    : false,
        COUNT    : 0,
        FACTOR   : 1.2,
    }
}
var TraceOfNotionStart = function( place, i ){
    VAR = this.variable;
    VAR['COOLDOWN'] = this.coolDown;
    VAR['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };
    $("#ActiveButtonTD td").eq(place).find("button span").eq(i).text(this.label).append("<br>(使用中)");
}
var TraceOfNotionUpdate = function( place, i ){
    VAR = this.variable;
    if( !VAR['USING'] ){ return false; }
    if( checkComboColorFirstMaxAmountByConfig({
            ID    : [ VAR['COLOR'] ],
            check : [ '{0}<5' ],
        }) ){
        VAR['USING'] = false;
        VAR['COUNT'] = 0;
        VAR['FACTOR'] = 1.2;
        delete USING_ACTIVE_SKILL_STACK[ this.id ];
        $("#ActiveButtonTD td").eq(place).find("button span").eq(i).text(this.label);
    }
}
var TraceOfNotionAttack = function( place, i ){
    VAR = this.variable;
    if( !VAR['USING'] ){ return false; }

    var max = 0;
    var num = 0;
    for(var combo of COMBO_STACK){
        if(combo['color'] == VAR['COLOR']){
            max = Math.max( max, combo['amount'] );
            num += combo['amount'];
        }
    }
    if( num > 0 ){
        num += VAR['COUNT'];
        VAR['FACTOR'] = Math.min( 2.2, VAR['FACTOR']+0.2+( Math.floor(num/20) )*0.2 );
        VAR['COUNT'] = num%20
    }

    COUNT_COLOR_FACTOR[ VAR['COLOR'] ] *= VAR['FACTOR'];
}

//==============================================================
//==============================================================
// Active Skill Database
//==============================================================
//==============================================================

var ACTIVE_SKILLS_DATA = {
	NONE : {
		id        : 'NONE',
		label     : '無技能',
		info      : '',
        coolDown  : 0,
        check     : BasicActiveCheck,
        preSet    : BasicActiveSetting,
	},
    BREAK_BOUNDARY_W : {
        id        : 'BREAK_BOUNDARY_W',
        label     : '界線突破 ‧ 水',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升水屬性攻擊力',
        coolDown  : 8,
        check     : BasicActiveCheck,
        endRun    : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_F : {
        id        : 'BREAK_BOUNDARY_F',
        label     : '界線突破 ‧ 火',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升火屬性攻擊力',
        coolDown  : 8,
        check     : BasicActiveCheck,
        endRun    : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_P : {
        id        : 'BREAK_BOUNDARY_P',
        label     : '界線突破 ‧ 木',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升木屬性攻擊力',
        coolDown  : 8,
        check     : BasicActiveCheck,
        endRun    : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_L : {
        id        : 'BREAK_BOUNDARY_L',
        label     : '界線突破 ‧ 光',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升光屬性攻擊力',
        coolDown  : 8,
        check     : BasicActiveCheck,
        endRun    : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_D : {
        id        : 'BREAK_BOUNDARY_D',
        label     : '界線突破 ‧ 暗',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升暗屬性攻擊力',
        coolDown  : 8,
        check     : BasicActiveCheck,
        endRun    : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    RUNE_STRENGTHEN_W : {
        id        : 'RUNE_STRENGTHEN_W',
        label     : '符石強化 ‧ 水',
        info      : '水符石轉化為水強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    RUNE_STRENGTHEN_F : {
        id        : 'RUNE_STRENGTHEN_F',
        label     : '符石強化 ‧ 火',
        info      : '火符石轉化為火強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    RUNE_STRENGTHEN_P : {
        id        : 'RUNE_STRENGTHEN_P',
        label     : '符石強化 ‧ 木',
        info      : '木符石轉化為木強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    RUNE_STRENGTHEN_L : {
        id        : 'RUNE_STRENGTHEN_L',
        label     : '符石強化 ‧ 光',
        info      : '光符石轉化為光強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    RUNE_STRENGTHEN_D : {
        id        : 'RUNE_STRENGTHEN_D',
        label     : '符石強化 ‧ 暗',
        info      : '暗符石轉化為暗強化符石',
        coolDown  : 10,
        check     : RuneStrengthenCheck,
        transfer  : RuneStrengthenTransfer,
        preSet    : BasicActiveSetting,
    },
    DESPERATE_ATTACK : {
        id        : 'DESPERATE_ATTACK',
        label     : '拚死一擊',
        info      : '1 回合內，自身生命力愈低，全隊攻擊力愈高，最大 3 倍',
        coolDown  : 10,
        addEffect : DesperateAttackEffect,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    OVER_BEAUTY   : {
        id        : 'OVER_BEAUTY',
        label     : '回眸傾城',
        info      : '',
        coolDown  : 8,
        check     : BasicActiveCheck,
        endRun    : OverBeautyEnd,
        preSet    : StartRunSetting,
        startRun  : OverBeautyStart,
    },
    TRACE_OF_NOTION_W : {
        id        : 'TRACE_OF_NOTION_W',
        label     : '印記之念 ‧ 水',
        info      : '水屬性傷害持續提升，直至沒有消除一組 5 粒或以上的水屬性符石 (只計算首批消除的符石)。每累計消除 20 粒水符石，水屬性傷害加快提升。水屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : TeamMemberSwitchCheck,
        preSet    : TraceOfNotionSetting,
        start     : TraceOfNotionStart,
        update    : TraceOfNotionUpdate,
    },
    TRACE_OF_NOTION_F : {
        id        : 'TRACE_OF_NOTION_F',
        label     : '印記之念 ‧ 火',
        info      : '火屬性傷害持續提升，直至沒有消除一組 5 粒或以上的火屬性符石 (只計算首批消除的符石)。每累計消除 20 粒火符石，火屬性傷害加快提升。火屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : TeamMemberSwitchCheck,
        preSet    : TraceOfNotionSetting,
        start     : TraceOfNotionStart,
        update    : TraceOfNotionUpdate,
    },
    TRACE_OF_NOTION_P : {
        id        : 'TRACE_OF_NOTION_P',
        label     : '印記之念 ‧ 木',
        info      : '木屬性傷害持續提升，直至沒有消除一組 5 粒或以上的木屬性符石 (只計算首批消除的符石)。每累計消除 20 粒木符石，木屬性傷害加快提升。木屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : TeamMemberSwitchCheck,
        preSet    : TraceOfNotionSetting,
        start     : TraceOfNotionStart,
        update    : TraceOfNotionUpdate,
    },
    TRACE_OF_NOTION_L : {
        id        : 'TRACE_OF_NOTION_L',
        label     : '印記之念 ‧ 光',
        info      : '光屬性傷害持續提升，直至沒有消除一組 5 粒或以上的光屬性符石 (只計算首批消除的符石)。每累計消除 20 粒光符石，光屬性傷害加快提升。光屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : TeamMemberSwitchCheck,
        preSet    : TraceOfNotionSetting,
        start     : TraceOfNotionStart,
        update    : TraceOfNotionUpdate,
    },
    TRACE_OF_NOTION_D : {
        id        : 'TRACE_OF_NOTION_D',
        label     : '印記之念 ‧ 暗',
        info      : '暗屬性傷害持續提升，直至沒有消除一組 5 粒或以上的暗屬性符石 (只計算首批消除的符石)。每累計消除 20 粒暗符石，暗屬性傷害加快提升。暗屬性傷害會於每一層數 (Wave) 重置',
        coolDown  : 10,
        attack    : TraceOfNotionAttack,
        check     : TeamMemberSwitchCheck,
        preSet    : TraceOfNotionSetting,
        start     : TraceOfNotionStart,
        update    : TraceOfNotionUpdate,
    },
};

function NewActiveSkill( id ){
    var activeObj = $.extend(true, {}, ACTIVE_SKILLS_DATA[id]);
    activeObj['variable'] = {};
    return activeObj;
}
function triggerActive(place, i){
    if( TEAM_ACTIVE_SKILL.length <= place || TEAM_ACTIVE_SKILL[place].length <= i ){
        return false;
    }

        console.log( TEAM_ACTIVE_SKILL[place][i]['check']( place, i ));
    if( TEAM_ACTIVE_SKILL[place][i]['check']( place, i ) ){
        triggerActiveByKey( place, i, "startRun" );
        triggerActiveByKey( place, i, "start" );
        triggerActiveByKey( place, i, "transfer" );
        triggerActiveByKey( place, i, "addEffect" );
    }
    updateActiveCoolDownLabel();
}
function triggerActiveByKey( place, i, key ){
    if( key in TEAM_ACTIVE_SKILL[place][i] ){
        TEAM_ACTIVE_SKILL[place][i][ key ]( place, i );
    }
}
function checkActiveSkillByKey( key ){
    $.each(TEAM_ACTIVE_SKILL, function(place, actives){
        $.each(actives, function(i, active){
            if( key in active ){
                active[ key ]( place, i );
            }
        });
    });    
}

function activeCoolDownUpdate(){
    $.each(TEAM_ACTIVE_SKILL, function(place, actives){
        $.each(actives, function(i, active){
            if( active['variable']['COOLDOWN'] > 0 ){
                active['variable']['COOLDOWN'] -= 1;
            }
        });
    });
    updateActiveCoolDownLabel();
}

function usingActiveSkillUpdate(){
    for( var activeID in USING_ACTIVE_SKILL_STACK ){
        var place = USING_ACTIVE_SKILL_STACK[activeID]['PLACE'];
        var i = USING_ACTIVE_SKILL_STACK[activeID]['i'];
        if( TEAM_ACTIVE_SKILL.length > place || TEAM_ACTIVE_SKILL[place].length > i ){
            TEAM_ACTIVE_SKILL[place][i]['update']( place, i );
        }
    }
}