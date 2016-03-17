
//==============================================================
//==============================================================
// Team Skill Function
//==============================================================
//==============================================================

var NoneMapping = function(){
    return 0;
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
        TEAM_SKILL.push( TEAM_SKILLS_DATA["NORDIC"] );
    }
}

var TeamNordicOdinSetting = function( LEADER, FRIEND ){
    LEADER['leader'] = "ElementFactor3_5";
    FRIEND['leader'] = "ElementFactor3_5";
    TEAM_LEADER_SKILL = LEADER_SKILLS_DATA[ "ElementFactor3_5" ];
    TEAM_FRIEND_SKILL = LEADER_SKILLS_DATA[ "ElementFactor3_5" ];
    if( MEMBER_1['id'] == "BOSS_ODIN" ){
        MEMBER_1['color'] = LEADER['color'];
    }
    if( MEMBER_2['id'] == "BOSS_ODIN" ){
        MEMBER_2['color'] = LEADER['color'];
    }
    if( MEMBER_3['id'] == "BOSS_ODIN" ){
        MEMBER_3['color'] = LEADER['color'];
    }
    if( MEMBER_4['id'] == "BOSS_ODIN" ){
        MEMBER_4['color'] = LEADER['color'];
    }
    return {};
}
var TeamNordicOdinMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['id'].indexOf("NORDIC") >= 0 &&
        ( MEMBER_1['id'] == "BOSS_ODIN" || MEMBER_2['id'] == "BOSS_ODIN" || 
          MEMBER_3['id'] == "BOSS_ODIN" || MEMBER_4['id'] == "BOSS_ODIN" ) ){
        TEAM_SKILL.push( TEAM_SKILLS_DATA["NORDIC_ODIN"] );
    }
}

//==============================================================
// Babylon
//==============================================================
var TeamBabylonAttack = function( VAR ){
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
var TeamBabylonMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "BABYLON" ){
        TEAM_SKILL.push( TEAM_SKILLS_DATA["BABYLON"] );
    }
}

//==============================================================
// DarkLucifer
//==============================================================
var TeamDarkLuciferAttack = function( VAR ){
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
var TeamDarkLuciferMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "DARK_LUCIFER" ){
        TEAM_SKILL.push( TEAM_SKILLS_DATA["DARK_LUCIFER"] );
    }
}

//==============================================================
// Greek
//==============================================================
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
var TeamGreekAttack = function( VAR ){
    COUNT_COMBO += VAR['EXTRA_COMBO'];
}
var TeamGreekMapping = function(){    
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "GREEK" ){
        TEAM_SKILL.push( TEAM_SKILLS_DATA["GREEK"] );
    }
}

//==============================================================
// Couple
//==============================================================
var TeamCoupleAttackFF = function( VAR ){
    COUNT_FACTOR['COUPLE_FF'] = {
        factor    : function( member ){ return 6; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == 'f' ){ return true; }
            return false;
        },
    };
}
var TeamCoupleAttackPP = function( VAR ){
    COUNT_FACTOR['COUPLE_PP'] = {
        factor    : function( member ){ return 6; },
        prob      : 1,
        condition : function( member ){
            if( member['color'] == 'p' ){ return true; }
            return false;
        },
    };
}
var TeamCoupleAttackFP = function( VAR ){
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
var TeamCoupleFFMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "COUPLE_F" ){
        TEAM_SKILL.push( TEAM_SKILLS_DATA["COUPLE_FF"] );
    }
}
var TeamCouplePPMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == "COUPLE_P" ){
        TEAM_SKILL.push( TEAM_SKILLS_DATA["COUPLE_PP"] );
    }
}
var TeamCoupleFPMapping = function(){
    if( (TEAM_LEADER['leader'] == "COUPLE_F" && TEAM_FRIEND['leader'] == "COUPLE_P") || 
        (TEAM_LEADER['leader'] == "COUPLE_P" && TEAM_FRIEND['leader'] == "COUPLE_F") ){
        TEAM_SKILL.push( TEAM_SKILLS_DATA["COUPLE_FP"] );
    }
}

//==============================================================
// DevilIllusion
//==============================================================
var TeamDevilIllusionSetting = function( LEADER, FRIEND ){
    LEADER['leader'] = "DEVIL_ILLUSION_PLUS";
    FRIEND['leader'] = "DEVIL_ILLUSION_PLUS";
    TEAM_LEADER_SKILL = LEADER_SKILLS_DATA[ "DEVIL_ILLUSION_PLUS" ];
    TEAM_FRIEND_SKILL = LEADER_SKILLS_DATA[ "DEVIL_ILLUSION_PLUS" ];
    return {};
}
var TeamDevilIllusionMapping = function(){
    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] && TEAM_FRIEND['leader'] == 'DEVIL_ILLUSION' ){
        TEAM_SKILL.push( TEAM_SKILLS_DATA["DEVIL_ILLUSION"] );
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
        mapping   : NoneMapping,
        ss        : 'asd',
    },
    NORDIC : {
        id        : 'NORDIC',
        attack    : TeamNordicAttack,
        preSet    : TeamNordicSetting,
        mapping   : TeamNordicMapping,
    },
    NORDIC_ODIN : {
        id        : 'NORDIC_ODIN',
        preSet    : TeamNordicOdinSetting,
        mapping   : TeamNordicOdinMapping,
    },
    GREEK : {
        id        : 'GREEK',
        newItem   : TeamGreekSkill,
        extraCombo: TeamGreekExtraCombo,
        extraReset: TeamGreekExtraComboReset,
        attack    : TeamGreekAttack,
        preSet    : TeamGreekSetting,
        mapping   : TeamGreekMapping,
    },
    BABYLON : {
        id        : 'BABYLON',
        attack    : TeamBabylonAttack,
        mapping   : TeamBabylonMapping,
    },
    DARK_LUCIFER : {
        id        : 'DARK_LUCIFER',
        attack    : TeamDarkLuciferAttack,
        mapping   : TeamDarkLuciferMapping,
    },
    COUPLE_FF : {
        id        : 'COUPLE_FF',
        attack    : TeamCoupleAttackFF,
        mapping   : TeamCoupleFFMapping,
    },
    COUPLE_PP : {
        id        : 'COUPLE_PP',
        attack    : TeamCoupleAttackPP,
        mapping   : TeamCouplePPMapping,
    },
    COUPLE_FP : {
        id        : 'COUPLE_FP',
        attack    : TeamCoupleAttackFP,
        mapping   : TeamCoupleFPMapping,
    },
    DEVIL_ILLUSION : {
        id        : 'DEVIL_ILLUSION',
        preSet    : TeamDevilIllusionSetting,
        mapping   : TeamDevilIllusionMapping,
    },
};
