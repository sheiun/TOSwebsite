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
}

var DesperateAttack = function(){
    COUNT_FACTOR['DesperateAttack'] = {
        factor    : function( member, member_place ){ 
        	factor = 1 + 2* ( 1- (HEALTH_POINT/TOTAL_HEALTH_POINT) );
        	return factor; 
        },
        prob      : 1,
        condition : function( member, member_place ){ return true; },
    };
}

//==============================================================
//==============================================================
// ADDITIONAL EFFECT DATA
//==============================================================
//==============================================================

var ADDITIONAL_EFFECT_DATA = {
	DESPERATE_ATTACK : {
		id       : 'DESPERATE_ATTACK',
        variable : {},
		preSet   : BasicEffectSetting,
		attack   : DesperateAttack,
	},
};

function NewAdditionalEffect( id ){
    var effectObj = {};
    for( var key in ADDITIONAL_EFFECT_DATA[id] ){
        effectObj[key] = ADDITIONAL_EFFECT_DATA[id][key];
    }
    effectObj['variable'] = {};
    return effectObj;
}
function AdditionalEffectAdd( effect ){
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

function AdditionalEffectUpdate(){
	var tmp_effect_stack = [];
	$.each(ADDITIONAL_EFFECT_STACK, function(i, effect){
		effect['variable']["DURATION"] -= 1;
		if( effect['variable']["DURATION"] > 0 ){
			tmp_effect_stack.push(effect);
		}
	});
	ADDITIONAL_EFFECT_STACK = tmp_effect_stack;
    updateAdditionalEffectLabel();
}