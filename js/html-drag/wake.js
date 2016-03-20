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
    // wakeVar = "[color,prob]"
    var color = eval(wakeVar)[0];
    if( COLORS.indexOf(color) >= 0 ){
        COLOR_PROB[ place ][ color ] = eval(wakeVar)[1];
    }
}

var StraightAttack = function( wakeVar, place, i ){
    // wakeVar = "[factor,straightSize]"
    var check = false;
    for( var set of ALL_GROUP_SET_STACK[0]['STRAIGHT_SETS'][place] ){
        if( set.size >= eval(wakeVar)[1] ){
            check = true;
        }
    }
    if( check ){
        COUNT_FACTOR['StraightAttack_'+place+'_'+i] = {
            factor    : function( member, membe_place ){
                return eval(wakeVar)[0];
            },
            prob      : 1,
            condition : function( member, membe_place ){
                return true;
            },
        };  
    }  
}

var StraightRecover = function( wakeVar, place, i ){
    // wakeVar = "[factor,straightSize]"
    var check = false;
    for( var set of ALL_GROUP_SET_STACK[0]['STRAIGHT_SETS'][place] ){
        if( set.size >= eval(wakeVar)[1] ){
            check = true;
        }
    }
    if( check ){
        COUNT_RECOVER_FACTOR['StraightRecover_'+place+'_'+i] = {
            factor    : function( member, membe_place ){
                return eval(wakeVar)[0];
            },
            prob      : 1,
            condition : function( member, membe_place ){
                return true;
            },
        };  
    }
}

var StraightHeal = function( wakeVar, place, i ){
    // wakeVar = "[factor,straightSize]"
    var check = false;
    for( var set of ALL_GROUP_SET_STACK[0]['STRAIGHT_SETS'][place] ){
        if( set.size >= eval(wakeVar)[1] ){
            check = true;
        }
    }
    if( check ){
        var recover = {
            place  : place,
            color  : "h",
            base   : TEAM_MEMBERS[place]["recovery"],
            factor : eval(wakeVar)[0],
            log    : "StraightHeal_from_"+place,
        };
        RECOVER_STACK.push(recover);
    }
}

//==============================================================
//==============================================================
// Wake Database
//==============================================================
//==============================================================
var WAKES_DATA = {
    NONE : {
        id        : "NONE",
    },
    H_A_R_INCREASE : {
        id        : "H_A_R_INCREASE",
        preSet    : HealthAttackRecoveryIncrease,
        // wakeVar = "[+health,+attack,+recovery]"
    },
    DROP_INCREASE : {
        id        : "DROP_INCREASE",
        preSet    : DropIncrease,
        // wakeVar = "[color,prob]"
    },
    STRAIGHT_ATTACK : {
        id        : "STRAIGHT_ATTACK",
        attack    : StraightAttack,
        // wakeVar = "[factor,straightSize]"
    },
    STRAIGHT_RECOVER : {
        id        : "STRAIGHT_RECOVER",
        recover   : StraightRecover,
        // wakeVar = "[factor,straightSize]"
    },
    STRAIGHT_HEAL : {
        id        : "STRAIGHT_HEAL",
        recover   : StraightHeal,
        // wakeVar = "[factor,straightSize]"
    },
}