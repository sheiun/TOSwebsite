//==============================================================
//==============================================================
// Skill Function
//==============================================================
//==============================================================

//==============================================================
// ElementFactor
//==============================================================
var ElementFactor3Setting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var ElementFactor3Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor3'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}
var ElementFactor3_5Setting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var ElementFactor3_5Attack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['ElementFactor3'+direct] = {
        factor    : function( member, member_place ){ return 3.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
}

//==============================================================
// Greek
//==============================================================
var GreekSetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
        COUNT : 0,
    };
}
var GreekSkill = function( VAR, direct ){
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

//==============================================================
// Couple
//==============================================================
var CoupleSetting = function( MEMBER ){
    TEAM_COLORS_CHANGEABLE = false;
    GROUP_SIZE[ MEMBER['color'] ] = 2;
    GROUP_SIZE['h'] = 2;
    return {
        COLOR : MEMBER['color'],
        COUNT : 0,
    };
}
var CoupleEndSkill = function( VAR, direct ){
    var color = VAR['COLOR'];
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

//==============================================================
// Doll
//==============================================================
var DollHumanDragonAttack = function( VAR, direct ){
    COUNT_FACTOR['DollHumanDragon'+direct] = {
        factor    : function( member, member_place ){
            if( member['type'] == "DRAGON" ){
                return 2;
            }else if( member['type'] == "HUMAN" ){
                return 3.5;
            }
            return 1;
        },
        prob      : 1,
        condition : function( member, member_place ){
            var count_type = { 'HUMAN': 0, 'DRAGON': 0, 'OTHER': 0 };
            $.each(TEAM_MEMBERS, function(i, member){
                if( member['type'] == 'HUMAN' ){ count_type['HUMAN'] += 1; }
                else if( member['type'] == 'DRAGON' ){ count_type['DRAGON'] += 1; }
                else { count_type['OTHER'] += 1; }
            });
            if( count_type['HUMAN'] > 0 && count_type['DRAGON'] >= 2 && 
                count_type['OTHER'] == 0 ){ 
                return true;
            }
            return false;
        },
    };
}
var DollHumanBeastSpiritAttack = function( VAR, direct ){
    COUNT_FACTOR['DollHumanDragon'+direct] = {
        factor    : function( member, member_place ){
            if( member['type'] == "BEAST" || member['type'] == "SPIRIT" ){
                return 2.5;
            }else if( member['type'] == "HUMAN" ){
                return 3.5;
            }
            return 1;
        },
        prob      : 1,
        condition : function( member, member_place ){
            var count_type = { 'HUMAN': 0, 'BEAST': 0, 'SPIRIT': 0, 'OTHER': 0 };
            $.each(TEAM_MEMBERS, function(i, member){
                if( member['type'] == 'HUMAN' ){ count_type['HUMAN'] += 1; }
                else if( member['type'] == 'BEAST' ){ count_type['BEAST'] += 1; }
                else if( member['type'] == 'SPIRIT' ){ count_type['SPIRIT'] += 1; }
                else { count_type['OTHER'] += 1; }
            });
            if( count_type['HUMAN'] > 0 && ( count_type['BEAST'] + count_type['SPIRIT'] ) >= 2 && 
                count_type['OTHER'] == 0 ){ 
                return true;
            }
            return false;
        },
    };
}
var DollHumanDevilSpiritAttack = function( VAR, direct ){
    COUNT_FACTOR['DollHumanDragon'+direct] = {
        factor    : function( member, member_place ){
            if( member['type'] == "DEVIL" || member['type'] == "SPIRIT" ){
                return 2.5;
            }else if( member['type'] == "HUMAN" ){
                return 3.5;
            }
            return 1;
        },
        prob      : 1,
        condition : function( member, member_place ){
            var count_type = { 'HUMAN': 0, 'DEVIL': 0, 'SPIRIT': 0, 'OTHER': 0 };
            $.each(TEAM_MEMBERS, function(i, member){
                if( member['type'] == 'HUMAN' ){ count_type['HUMAN'] += 1; }
                else if( member['type'] == 'DEVIL' ){ count_type['DEVIL'] += 1; }
                else if( member['type'] == 'SPIRIT' ){ count_type['SPIRIT'] += 1; }
                else { count_type['OTHER'] += 1; }
            });
            if( count_type['HUMAN'] > 0 && ( count_type['DEVIL'] + count_type['SPIRIT'] ) >= 2 && 
                count_type['OTHER'] == 0 ){ 
                return true;
            }
            return false;
        },
    };
}
var DollHumanGodAttack = function( VAR, direct ){
    COUNT_FACTOR['DollHumanDragon'+direct] = {
        factor    : function( member, member_place ){
            if( member['type'] == "GOD" ){
                return 2;
            }else if( member['type'] == "HUMAN" ){
                return 3.5;
            }
            return 1;
        },
        prob      : 1,
        condition : function( member, member_place ){
            var count_type = { 'HUMAN': 0, 'GOD': 0, 'OTHER': 0 };
            $.each(TEAM_MEMBERS, function(i, member){
                if( member['type'] == 'HUMAN' ){ count_type['HUMAN'] += 1; }
                else if( member['type'] == 'GOD' ){ count_type['GOD'] += 1; }
                else { count_type['OTHER'] += 1; }
            });
            if( count_type['HUMAN'] > 0 && count_type['GOD'] >= 2 && 
                count_type['OTHER'] == 0 ){ 
                return true;
            }
            return false;
        },
    };
}
//==============================================================
// Tribe Beast
//==============================================================
var TribeBeastSetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var TribeBeastAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    var colorArr = ['w', 'f', 'p', 'l', 'd'];
    colorArr.splice( colorArr.indexOf(color), 1 );
    var belong_factor = 0;
    for( var member of TEAM_MEMBERS ){
        if( member['type'] == 'BEAST' ){
            belong_factor += 0.1;
        }
    }
    belong_factor = Math.min( belong_factor, 0.5 );
    for(var c of colorArr){
        COUNT_BELONG_COLOR[ color ][ c ] += belong_factor;
    }

    COUNT_FACTOR['TribeBeast'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['type'] == 'BEAST' ){ 
                return true;
            }
            return false;
        },
    };
}

