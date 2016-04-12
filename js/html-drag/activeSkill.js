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
    return (MAIN_STATE == MAIN_STATE_ENUM.READY) && (VAR['COOLDOWN'] == 0);
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
    this.variable['USING'] = true;
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
var BrokeBoundaryAttack = function( place, i ){    
    if( !this.variable['USING'] ){ return false; }
    COUNT_AMOUNT_COEFF[this.variable['COLOR']] += 0.05;
}
var BrokeBoundaryEnd = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    this.variable['USING'] = false;
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
//==============================================================
var OverBeautyStart = function( place, i ){
    this.variable['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };

    disbalePanelControl( true );
    setStartRunByPlayTypeAndTime( PLAY_TYPE_ENUM.FREE, 10 );
    resetHistory();
    resetBase();
}
var OverBeautyAttack = function( place, i ){console.log("12");
    if( !this.variable['USING'] ){ return false; }
console.log("123");
    COUNT_FACTOR['OverBeautyAttack'] = {
        factor    : function( member, member_place ){ 
            var num = countComboElementsFirstWave();
            return 1 + num*0.03;
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}
var OverBeautyEnd = function( place, i ){console.log("1244");
    if( !this.variable['USING'] ){ return false; }
    this.variable['USING'] = false;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];

    disbalePanelControl( false );
    setTimeLimit( 5 );
    setPlayType( PLAY_TYPE_ENUM.DRAG );
}
//==============================================================
var DrunkenFootworkStart = function( place, i ){
    this.variable['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };

    disbalePanelControl( true );
    setStartRunByPlayTypeAndTime( PLAY_TYPE_ENUM.FREE, 15 );
    resetHistory();
    resetBase();
}
var DrunkenFootworkAttack = function( place, i ){
    if( !this.variable['USING'] ){ return false; }

    COUNT_FACTOR['DrunkenFootworkAttack'] = {
        factor    : function( member, member_place ){
            if( countComboElementsFirstWave() == TR_NUM*TD_NUM ){ return 2.4; }
            return 1.5;
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}
var DrunkenFootworkEnd = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    this.variable['USING'] = false;
    delete USING_ACTIVE_SKILL_STACK[ this.id ];

    disbalePanelControl( false );
    setTimeLimit( 5 );
    setPlayType( PLAY_TYPE_ENUM.DRAG );
}


//==============================================================
// Transfer function
//==============================================================
var RuneStrengthenCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColorWithoutStrong( this.variable['COLOR'] );
}
var RuneStrengthenTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( this.variable['COLOR'] );
    for(var id of stack){
        turnElementToStrongByID(id);
    }
}
//==============================================================
var DeffensiveStanceCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColor( COLOR_EXCLUSIVE[ this.variable['COLOR'] ] );
}
var DeffensiveStanceTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( COLOR_EXCLUSIVE[ this.variable['COLOR'] ] );
    for(var id of stack){
        turnElementToColorByID(id, 'h');
    }
}
var DeffensiveStanceEXTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( COLOR_EXCLUSIVE[ this.variable['COLOR'] ] );
    for(var id of stack){
        turnElementToColorByID(id, 'h+');
    }
}
//==============================================================
var EnsiformBreathCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColorArrWithoutStrong( ['l', 'd'] );
}
var EnsiformBreathTransfer = function( place, i ){
    var stack = getStackOfPanelByColorArr( ['l', 'd'] );
    for(var id of stack){
        turnElementToStrongByID(id);
    }
}
//==============================================================
var SpellOfTornadosTransfer = function( place, i ){
    var stack = [ 'w','w','w','w','w','w','w','w',
                  'f','f','f','f','f','f','f','f',
                  'p','p','p','p','p','p','p','p',
                  'h','h','h','h','h','h' ];
    stack = makeArrayShuffle(stack);
    $.each(stack, function(id, color){
        turnElementToColorByID(id, color);
    });
}
var SpellOfBloodSpiritsCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColorArr( ['l', 'd'] );
}
var SpellOfBloodSpiritsTransfer = function( place, i ){
    var stack = getStackOfPanelByColor( 'l' );
    for(var id of stack){
        turnElementToColorByID(id, 'f');
    }
    stack = getStackOfPanelByColor( 'd' );
    for(var id of stack){
        turnElementToColorByID(id, 'h');
    }
}
var SpellOfBloodSpiritsEXTransfer = function( place, i ){
    if( checkHasElementByColorArr( ['l', 'd'] ) ){
        var stack = getStackOfPanelByColor( 'l' );
        for(var id of stack){
            turnElementToColorByID(id, 'f');
        }
        stack = getStackOfPanelByColor( 'd' );
        for(var id of stack){
            turnElementToColorByID(id, 'h');
        }
    }else{
        var effect = NewAdditionalEffect( this.id );
        effect['variable'] = effect['preSet']( place, i, this.variable );
        additionalEffectAdd( effect );
    }
}
//==============================================================
var SongOfEmpathyEvilTransfer = function( place, i ){
    var stack = [ 'd','d','h','h','d','d',
                  'd','h','d','d','h','d',
                  'h','h','d','d','h','h',
                  'd','h','d','d','h','d',
                  'd','d','h','h','d','d' ];
    $.each(stack, function(id, color){
        turnElementToColorByID(id, color);
    });
}
var WaterFairyTransfer = function( place, i ){
    var stack = getStackOfStraight(0);
    for(var id of stack){
        turnElementToColorByID(id, 'h');
    }
    stack = getStackOfHorizontal( TR_NUM-1 );
    for(var id of stack){
        turnElementToColorByID(id, 'w');
    }
}

