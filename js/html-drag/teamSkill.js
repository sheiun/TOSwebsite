
//==============================================================
//==============================================================
// Team Skill Function
//==============================================================
//==============================================================
function basicTeamSkillAdd( teamSkillID ){
    var teamSkill = NewTeamSkill( teamSkillID );
    teamSkill['variable'] = teamSkill['preSet']( TEAM_LEADER, TEAM_FRIEND );
    TEAM_SKILL.push( teamSkill );
}

//==============================================================
// Nordic
//==============================================================
var TeamNordicAttack = function( VAR ){
    COUNT_STRONG_COEFF += 0.15;
}
var TeamNordicSetting = function( LEADER, FRIEND ){
    var color = LEADER['color'];
    for(var i = 0; i < TD_NUM; i++){
        COLOR_PROB[i][ color ] = 0.25;
    }
    return {};
}
var TeamNordicMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['id'].indexOf("NORDIC") >= 0 ){
        basicTeamSkillAdd( this.id );
    }
}

var TeamNordicOdinSetting = function( LEADER, FRIEND ){
    LEADER['leader'] = "ELEMENT_FACTOR3_5";
    FRIEND['leader'] = "ELEMENT_FACTOR3_5";
    TEAM_LEADER_SKILL = NewLeaderSkill( "ELEMENT_FACTOR3_5" );
    TEAM_FRIEND_SKILL = NewLeaderSkill( "ELEMENT_FACTOR3_5" );
    TEAM_LEADER_SKILL["variable"] = TEAM_LEADER_SKILL['preSet']( LEADER );
    TEAM_FRIEND_SKILL["variable"] = TEAM_FRIEND_SKILL['preSet']( FRIEND );

    $.each(TEAM_MEMBERS, function(place, member){
        if( member['id'] == "BOSS_ODIN" ){
            member['color'] = LEADER['color'];
        }
    });
    return { COLOR : LEADER['color'] };
}
var TeamNordicOdinMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['id'].indexOf("NORDIC") >= 0 &&
        checkMembersIDByConfig( {
            ID    : [ "BOSS_ODIN" ],
            check : [ "{0}>0"  ],
        } ) ){
        basicTeamSkillAdd( this.id );
    }
}

//==============================================================
// Babylon
//==============================================================
var TeamBabylonSetting = function( LEADER, FRIEND ){
    LEADER['leader'] = "BABYLON_PLUS";
    FRIEND['leader'] = "BABYLON_PLUS";
    TEAM_LEADER_SKILL = NewLeaderSkill( "BABYLON_PLUS" );
    TEAM_FRIEND_SKILL = NewLeaderSkill( "BABYLON_PLUS" );
    TEAM_LEADER_SKILL["variable"] = TEAM_LEADER_SKILL['preSet']( LEADER );
    TEAM_FRIEND_SKILL["variable"] = TEAM_FRIEND_SKILL['preSet']( FRIEND );
    return { COLOR : LEADER['color'] };
}
var TeamBabylonAttack = function( VAR ){
    COUNT_FACTOR['TeamBabylon'] = {
        factor    : function( member, membe_place ){
            var straight = countFirstStraightNum( 4 );
            if( straight < 2 ){ return 1; }
            else{
                return Math.min( 1+((straight-1)*0.1), 1.5 );
            }         
        },
        prob      : 1,
        condition : function( member, membe_place ){ return true; },
    };
}
var TeamBabylonMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "BABYLON" ){
        basicTeamSkillAdd( this.id );
    }
}

//==============================================================
// DarkLucifer
//==============================================================
var TeamDarkLuciferAttack = function( VAR ){
    if( checkMembersTypeByConfig( { 
            types : [ 'SPIRIT', 'OTHER' ],
            check : [ '{0}>=2', '{1}==0' ]
        } ) ){

        setColorBelongsByConfig( { 'h' : { 'w': 1, 'f': 1, 'p': 1, 'l': 1, 'd': 1 } } );

        COUNT_FACTOR['TeamDarkLucifer'] = {
            factor    : function( member, membe_place ){
                var straight = countFirstStraightNum( 4 );
                if( straight < 2 ){ return 1; }
                else{
                    return Math.min( 1+((straight-1)*0.1), 1.5 );
                }            
            },
            prob      : 1,
            condition : function( member, membe_place ){ return true; },
        };
    }
}
var TeamDarkLuciferMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "DARK_LUCIFER" ){
        basicTeamSkillAdd( this.id );
    }
}

