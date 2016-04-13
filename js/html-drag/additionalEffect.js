//==============================================================
//==============================================================
// ADDITIONAL EFFECT
//==============================================================
//==============================================================

var BasicEffectSetting = function( place, i, VAR ){
	return {
		ID       : this.id,
		PLACE    : place,
		i        : i,
		COLOR    : VAR['COLOR'],
		TYPE     : VAR['TYPE'],
		DURATION : 1,
	}
};

var DesperateAttack = function(){
    COUNT_FACTOR['DesperateAttack'] = {
        factor    : function( member, member_place ){ 
        	factor = 1 + 2* ( 1- (HEALTH_POINT/TOTAL_HEALTH_POINT) );
        	return factor; 
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
};
//==============================================================
var DragonResonanceSetting = function( place, i, VAR ){
	return {
		ID       : this.id,
		PLACE    : place,
		i        : i,
		COLOR    : VAR['COLOR'],
		TYPE     : "DRAGON",
		DURATION : 2,
	}
};
var DragonResonance = function(){
	var max_attack_base = 0;
	var max_attack_factor = 0;
	var attack_list = [];
	for(var place = 0; place < TD_NUM; place++){
		$.each(ATTACK_STACK, function(i, attack){
			if( attack['place'] == place ){
				if( TEAM_MEMBERS[place]['type'] == 'DRAGON' ){
					attack_list.push(i);
					if( attack['base']*attack['factor'] > max_attack_base*max_attack_factor ){
						max_attack_base = attack['base'];
						max_attack_factor = attack['factor'];
					}
				}
				return false;
			}
		});
	}
	for(var i of attack_list){
		ATTACK_STACK[i]['base'] = max_attack_base;
		ATTACK_STACK[i]['factor'] = max_attack_factor;
	}
}
//==============================================================
var FightSafeAttack = function(){
	console.log(COMBO_STACK.length);
	console.log(countComboAtFirstWave());
	if( countComboAtFirstWave() >= 4 ){
	    COUNT_FACTOR['FightSafeAttack'] = {
	        factor    : function( member, member_place ){ return 2; },
	        prob      : 1,
	        condition : function( member, member_place ){ return true; },
	    };
	}else{
        var recover = {
            type   : "additionalEffect",
            place  : this.variable['PLACE'],
            color  : "h",
            base   : 20000,
            factor : 1,
            log    : "FightSafeRecover",
        };
        RECOVER_STACK.push(recover);
	}
}
var PlaySafeAttack = function(){
	if( countComboAtFirstWave() >= 4 ){
	    COUNT_FACTOR['PlaySafeAttack'] = {
	        factor    : function( member, member_place ){ return 2; },
	        prob      : 1,
	        condition : function( member, member_place ){ return true; },
	    };
	}else{
		COUNT_INJURE_REDUCE *= 0.2;
	}
}
var PlayWildAttack = function(){
	if( countComboAtFirstWave() >= 4 ){
	    COUNT_FACTOR['PlayWildAttack'] = {
	        factor    : function( member, member_place ){ return 2; },
	        prob      : 1,
	        condition : function( member, member_place ){ return true; },
	    };
	}else{
	    $.each(ENEMY, function(e, enemy){
	    	enemy['variable']['DEFENCE'] = 0;
	    });
	}
}
//==============================================================
var HuntingModeAttack = function(){
	var VAR = this.variable;
	COUNT_FACTOR['HuntingModeAttack'] = {
	    factor    : function( member, member_place ){
	    	if( member_place == VAR['PLACE'] || 
	    		(Math.abs(member_place-VAR['PLACE']) == 1 && member['type'] == "BEAST" ) ){ 
	    		return 3; 
	    	}
	    	return 1;
	    },
	    prob      : 1,
	    condition : function( member, member_place ){ return true; },
	};
}
var SavageAttack = function(){
	var VAR = this.variable;
	COUNT_FACTOR['SavageAttack'] = {
	    factor    : function( member, member_place ){
	    	if( member_place == VAR['PLACE'] ){ return 10; }
	    	return 1;
	    },
	    prob      : 1,
	    condition : function( member, member_place ){ return true; },
	};
}
//==============================================================
var BladesSetting = function( place, i, VAR ){
	setTimeLimit( TIME_LIMIT+3 );
	return {
		ID       : this.id,
		PLACE    : place,
		i        : i,
		COLOR    : VAR['COLOR'],
		TYPE     : VAR['TYPE'],
		DURATION : 1,
	}
};
var BladesOfWaterFlameVineAttack = function(){
	var VAR = this.variable;
	if( checkComboColorMaxAmountByConfig({
            ID    : [ VAR['COLOR'] ],
            check : [ '{0}>=6' ],
        }) ){
		COUNT_FACTOR['BladesOf_'+VAR['COLOR']+'_Attack'] = {
		    factor    : function( member, member_place ){ return 1.5; },
		    prob      : 1,
		    condition : function( member, member_place ){ return member['color'] == VAR['COLOR']; },
		};
	}
}
var BladesOfLightPhantomAttack = function(){
	var VAR = this.variable;
	if( checkComboColorAmountByConfig({
            ID    : [ 'l', 'd', 'h' ] ,
            check : [ '{0}>0', '{1}>0', '{2}>0' ],
        }) ){
		COUNT_FACTOR['BladesOf_'+VAR['COLOR']+'_Attack'] = {
		    factor    : function( member, member_place ){ return 1.5; },
		    prob      : 1,
		    condition : function( member, member_place ){ return member['color'] == VAR['COLOR']; },
		};
	}
}
var BladesEndEffects = function(){
	setTimeLimit( 5 );
}
//==============================================================
var SpellOfBloodSpiritsEXAttack = function(){
	COUNT_FACTOR['SpellOfBloodSpiritsEXAttack'] = {
		factor    : function( member, member_place ){ return 1.5; },
		prob      : 1,
		condition : function( member, member_place ){ return true; },
	};
}
//==============================================================
var SongOfEmpathyEvilSetting = function( place, i, VAR ){
	setTimeLimit( TIME_LIMIT+3 );
	return {
		ID       : this.id,
		PLACE    : place,
		i        : i,
		COLOR    : VAR['COLOR'],
		TYPE     : VAR['TYPE'],
		DURATION : 1,
	}
};
var SongOfEmpathyEvilEndEffects = function(){
	setTimeLimit( 5 );
}
//==============================================================
var ElementalAssemblyAttack = function(){
	var VAR = this.variable;
	COUNT_FACTOR['ElementalAssembly_'+VAR['COLOR']+'_Attack'] = {
		factor    : function( member, member_place ){
			var variety = 0;
			for(var c in COUNT_AMOUNT){
				if( COUNT_AMOUNT[c] > 0 ){ variety += 1; }
			}
			return 1 + 0.2*variety; 
		},
		prob      : 1,
		condition : function( member, member_place ){ return member['color'] == VAR['COLOR']; },
	};
}
//==============================================================
var MagicStageNewItem = function(){
	if( DROP_WAVES > 0 ){ return; }

    for(var i = 0; i < TD_NUM; i++){
        if( checkFirstStraightByPlace( 4, i ) ){
            for(var id = (TR_NUM-1)*TD_NUM+i; id >= 0; id -= TD_NUM ){
                if( REMOVE_STACK.indexOf(id) >= 0 ){
                    REMOVE_STACK.splice( REMOVE_STACK.indexOf(id), 1 );
                    DROP_STACK[i].push( newElementByItem( this.variable['COLOR'] ) );
                    break;
                }
            }
        }
    }
}

//==============================================================
//==============================================================
// ENEMY EFFECT
//==============================================================
//==============================================================

var BattleFieldSetting = function( place, i, VAR, enemy ){
	return {
		ID       : this.id,
		PLACE    : place,
		i        : i,
		COLOR    : VAR['COLOR'],
		TYPE     : VAR['TYPE'],
		DURATION : 2,
		ENEMY    : enemy,
	}
};
var BattleFieldAttack = function(){
	COUNT_COLOR_FACTOR[ this.variable['COLOR'] ] *= 1.5;
	this.variable['ENEMY']['variable']['COLOR'] = COLOR_EXCLUSIVE[ this.variable['COLOR'] ];
};
//==============================================================
var BlazingCircleSetting = function( place, i, VAR, enemy ){
	enemy['variable']['COOLDOWN'] += 3;
	return {
		ID       : this.id,
		PLACE    : place,
		i        : i,
		COLOR    : VAR['COLOR'],
		TYPE     : VAR['TYPE'],
		DURATION : 3,
		ENEMY    : enemy,
	}
};
var BlazingCircleAttack = function(){
	this.variable['ENEMY']['variable']['COLOR'] = COLOR_EXCLUSIVE[ 'f' ];
};

//==============================================================
//==============================================================
// ADDITIONAL EFFECT DATA
//==============================================================
//==============================================================

// tags : attack增傷類 injureReduce減傷類 defenceReduce破防類 
//        addTimeLimit延時類 setTimeLimit設時類 selfAttack自己增傷
//        changeColor轉屬性類 addCoolDown控場延長CD newItem產珠類

var ADDITIONAL_EFFECT_DATA = {
	DESPERATE_ATTACK : {
		id        : 'DESPERATE_ATTACK',
		attack    : DesperateAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	DRAGON_RESONANCE : {
		id        : 'DESPERATE_ATTACK',
		resonance : DragonResonance,
		preSet    : DragonResonanceSetting,
		tag       : ['attack'],
	},
	FIGHT_SAFE : {
		id        : 'FIGHT_SAFE',
		attack    : FightSafeAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	PLAY_SAFE : {
		id        : 'PLAY_SAFE',
		attack    : PlaySafeAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'injureReduce'],
	},
	PLAY_WILD : {
		id        : 'PLAY_WILD',
		attack    : PlayWildAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack', 'defenceReduce'],
	},
	HUNTING_MODE : {
		id        : 'HUNTING_MODE',
		attack    : HuntingModeAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	SAVAGE_ATTACK : {
		id        : 'SAVAGE_ATTACK',
		attack    : SavageAttack,
		preSet    : BasicEffectSetting,
		tag       : ['selfAttack'],
	},
	BLADES_OF_WATER : {
		id        : 'BLADES_OF_WATER',
		attack    : BladesOfWaterFlameVineAttack,
		endEffect : BladesEndEffects,
		preSet    : BladesSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	BLADES_OF_FLAME : {
		id        : 'BLADES_OF_FLAME',
		attack    : BladesOfWaterFlameVineAttack,
		endEffect : BladesEndEffects,
		preSet    : BladesSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	BLADES_OF_VINE : {
		id        : 'BLADES_OF_VINE',
		attack    : BladesOfWaterFlameVineAttack,
		endEffect : BladesEndEffects,
		preSet    : BladesSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	BLADES_OF_LIGHT : {
		id        : 'BLADES_OF_LIGHT',
		attack    : BladesOfLightPhantomAttack,
		endEffect : BladesEndEffects,
		preSet    : BladesSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	BLADES_OF_PHANTOM : {
		id        : 'BLADES_OF_PHANTOM',
		attack    : BladesOfLightPhantomAttack,
		endEffect : BladesEndEffects,
		preSet    : BladesSetting,
		tag       : ['attack', 'addTimeLimit'],
	},
	SPELL_OF_BLOOD_SPIRITS_EX : {
		id        : 'SPELL_OF_BLOOD_SPIRITS_EX',
		attack    : SpellOfBloodSpiritsEXAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	SONG_OF_EMPATHY_EVIL : {
		id        : 'SONG_OF_EMPATHY_EVIL',
		preSet    : SongOfEmpathyEvilSetting,
		endEffect : SongOfEmpathyEvilEndEffects,
		tag       : ['attack', 'addTimeLimit'],
	},
	ELEMENTAL_ASSEMBLY_W : {
		id        : 'ELEMENTAL_ASSEMBLY_W',
		attack    : ElementalAssemblyAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	ELEMENTAL_ASSEMBLY_F : {
		id        : 'ELEMENTAL_ASSEMBLY_F',
		attack    : ElementalAssemblyAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	ELEMENTAL_ASSEMBLY_P : {
		id        : 'ELEMENTAL_ASSEMBLY_P',
		attack    : ElementalAssemblyAttack,
		preSet    : BasicEffectSetting,
		tag       : ['attack'],
	},
	MAGIC_STAGE_BEAM : {
		id        : 'MAGIC_STAGE_BEAM',
        newItem   : MagicStageNewItem,
		preSet    : BasicEffectSetting,
		tag       : ['newItem'],
	},
	MAGIC_STAGE_GLOOM : {
		id        : 'MAGIC_STAGE_GLOOM',
        newItem   : MagicStageNewItem,
		preSet    : BasicEffectSetting,
		tag       : ['newItem'],
	},
};

var ENEMY_EFFECT_DATA = {
	BATTLEFIELD_P : {
		id        : 'BATTLEFIELD_P',
		attack    : BattleFieldAttack,
		preSet    : BattleFieldSetting,
		tag       : ['changeColor'],
	},
	BLAZING_CIRCLE : {
		id        : 'BLAZING_CIRCLE',
		attack    : BlazingCircleAttack,
		preSet    : BlazingCircleSetting,
		tag       : ['changeColor', 'addCoolDown'],
	}
}

function NewAdditionalEffect( id ){
    var effectObj = $.extend(true, {}, ADDITIONAL_EFFECT_DATA[id]);
    effectObj['variable'] = {};
    return effectObj;
}
function NewEnemyEffect( id ){
    var effectObj = $.extend(true, {}, ENEMY_EFFECT_DATA[id]);
    effectObj['variable'] = {};
    return effectObj;
}

function additionalEffectAdd( effect ){
    ADDITIONAL_EFFECT_STACK.push( effect );
	while( ADDITIONAL_EFFECT_STACK.length > 4 ){
		ADDITIONAL_EFFECT_STACK.splice(0, 1);
	}

    updateAdditionalEffectLabel();
}

function checkAdditionEffectByKey( key ){
    $.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
        if( key in effect ){
            effect[ key ]();
        }
    });    
}
function checkEnemyEffectByKey( key ){
    $.each(ENEMY, function(e, enemy){
        $.each(enemy['variable']['EFFECT'], function(i, effect){
	        if( key in effect ){
	            effect[ key ]();
	        }
    	});
    });
}

function additionalEffectUpdate(){
	var tmp_effect_stack = [];
	$.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
		effect['variable']["DURATION"] -= 1;
		if( effect['variable']["DURATION"] > 0 ){
			tmp_effect_stack.push(effect);
		}else if( 'endEffect' in effect ){
			effect['endEffect']();
		}
	});
	ADDITIONAL_EFFECT_STACK = tmp_effect_stack;
    updateAdditionalEffectLabel();
}
function enemyEffectUpdate(){
    $.each(ENEMY, function(e, enemy){
		var tmp_effect_stack = [];
        $.each(enemy['variable']['EFFECT'], function(i, effect){
			effect['variable']["DURATION"] -= 1;
			if( effect['variable']["DURATION"] > 0 ){
				tmp_effect_stack.push(effect);
			}else if( 'endEffect' in effect ){
				effect['endEffect']();
			}
    	});
    	enemy['variable']['EFFECT'] = tmp_effect_stack;
    });
}