//==============================================================
var TransformationCheck = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        checkHasElementByColorArr( getOtherColorsFromColorArr( this.variable['COLOR'] ) );
}
var TransformationH_Check = function( place, i ){
    return basicActiveCheck( this.variable, place, i ) &&
        getStackOfPanelByColorArr( getOtherColorsFromColorArr('h') ).length >= this.variable['COUNT'];
}
var TransformationSetting = function( member, place, i ){
    return {
        COLOR     : member['color'],
        TYPE      : member['type'],
        COOLDOWN  : this.coolDown,
        PLACE     : place,
        i         : i,
        COUNT     : 0,
    }
}
var TransformationTransfer = function( place, i ){
    if( this.variable['COUNT'] == 0 ){ return false; }
    var otherColors = getOtherColorsFromColorArr(
        [ 'h', COLOR_EXCLUSIVE[ this.variable['COLOR'] ], this.variable['COLOR'] ]
    );
    turnRandomElementToColorByConfig( {
        color          : this.variable['COLOR'],
        num            : this.variable['COUNT']+1,
        priorityColors : [ ['h'], [ COLOR_EXCLUSIVE[this.variable['COLOR']] ], otherColors, [this.variable['COLOR']] ],
    } );
    this.variable['COUNT'] = 0;
}
var TransformationPlusTransfer = function( place, i ){
    if( this.variable['COUNT'] == 0 ){ return false; }
    var color = (this.variable['COUNT'] == 7) ? this.variable['COLOR']+'+' : this.variable['COLOR'];
    var otherColors = getOtherColorsFromColorArr(
        [ 'h', COLOR_EXCLUSIVE[ this.variable['COLOR'] ], this.variable['COLOR'] ]
    );
    turnRandomElementToColorByConfig( {
        color          : color,
        num            : this.variable['COUNT']+1,
        priorityColors : [ ['h'], [ COLOR_EXCLUSIVE[this.variable['COLOR']] ], otherColors, [this.variable['COLOR']] ],
    } );
    this.variable['COUNT'] = 0;
}
var TransformationH_Transfer = function( place, i ){
    if( this.variable['COUNT'] == 0 ){ return false; }

    turnRandomElementToColorByProb( {
        color      : 'h',
        num        : this.variable['COUNT'],
        probColors : {
            'w': 5/18, 'f': 10/18, 'p': 15/18, 'l': 11/12, 'd': 12/12
        },
    } );
    this.variable['COUNT'] = 0;
}
var TransformationEnd = function( place, i ){
    if( COMBO_STACK.length > 0 ){
        this.variable['COUNT'] = Math.min( 7, this.variable['COUNT']+1 );    
    }
}
var TransfigurationEnd = function( place, i ){
    if( COMBO_STACK.length > 0 ){
        this.variable['COUNT'] = Math.min( 5, this.variable['COUNT']+1 );    
    }
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
    this.variable['USING'] = true;
    USING_ACTIVE_SKILL_STACK[ this.id ] = { PLACE: place, i: i };
    $("#ActiveButtonTD td").eq(place).find("button span").eq(i).text(this.label).append("<br>(使用中)");
}
var TraceOfNotionUpdate = function( place, i ){
    if( !this.variable['USING'] ){ return false; }
    if( checkComboColorFirstMaxAmountByConfig({
            ID    : [ this.variable['COLOR'] ],
            check : [ '{0}<5' ],
        }) ){
        this.variable['USING'] = false;
        this.variable['COUNT'] = 0;
        this.variable['FACTOR'] = 1.2;
        delete USING_ACTIVE_SKILL_STACK[ this.id ];
        $("#ActiveButtonTD td").eq(place).find("button span").eq(i).text(this.label);
    }
}
var TraceOfNotionAttack = function( place, i ){
    if( !this.variable['USING'] ){ return false; }

    var max = 0;
    var num = 0;
    for(var combo of COMBO_STACK){
        if(combo['color'] == this.variable['COLOR']){
            max = Math.max( max, combo['amount'] );
            num += combo['amount'];
        }
    }
    if( num > 0 ){
        num += this.variable['COUNT'];
        this.variable['FACTOR'] = Math.min( 2.2, this.variable['FACTOR']+0.2+( Math.floor(num/20) )*0.2 );
        this.variable['COUNT'] = num%20;
    }

    COUNT_COLOR_FACTOR[ this.variable['COLOR'] ] *= this.variable['FACTOR'];
}