//==============================================================
// Greek
//==============================================================
var TeamGreekComboSetting = function( LEADER, FRIEND ){
    return {
        COLOR       : LEADER['color'],
        EXTRA_COMBO : 0
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
var TeamGreekComboAttack = function( VAR ){
    COUNT_COMBO += VAR['EXTRA_COMBO'];
}
var TeamGreekComboMapping = function(){    
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "GREEK" ){
        basicTeamSkillAdd( this.id );
    }
}
var TeamGreekSetting = function( LEADER, FRIEND ){
    return {
        COLOR       : LEADER['color'],
        COUNT       : 0,
    };
}
var TeamGreekReset = function( VAR ){
    VAR['COUNT'] = 0;
}
var TeamGreekSkill = function( VAR ){
    var comboTimes = VAR['COUNT'];
    for(var key in GROUP_SETS){
        comboTimes += GROUP_SETS[key].length;
    }
    while( comboTimes >= 5 ){
        comboTimes -= 5;
        for(var num = 0; num < REMOVE_STACK.length && num < 2; num ++){
            var id = selectAndRemoveRandomItemFromArrBySeed( REMOVE_STACK );
            STRONG_STACK[id] = VAR['COLOR'];
        }
    }
    VAR['COUNT'] = comboTimes;
}
var TeamGreekMapping = function(){    
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "GREEK" ){
        basicTeamSkillAdd( this.id );
    }
}

//==============================================================
// Couple
//==============================================================
var TeamCoupleAttackFF = function( VAR ){
    COUNT_FACTOR['COUPLE_FF'] = {
        factor    : function( member, membe_place ){ return 6; },
        prob      : 1,
        condition : function( member, membe_place ){
            if( member['color'] == 'f' ){ return true; }
            return false;
        },
    };
}
var TeamCoupleAttackPP = function( VAR ){
    COUNT_FACTOR['COUPLE_PP'] = {
        factor    : function( member, membe_place ){ return 6; },
        prob      : 1,
        condition : function( member, membe_place ){
            if( member['color'] == 'p' ){ return true; }
            return false;
        },
    };
}
var TeamCoupleAttackFP = function( VAR ){
    COUNT_BELONG_COLOR['f']['p'] = 1;
    COUNT_BELONG_COLOR['p']['f'] = 1;
    COUNT_FACTOR['COUPLE_FP'] = {
        factor    : function( member, membe_place ){ return 3; },
        prob      : 1,
        condition : function( member, membe_place ){
            if( member['color'] == 'f' ||  member['color'] == 'p' ){ return true; }
            return false;
        },
    };
}
var TeamCoupleFFMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "COUPLE_F" ){
        basicTeamSkillAdd( this.id );
    }
}
var TeamCouplePPMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "COUPLE_P" ){
        basicTeamSkillAdd( this.id );
    }
}
var TeamCoupleFPMapping = function(){
    if( (TEAM_LEADER['leader'] == "COUPLE_F" && TEAM_FRIEND['leader'] == "COUPLE_P") || 
        (TEAM_LEADER['leader'] == "COUPLE_P" && TEAM_FRIEND['leader'] == "COUPLE_F") ){
        basicTeamSkillAdd( this.id );
    }
}