//==============================================================
// Sword
//==============================================================
var SwordBrotherAttack = function( VAR, direct ){
    COUNT_BELONG_COLOR['l']['d'] += 0.5;
    COUNT_BELONG_COLOR['d']['l'] += 0.5;
    COUNT_FACTOR['SwordBrother'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == 'l' ||  member['color'] == 'd' ){ 
                return true;
            }
            return false;
        },
    };
    COUNT_FACTOR['SwordBrotherBoth'+direct] = {
        factor    : function( member, member_place ){ return 1.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( COUNT_AMOUNT['l'] > 0 && COUNT_AMOUNT['d'] > 0 ){
                return true;
            }
            return false;
        },
    };
}

//==============================================================
// Babylon
//==============================================================
var BabylonSetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var BabylonSkill = function( VAR, direct ){
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
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){
                return true;
            }
            return false;
        },
    };
}

//==============================================================
// Chinese Paladin
//==============================================================
var LIXIAOYAOSetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var LIXIAOYAOAttack = function( VAR, direct ){
    if( 'HeartProb' in COUNT_FACTOR ){
        COUNT_FACTOR['HeartProb']['prob'] += 0.5;
    }else{
        COUNT_FACTOR['HeartProb'] = {
            factor    : function( member, member_place ){ return 1.5; },
            prob      : 0.5,
            condition : function( member, member_place ){
                if( COUNT_AMOUNT['h'] > 0 ){                   
                    return checkMembersColorOnlyInColorArr( ['w', 'f', 'p'] );
                }
                return false;
            },
        };
    }

    COUNT_FACTOR['LIXIAOYAOAttack'+direct] = {
        factor    : function( member, member_place ){            
            var num = 0;
            for( var key in COUNT_AMOUNT ){
                num += COUNT_AMOUNT[key];
            }
            var factor = 1.8;
            var rate = 0.15;
            while( num > 0 && rate > 0 ){
                if( num >= 5 ){
                    factor += 5*rate;
                    rate -= 0.02;
                    num -= 5;
                }else{
                    factor += num*rate;
                    rate -= 0.02;
                    num -= num;
                }
            }
            return factor;
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}
var CommonSourcePlusAttack = function( VAR, direct ){
    if( 'HeartProb' in COUNT_FACTOR ){
        COUNT_FACTOR['HeartProb']['prob'] += 0.5;
    }else{
        COUNT_FACTOR['HeartProb'] = {
            factor    : function( member, member_place ){ return 1.5; },
            prob      : 0.5,
            condition : function( member, member_place ){
                if( COUNT_AMOUNT['h'] > 0 ){                   
                    return checkMembersColorOnlyInColorArr( ['w', 'f', 'p'] );
                }
                return false;
            },
        };
    }

    if( checkMembersColorOnlyInColorArr( ['w', 'f', 'p'] ) ){
        COUNT_BELONG_COLOR['w']['f'] = 1;
        COUNT_BELONG_COLOR['w']['p'] = 1;
        COUNT_BELONG_COLOR['f']['w'] = 1;
        COUNT_BELONG_COLOR['f']['p'] = 1;
        COUNT_BELONG_COLOR['p']['w'] = 1;
        COUNT_BELONG_COLOR['p']['f'] = 1;
    }

    COUNT_FACTOR['CommonSourcePlus'+direct] = {
            factor    : function( member, member_place ){ return 1.5; },
            prob      : 1,
            condition : function( member, member_place ){
                if( COUNT_AMOUNT['w'] > 0 && COUNT_AMOUNT['f'] > 0 && COUNT_AMOUNT['p'] > 0 ){                   
                    return true;
                }
                return false;
            },
        };
}

//==============================================================
// DarkLucifer
//==============================================================
var WaterFairySetting = function( MEMBER ){
    return {
        COLOR : MEMBER['color'],
    };
}
var WaterFairyAttack = function( VAR, direct ){
    COUNT_FACTOR['WaterFairy'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == VAR['COLOR'] ){
                return true;
            }
            return false;
        },
    };
    if( !('WaterFairyBaseLine' in COUNT_FACTOR) ){
        COUNT_FACTOR['WaterFairyBaseLine'] = {
            factor    : function( member, member_place ){
                if( TEAM_MEMBERS[member_place]['id'] == 'WATER_FAIRY' && 
                    ( member_place == 0 || member_place == (TD_NUM-1) ) ){
                    if( TEAM_LEADER['id'] == TEAM_FRIEND['id'] ){
                        return 9;
                    }
                    return 3;
                }
                return 1;
            },
            prob      : 1,
            condition : function( member, member_place ){
                var base_line = [];
                for(var i = TD_NUM*(TR_NUM-1); i < TD_NUM*TR_NUM; i++){
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
                if( base_line.length == 0 ){
                    return true;
                }
                return false;
            },
        };
    }
}
var DarkLuciferSetting = function( MEMBER ){
    return {
        COLOR : 'h',
    };
}
var DarkLuciferAttack = function( VAR, direct ){
    COUNT_FACTOR['DarkLucifer'+direct] = {
        factor    : function( member, member_place ){ return 2.5; },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}

//==============================================================
// DevilIllusion
//==============================================================
var DevilIllusionSetting = function( MEMBER ){
    return {
        COLOR      : MEMBER['color'],
        MAX_COLORS : [],
    };
}
var DevilIllusionFindMaxColor = function( VAR, direct ){
    var colors = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0 };
    for( var i = 0; i < TD_NUM*TR_NUM; i++ ){
        var c = $("#dragContainment tr td img.over ").eq(i).attr("color");
        if( c in colors ){
            colors[c] += 1;
        }
    }
    var colorsNum = [ colors['w'], colors['f'], colors['p'], colors['l'], colors['d'] ];
    var max = Math.max.apply(null, colorsNum);
    VAR['MAX_COLORS'] = [];
    for( var c in colors ){
        if( colors[c] == max ){
            VAR['MAX_COLORS'].push(c);
        }
    }
}
var DevilIllusionAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    var max_colors = VAR['MAX_COLORS'];
    COUNT_FACTOR['DevilIllusion'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    if( max_colors.indexOf(color) >= 0 ){
        COUNT_FACTOR['DevilIllusionBelong'+direct] = {
            factor    : function( member, member_place ){ return 1.4; },
            prob      : 1,
            condition : function( member, member_place ){
                if( member['color'] == color ){ return true; }
                return false;
            },
        };
    }else{
        for( var c of max_colors){
            COUNT_BELONG_COLOR[c][color] += 0.5;
        }
    }
}
var DevilIllusionPlusAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    var max_colors = VAR['MAX_COLORS'];
    COUNT_FACTOR['DevilIllusion'+direct] = {
        factor    : function( member, member_place ){ return 3.5; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    if( max_colors.indexOf(color) >= 0 ){
        COUNT_FACTOR['DevilIllusionBelong'+direct] = {
            factor    : function( member, member_place ){ return 1.4; },
            prob      : 1,
            condition : function( member, member_place ){
                if( member['color'] == color ){ return true; }
                return false;
            },
        };
    }else{
        for( var c of max_colors){
            COUNT_BELONG_COLOR[c][color] += 0.5;
        }
    }
}

//==============================================================
// DevilCircle
//==============================================================
var DevilCircleSetting = function( MEMBER ){
    TIME_LIMIT += 1;
    $('#timeRange').val( TIME_LIMIT );
    return {
        COLOR : MEMBER['color']
    };
}
var DevilCircleAttack = function( VAR, direct ){
    var color = VAR['COLOR'];
    COUNT_FACTOR['DevilCircle'+direct] = {
        factor    : function( member, member_place ){ return 3; },
        prob      : 1,
        condition : function( member, member_place ){
            if( member['color'] == color ){ return true; }
            return false;
        },
    };
    COUNT_FACTOR['DevilCircle5Set'+direct] = {
        factor    : function( member, member_place ){ return 1.5; },
        prob      : 1,
        condition : function( member, member_place ){
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
// ChinaGod
//==============================================================
var ChinaDAttack = function( VAR, direct ){
    COUNT_COMBO_COEFF += 1.25;
}

//==============================================================
// HeartQueen
//==============================================================
var HeartQueenSetting = function( MEMBER ){
    return {
        COLOR : 'h',
        COUNT : 0,
    };
}

//==============================================================
//==============================================================
// Skill Database
//==============================================================
//==============================================================

var LEADER_SKILLS_DATA = {
    NONE : {
        id        : 'NONE',
        preSet    : noneSetting,
    },
    WillPower : {
        id        : 'WillPower',
        preSet    : noneSetting,
    },
    ElementFactor3 : {
        id        : "ElementFactor3",
        attack    : ElementFactor3Attack,
        preSet    : ElementFactor3Setting,
    },
    ElementFactor3_5 : {
        id        : "ElementFactor3_5",
        attack    : ElementFactor3_5Attack,
        preSet    : ElementFactor3_5Setting,
    },
    CHINA_D : {
        id        : "CHINA_D",
        attack    : ChinaDAttack,
        preSet    : noneSetting,
    },
    GREEK : {
        id        : 'GREEK',
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    HEART_QUEEN : {
        id        : 'HEART_QUEEN',
        newItem   : GreekSkill,
        preSet    : HeartQueenSetting,
    },
    COUPLE_F : {
        id        : 'COUPLE_F',
        end       : CoupleEndSkill,
        preSet    : CoupleSetting,
    },
    COUPLE_P : {
        id        : 'COUPLE_P',
        end       : CoupleEndSkill,
        preSet    : CoupleSetting,
    },
    DOLL_HUMAN_DRAGON : {
        id        : 'DOLL_HUMAN_DRAGON',
        attack    : DollHumanDragonAttack,
        preSet    : noneSetting,
    },
    DOLL_HUMAN_BEAST_SPIRIT : {
        id        : 'DOLL_HUMAN_BEAST_SPIRIT',
        attack    : DollHumanBeastSpiritAttack,
        preSet    : noneSetting,
    },
    DOLL_HUMAN_DEVIL_SPIRIT : {
        id        : 'DOLL_HUMAN_DEVIL_SPIRIT',
        attack    : DollHumanDevilSpiritAttack,
        preSet    : noneSetting,
    },
    DOLL_HUMAN_GOD : {
        id        : 'DOLL_HUMAN_GOD',
        attack    : DollHumanGodAttack,
        preSet    : noneSetting,
    },
    TRIBE_BEAST : {
        id        : 'TRIBE_BEAST',
        attack    : TribeBeastAttack,
        preSet    : TribeBeastSetting,
    },
    BABYLON : {
        id        : 'BABYLON',
        newItem   : BabylonSkill,
        attack    : BabylonAttack,
        preSet    : BabylonSetting,
    },
    SWORD_BROTHER : {
        id        : 'SWORD_BROTHER',
        attack    : SwordBrotherAttack,
        preSet    : noneSetting,
    },
    COMMON_SOURCE_PLUS : {
        id        : 'COMMON_SOURCE_PLUS',
        attack    : CommonSourcePlusAttack,
        preSet    : noneSetting,
    },
    LIXIAOYAO : {
        id        : 'LIXIAOYAO',
        attack    : LIXIAOYAOAttack,
        preSet    : LIXIAOYAOSetting,
    },
    WATER_FAIRY : {
        id        : 'WATER_FAIRY',
        attack    : WaterFairyAttack,
        preSet    : WaterFairySetting,
    },
    DARK_LUCIFER : {
        id        : 'DARK_LUCIFER',
        newItem   : BabylonSkill,
        attack    : DarkLuciferAttack,
        preSet    : DarkLuciferSetting,        
    },
    DEVIL_ILLUSION : {
        id        : 'DEVIL_ILLUSION',
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_ILLUSION_PLUS : {
        id        : 'DEVIL_ILLUSION_PLUS',
        findMaxC  : DevilIllusionFindMaxColor,
        attack    : DevilIllusionPlusAttack,
        preSet    : DevilIllusionSetting,
    },
    DEVIL_CIRCLE : {
        id        : 'DEVIL_CIRCLE',
        attack    : DevilCircleAttack,
        preSet    : DevilCircleSetting,
    },
};