//==============================================================
// Attack Effect function
//==============================================================
var AddtionalEffectCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) && basicActiveCheck( this.variable, place, i );
}
function basicAdditionalEffectCheck( effectID ){
    var checkEffect = true;
    $.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
        if( effect['id'] == effectID ){
            checkEffect = false;
            return false;
        }
    });
    return checkEffect;
}
function basicAdditionalEffectCheckByTag( effectTag ){
    var checkEffect = true;
    $.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
        if( effect['tag'].indexOf( effectTag ) >= 0 ){
            checkEffect = false;
            return false;
        }
    });
    return checkEffect;
}
//==============================================================
var PlaySafeCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "injureReduce" ) &&
        basicActiveCheck( this.variable, place, i );
}
var PlayWildCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "defenceReduce" ) &&
        basicActiveCheck( this.variable, place, i );
}
var BladesEffectCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "setTimeLimit" ) &&
        basicActiveCheck( this.variable, place, i );
}
var SongOfEmpathyEvilEffectCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "setTimeLimit" ) &&
        basicActiveCheck( this.variable, place, i );
}
var MagicStageCheck = function( place, i ){
    return basicAdditionalEffectCheck( this.id ) &&
        basicAdditionalEffectCheckByTag( "newItem" ) &&
        basicActiveCheck( this.variable, place, i );
}

var BasicAddtionalEffectAdd = function( place, i ){
    var effect = NewAdditionalEffect( this.id );
    effect['variable'] = effect['preSet']( place, i, this.variable );

    additionalEffectAdd( effect );
}

//==============================================================
// Enemy Effect function
//==============================================================
var EnemyEffectCheck = function( place, i ){
    return basicEnemyEffectCheck( this.id ) && basicActiveCheck( this.variable, place, i );
}
function basicEnemyEffectCheck( effectID ){
    var checkEffect = true;
    $.each(ENEMY, function(e, enemy){
        $.each(enemy['variable']['EFFECT'], function(i, effect){
            if( effect['id'] == effectID ){
                checkEffect = false;
                return false;
            }
        });
    });
    return checkEffect;
}
function basicEnemyEffectCheckByTag( effectTag ){
    var checkEffect = true;
    $.each(ENEMY, function(e, enemy){
        $.each(enemy['variable']['EFFECT'], function(i, effect){
            if( effect['tag'].indexOf( effectTag ) >= 0 ){
                checkEffect = false;
                return false;
            }
        });
    });
    return checkEffect;
}
//==============================================================
var BattleFieldCheck = function( place, i ){
    return basicEnemyEffectCheck( this.id ) &&
        basicEnemyEffectCheckByTag( 'changeColor' ) &&
        basicActiveCheck( this.variable, place, i );
}
var BlazingCircleCheck = function( place, i ){
    return basicEnemyEffectCheck( this.id ) &&
        basicEnemyEffectCheckByTag( 'changeColor' ) &&
        basicEnemyEffectCheckByTag( 'addCoolDown' ) &&
        basicActiveCheck( this.variable, place, i );
}