//==============================================================
// Common Source
//==============================================================
var TeamCommonSourceSetting = function( LEADER, FRIEND ){
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['id'] == "LIXIAOYAO" ){
            member['health'] = Math.round( 1.3*member['health'] );
            member['attack'] = Math.round( 1.3*member['attack'] );
            member['recovery'] = Math.round( 1.3*member['recovery'] );
            return false;
        }
    });
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['id'] == "ZHAOLINGER" ){
            member['health'] = Math.round( 1.3*member['health'] );
            member['attack'] = Math.round( 1.3*member['attack'] );
            member['recovery'] = Math.round( 1.3*member['recovery'] );
            return false;
        }
    });
    $.each(TEAM_MEMBERS, function(i, member){
        if( member['id'] == "LINYUERU" ){
            member['health'] = Math.round( 1.3*member['health'] );
            member['attack'] = Math.round( 1.3*member['attack'] );
            member['recovery'] = Math.round( 1.3*member['recovery'] );
            return false;
        }
    });
}
var TeamCommonSourceMapping = function(){
    if( ( ( TEAM_LEADER['id'] == "LIXIAOYAO" || TEAM_LEADER['id'] == "ZHAOLINGER" ||
            TEAM_LEADER['id'] == "LINYUERU" ) || 
          ( TEAM_FRIEND['id'] == "LIXIAOYAO" || TEAM_FRIEND['id'] == "ZHAOLINGER" ||
            TEAM_FRIEND['id'] == "LINYUERU" ) ) &&
        checkMembersIDByConfig( {
            ID    : [ "LIXIAOYAO", "ZHAOLINGER", "LINYUERU" ],
            check : [ '({0}>=1&&{1}>=1&&(({0}+{1})>=2))||({0}>=1&&{2}>=1&&(({0}+{2})>=2))||({1}>=1&&{2}>=1&&(({1}+{2})>=2))',  ],
        } ) ){
        basicTeamSkillAdd( this.id );
    }
}

//==============================================================
// DevilIllusion
//==============================================================
var TeamDevilIllusionSetting = function( LEADER, FRIEND ){
    LEADER['leader'] = "DEVIL_ILLUSION_PLUS";
    FRIEND['leader'] = "DEVIL_ILLUSION_PLUS";
    TEAM_LEADER_SKILL = NewLeaderSkill( "DEVIL_ILLUSION_PLUS" );
    TEAM_FRIEND_SKILL = NewLeaderSkill( "DEVIL_ILLUSION_PLUS" );
    TEAM_LEADER_SKILL["variable"] = TEAM_LEADER_SKILL['preSet']( LEADER );
    TEAM_FRIEND_SKILL["variable"] = TEAM_FRIEND_SKILL['preSet']( FRIEND );
    return {};
}
var TeamDevilIllusionMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == 'DEVIL_ILLUSION' ){
        basicTeamSkillAdd( this.id );
    }
}

var TeamDevilCircleSetting = function( LEADER, FRIEND ){
    return {
        COLOR    : LEADER['color'],
        END_ITEM : false,
    };
}
var TeamDevilCircleEndItem = function( VAR ){
    if( VAR['END_ITEM'] ){
        var colorArr = ['w', 'f', 'p', 'l', 'd'];
        colorArr.splice( colorArr.indexOf(VAR['COLOR']), 1 );
        turnRandomElementToColorByConfig( {
            color          : VAR['COLOR'],
            num            : 2,
            priorityColors : [ colorArr, ['h'] ],
        } );
    }
}
var TeamDevilCircleAttack = function( VAR ){
    var color = VAR['COLOR'];
    var check = false;
    for(var obj of COMBO_STACK){
        if( obj['color'] == color && obj['amount'] >= 5 ){
            check = true;
        }
    }
    VAR['END_ITEM'] = check;
}
var TeamDevilCircleMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == 'DEVIL_CIRCLE' ){
        basicTeamSkillAdd( this.id );
    }
}

//==============================================================
//==============================================================
// Team Skill Database
//==============================================================
//==============================================================

var TEAM_SKILLS_DATA = {
    NONE : {
        id        : 'NONE',
        label     : '無',
        info      : '',
        mapping   : NoneMapping,
        preSet    : NoneSetting,
    },
    NORDIC : {
        id        : 'NORDIC',
        label     : '雙北歐神隊',
        info      : '相應屬性符石掉落率提升至25%，強化符石的傷害提升至+30%',
        attack    : TeamNordicAttack,
        mapping   : TeamNordicMapping,
        preSet    : TeamNordicSetting,
    },
    NORDIC_ODIN : {
        id        : 'NORDIC_ODIN',
        label     : '眾神之父奧丁',
        info      : '北歐神系列隊長技能「屬性震怒」變為「屬性怒嘯」',
        mapping   : TeamNordicOdinMapping,
        preSet    : TeamNordicOdinSetting,
    },
    GREEK_COMBO : {
        id        : 'GREEK_COMBO',
        label     : '元素連動',
        info      : '每個連擊（Combo）均有 70% 機會額外計算多 1 連擊（Combo）（加乘不受其他技能影響）（木巫加成無效）（不影響Combo盾）',
        attack    : TeamGreekComboAttack,
        extraCombo: TeamGreekExtraCombo,
        extraReset: TeamGreekExtraComboReset,
        mapping   : TeamGreekComboMapping,
        preSet    : TeamGreekComboSetting,
    },
    GREEK : {
        id        : 'GREEK',
        label     : '元素湧現',
        info      : '每消除 5 組符石，將產生 2 粒相應屬性符石',
        extraReset: TeamGreekReset,
        mapping   : TeamGreekMapping,
        newItem   : TeamGreekSkill,
        preSet    : TeamGreekSetting,
    },
    BABYLON : {
        id        : 'BABYLON',
        label     : '蒼穹祈願',
        info      : '隊長技能變為指定屬性攻擊力 3 倍。2 或以上直行消除 4 粒或以上符石時（只計算首批消除的符石），全隊攻擊力提升，最大 1.5 倍',
        attack    : TeamBabylonAttack,
        mapping   : TeamBabylonMapping,
        preSet    : TeamBabylonSetting,
    },
    DARK_LUCIFER : {
        id        : 'DARK_LUCIFER',
        label     : '墮落之心 ‧ 妖精',
        info      : '心符石兼具所有屬性符石效果。於 2 直行或以上消除 4 粒或以上符石時 (只計算首批消除的符石)，全隊攻擊力提升，最大 1.5 倍',
        attack    : TeamDarkLuciferAttack,
        mapping   : TeamDarkLuciferMapping,
        preSet    : NoneSetting,
    },
    COUPLE_FF : {
        id        : 'COUPLE_FF',
        label     : '煉獄之巔峰',
        info      : '火屬性攻擊力提升 6 倍',
        attack    : TeamCoupleAttackFF,
        mapping   : TeamCoupleFFMapping,
        preSet    : NoneSetting,
    },
    COUPLE_PP : {
        id        : 'COUPLE_PP',
        label     : '大地之巔峰',
        info      : '木屬性攻擊力提升 6 倍',
        attack    : TeamCoupleAttackPP,
        mapping   : TeamCouplePPMapping,
        preSet    : NoneSetting,
    },
    COUPLE_FP : {
        id        : 'COUPLE_FP',
        label     : '雙消點燃符能震怒之術',
        info      : '火及木屬性攻擊力提升 3 倍；木符石兼具火符石效果，同時火符石兼具木符石效果',
        attack    : TeamCoupleAttackFP,
        mapping   : TeamCoupleFPMapping,
        preSet    : NoneSetting,
    },
    COMMON_SOURCE : {
        id        : 'COMMON_SOURCE',
        label     : '命定之聚',
        info      : '最左方的李逍遙、趙靈兒、林月如及阿奴，其自身的生命力、攻擊力及回復力提升 1.3 倍',
        mapping   : TeamCommonSourceMapping,
        preSet    : TeamCommonSourceSetting,
    },
    DEVIL_ILLUSION : {
        id        : 'DEVIL_ILLUSION',
        label     : '無垠幻像',
        info      : '將隊長技能「無影幻像」變為「無垠幻像」',
        mapping   : TeamDevilIllusionMapping,
        preSet    : TeamDevilIllusionSetting,
    },
    DEVIL_CIRCLE : {
        id        : 'DEVIL_CIRCLE',
        label     : '結陣 ‧ 繼',
        info      : '消除一組 5 粒或以上的相應屬性符石時，下回合開始時隨機將 2 粒符石轉化為相應屬性符石',
        attack    : TeamDevilCircleAttack,
        end       : TeamDevilCircleEndItem,
        mapping   : TeamDevilCircleMapping,
        preSet    : TeamDevilCircleSetting,
    },
};

function NewTeamSkill( id ){
    var teamSkillObj = $.extend(true, {}, TEAM_SKILLS_DATA[id]);
    teamSkillObj['variable'] = {};
    return teamSkillObj;
}

function checkTeamSkillByKey( key ){
    $.each(TEAM_SKILL, function(i, teamSkill){
        if( key in teamSkill ){
            teamSkill[ key ]( teamSkill["variable"] );
        }
    });
}