var BasicEnemyEffectAdd = function( place, i ){
    var effectID = this.id;

    $.each(ENEMY, function(e, enemy){
        var effect = NewEnemyEffect( effectID );
        effect['variable'] = effect['preSet']( place, i, this.variable, enemy );
        enemy['variable']['EFFECT'].push( effect );
    });
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
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_F : {
        id        : 'BREAK_BOUNDARY_F',
        label     : '界線突破 ‧ 火',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升火屬性攻擊力',
        coolDown  : 8,
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_P : {
        id        : 'BREAK_BOUNDARY_P',
        label     : '界線突破 ‧ 木',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升木屬性攻擊力',
        coolDown  : 8,
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_L : {
        id        : 'BREAK_BOUNDARY_L',
        label     : '界線突破 ‧ 光',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升光屬性攻擊力',
        coolDown  : 8,
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
        preSet    : StartRunSetting,
        startRun  : BrokeBoundaryStart,
    },
    BREAK_BOUNDARY_D : {
        id        : 'BREAK_BOUNDARY_D',
        label     : '界線突破 ‧ 暗',
        info      : '額外增加 3 行符石，大幅延長移動符石時間至 10 秒，並提升暗屬性攻擊力',
        coolDown  : 8,
        attack    : BrokeBoundaryAttack,
        check     : BasicActiveCheck,
        end       : BrokeBoundaryEnd,
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
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    OVER_BEAUTY   : {
        id        : 'OVER_BEAUTY',
        label     : '回眸傾城',
        info      : '10 秒內，可任意移動符石而不會發動消除；消除的符石數目愈多，攻擊力提升愈多，最大 1.9 倍 (只計算首批消除的符石數目)',
        coolDown  : 8,
        attack    : OverBeautyAttack,
        check     : BasicActiveCheck,
        end       : OverBeautyEnd,
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
    TRANSFORMATION_W : {
        id        : 'TRANSFORMATION_W',
    },
    TRANSFIGURATION_H : {
        id        : 'TRANSFIGURATION_H', 
        label     : '蓄能傳承 ‧ 心',
        info      : '將與累積戰鬥回合數同等數量的符石轉為心符石，最多 7 粒。發動技能後會將累積戰鬥回合數重置',
        coolDown  : 1,
        check     : TransformationCheck,
        preSet    : TransformationSetting,
        transfer  : TransformationH_Transfer,
        end       : TransformationEnd,
    },
    DEFENSIVE_STANCE_EX_F : {
        id        : 'DEFENSIVE_STANCE_EX_F',
        label     : '鐵壁陣勢 ‧ 火',
        info      : '木符石轉化為心強化符石',
        coolDown  : 5,
        check     : DeffensiveStanceCheck,
        preSet    : BasicActiveSetting,
        transfer  : DeffensiveStanceEXTransfer,
    },
    BATTLEFIELD_P : {
        id        : 'BATTLEFIELD_P',
        label     : '枯朽的戰場',
        info      : '2 回合內，敵方全體轉為水屬性，並提升木屬性對水屬性目標的攻擊力',
        coolDown  : 12,
        addEffect : BasicEnemyEffectAdd,
        check     : BattleFieldCheck,
        preSet    : BasicActiveSetting,
    },
    FIGHT_SAFE : {
        id        : 'FIGHT_SAFE',
        label     : '攻守自如',
        info      : '1 回合內，達成 4 連擊 (Combo) 或以下，回復 20,000 點生命力；反之，所有成員攻擊力 2 倍。連擊 (Combo) 只計算首批消除的符石',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    PLAY_SAFE : {
        id        : 'PLAY_SAFE',
        label     : '進退自如',
        info      : '1 回合內，達成 4 連擊 (Combo) 或以下，所受傷害減少 80%；反之，所有成員攻擊力 2 倍。連擊 (Combo) 只計算首批消除的符石',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : PlaySafeCheck,
        preSet    : BasicActiveSetting,
    },
    PLAY_WILD : {
        id        : 'PLAY_WILD',
        label     : '攻勢如虹',
        info      : '1 回合內，達成 4 連擊 (Combo) 或以下時，敵方全體防禦力變 0；反之，所有成員攻擊力 2 倍。連擊 (Combo) 只計算首批消除的符石',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : PlayWildCheck,
        preSet    : BasicActiveSetting,
    },
    HUNTING_MODE : {
        id        : 'HUNTING_MODE',
        label     : '狩獵之勢',
        info      : '2 回合內，自身攻擊力 3 倍。若身旁的成員同為獸類，同得此效果',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLAZING_CIRCLE : {
        id        : 'BLAZING_CIRCLE',
        label     : '燄之結界',
        info      : '敵方全體點燃，使受影響目標無法行動並轉為火屬性，持續 3 回合',
        coolDown  : 15,
        addEffect : BasicEnemyEffectAdd,
        check     : BlazingCircleCheck,
        preSet    : BasicActiveSetting,
    },
    SAVAGE_ATTACK : {
        id        : 'SAVAGE_ATTACK',
        label     : '窮兇極怒',
        info      : '1 回合內，自身攻擊力 10 倍。(攻擊力不可與其他成員共享)',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_WATER : {
        id        : 'BLADES_OF_WATER',
        label     : '水刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；消除一組 6 粒或以上的水符石，水屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : BladesEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_FLAME : {
        id        : 'BLADES_OF_FLAME',
        label     : '燄刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；消除一組 6 粒或以上的火符石，火屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : BladesEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_VINE : {
        id        : 'BLADES_OF_VINE',
        label     : '藤刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；消除一組 6 粒或以上的木符石，木屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : BladesEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_LIGHT : {
        id        : 'BLADES_OF_LIGHT',
        label     : '光刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；同時消除心符石、光符石及暗符石，光屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : BladesEffectCheck,
        preSet    : BasicActiveSetting,
    },
    BLADES_OF_PHANTOM : {
        id        : 'PHANTOM',
        label     : '魅刃之能',
        info      : '1 回合內，延長移動符石時間 3 秒；同時消除心符石、光符石及暗符石，暗屬性攻擊力 1.5 倍',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : BladesEffectCheck,
        preSet    : BasicActiveSetting,
    },
    ENSIFORM_BREATH : {
        id        : 'ENSIFORM_BREATH',
        label     : '凝氣成劍',
        info      : '光符石轉化為光強化符石，同時將暗符石轉化為暗強化符石',
        coolDown  : 5,
        check     : EnsiformBreathCheck,
        transfer  : EnsiformBreathTransfer,
        preSet    : BasicActiveSetting,
    },
    SPELL_OF_TORNADOS : {
        id        : 'SPELL_OF_TORNADOS',
        label     : '旋風咒',
        info      : '將所有符石轉化為固定數量的水、火、木及心符石',
        coolDown  : 12,
        check     : BasicActiveCheck,
        transfer  : SpellOfTornadosTransfer,
        preSet    : BasicActiveSetting,
    },
    SPELL_OF_BLOOD_SPIRITS : {
        id        : 'SPELL_OF_BLOOD_SPIRITS',
        label     : '靈血咒',
        info      : '光符石轉化為火符石，同時暗符石轉化為心符石',
        coolDown  : 6,
        check     : SpellOfBloodSpiritsCheck,
        transfer  : SpellOfBloodSpiritsTransfer,
        preSet    : BasicActiveSetting,
    },
    SPELL_OF_BLOOD_SPIRITS_EX : {
        id        : 'SPELL_OF_BLOOD_SPIRITS_EX',
        label     : '靈血咒 ‧ 強',
        info      : '若場上沒有光及暗符石時，全隊攻擊力 1.5 倍；反之，若場上有光或暗符石時，光符石轉化為火符石，同時暗符石轉化為心符石',
        coolDown  : 6,
        check     : BasicActiveCheck,
        transfer  : SpellOfBloodSpiritsEXTransfer,
        preSet    : BasicActiveSetting,
    },
    DRUNKEN_FOOTWORK : {
        id        : 'DRUNKEN_FOOTWORK',
        label     : '醉仙望月步',
        info      : '15 秒內，可任意移動符石而不會發動消除，若消除當前所有符石，全隊攻擊力 2.4 倍；反之，全隊攻擊力 1.5 倍',
        coolDown  : 15,
        attack    : DrunkenFootworkAttack,
        check     : BasicActiveCheck,
        end       : DrunkenFootworkEnd,
        preSet    : StartRunSetting,
        startRun  : DrunkenFootworkStart,
    },
    SONG_OF_EMPATHY_EVIL :{
        id        : 'SONG_OF_EMPATHY_EVIL',
        label     : '憐憫惡魔之歌',
        info      : '將場上所有符石轉化為固定數量及位置的暗及心符石，並延長移動符石時間 3 秒',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : SongOfEmpathyEvilEffectCheck,
        transfer  : SongOfEmpathyEvilTransfer,
        preSet    : BasicActiveSetting,
    },
    WATER_FAIRY : {
        id        : 'WATER_FAIRY',
        label     : '水之仙女',
        info      : '將最底一橫行的符石轉化為水符石，並將最左方一直行的 4 粒符石轉化為心符石',
        coolDown  : 5,
        check     : BasicActiveCheck,
        transfer  : WaterFairyTransfer,
        preSet    : BasicActiveSetting,
    },
    ELEMENTAL_ASSEMBLY_W : {
        id        : 'ELEMENTAL_ASSEMBLY_W',
        label     : '元素歸一 ‧ 水',
        info      : '1 回合內，消除符石的種類愈多，水屬性攻擊力提升愈多，最大提升至 2.2 倍',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    ELEMENTAL_ASSEMBLY_F : {
        id        : 'ELEMENTAL_ASSEMBLY_F',
        label     : '元素歸一 ‧ 火',
        info      : '1 回合內，消除符石的種類愈多，火屬性攻擊力提升愈多，最大提升至 2.2 倍',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    ELEMENTAL_ASSEMBLY_P : {
        id        : 'ELEMENTAL_ASSEMBLY_P',
        label     : '元素歸一 ‧ 木',
        info      : '1 回合內，消除符石的種類愈多，木屬性攻擊力提升愈多，最大提升至 2.2 倍',
        coolDown  : 10,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    MAGIC_STAGE_BEAM : {
        id        : 'MAGIC_STAGE_BEAM',
        label     : '結界術 ‧ 玄光',
        info      : '1 回合內，每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 2 粒光符石',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : AddtionalEffectCheck,
        preSet    : BasicActiveSetting,
    },
    MAGIC_STAGE_GLOOM : {
        id        : 'MAGIC_STAGE_GLOOM',
        label     : '結界術 ‧ 幽冥',
        info      : '1 回合內，每直行消除一組 4 粒或以上符石時 (只計算首批消除的符石)，該直行將產生 2 粒暗符石',
        coolDown  : 12,
        addEffect : BasicAddtionalEffectAdd,
        check     : MagicStageCheck,
        preSet    : BasicActiveSetting,
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

    if( TEAM_ACTIVE_SKILL[place][i]['check']( place, i ) ){
console.log("check-true");
        triggerActiveByKey( place, i, "startRun" );
        triggerActiveByKey( place, i, "start" );
        triggerActiveByKey( place, i, "transfer" );
        triggerActiveByKey( place, i, "addEffect" );
        TEAM_ACTIVE_SKILL[place][i]["variable"]["COOLDOWN"] = TEAM_ACTIVE_SKILL[place][i]["coolDown"];

        for(var w = 0; w < 4; w++){
            checkWakeFromOrderByKey( "transfer", place, w );
        }
    }
    updateActiveCoolDownLabel();
}
function triggerActiveByKey( place, i, key ){
    if( key in TEAM_ACTIVE_SKILL[place][i] ){
console.log("trigger-"+key);
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
            if( COMBO_STACK.length > 0 ){
                if( active['variable']['COOLDOWN'] > 0 ){
                    active['variable']['COOLDOWN'] -= 1;
                }
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