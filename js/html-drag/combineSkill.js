//==============================================================
//==============================================================
// Combine Skill Function
//==============================================================
//==============================================================

var BasicCombineSkillSetting = function( member, COMBINE ){
	return {
        COLOR    : member['color'],
        TYPE     : member['type'],
        COMBINE  : COMBINE,
	};
}

var BasicCombineSkillCheck = function( trigger_place, trigger_i ){
	var VAR = this.variable;
	return basicFunctionCombineSkillCheck( VAR, trigger_place, trigger_i );
}
function basicFunctionCombineSkillCheck( VAR, trigger_place, trigger_i ){
	for( var key in VAR['COMBINE'] ){
		var place = VAR['COMBINE'][key]['PLACE'];
		var i =  VAR['COMBINE'][key]['i'];
		if( TEAM_ACTIVE_SKILL[place][i]['variable']['COOLDOWN'] != 0 ){
			return false;
		}
	}
	return true;	
}

var EnchantedInjunctionWCheck = function( trigger_place, trigger_i ){
	var VAR = this.variable;
	var check = basicFunctionCombineSkillCheck( VAR, trigger_place, trigger_i );
}
var EnchantedInjunctionWMapping = function(){
	if( checkActiveSkillIDByConfig({
            ID    : [ "RUNE_STRENGTHEN_W", "DESPERATE_ATTACK" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		CombineSkillMapping( 'ENCHANTED_INJUNCTION_W', [ "RUNE_STRENGTHEN_W", "DESPERATE_ATTACK" ] );
	}
}

//==============================================================
//==============================================================
// Combine Skill Database
//==============================================================
//==============================================================

var COMBINE_SKILLS_DATA = {
	ENCHANTED_INJUNCTION_W : {
		id       : 'ENCHANTED_INJUNCTION_W',
		label    : '敕令強化 ‧ 水靈',
		info     : '水符石，火符石與心符石轉化為水強化符石；同時木符石轉化為心強化符石',
		variable : {},
		check    : EnchantedInjunctionWCheck,
		mapping  : EnchantedInjunctionWMapping,
		preSet   : BasicCombineSkillSetting,
	},
};

function NewCombineSkill( id ){
    var activeObj = {};
    for( var key in COMBINE_SKILLS_DATA[id] ){
        activeObj[key] = ACTIVE_SKILLS_DATA[id][key];
    }
    return activeObj;
}

function CombineSkillMapping( combineID, needArr ){
	$.each(TEAM_ACTIVE_SKILL, function(trigger_place, trigger_actives){
		$.each(trigger_actives, function(trigger_i, trigger_active){

			if( needArr.indexOf( trigger_active['id'] ) > 0 ){
				// find each needed active
				var COMBINE = {};
				for( var activeID of needArr ){
					if( activeID == trigger_active['id'] ){
						COMBINE[ activeID ] = { PLACE: trigger_place, i: trigger_i };
					}else{
						// get leftest
					    $.each(TEAM_ACTIVE_SKILL, function(place, actives){
						    $.each(actives, function(i, active){
								if( activeID == active['id'] ){
									COMBINE[ activeID ] = { PLACE: place, i: i };
									return false;
								}
					        });
					    });
					}
				}
				// put combine skill in actives
				var combineSkill = NewCombineSkill( combineID );
				var member = TEAM_MEMBERS[trigger_place];
				combineSkill['variable'] = combineSkill['preSet']( member, COMBINE );
				TEAM_COMBINE_SKILL[trigger_place].push( combineSkill );
			}
		});
	});
}

function triggerCombine(place, i){
    if( TEAM_COMBINE_SKILL.length <= place || TEAM_COMBINE_SKILL[place].length <= i ){
        return false;
    }

    if( TEAM_COMBINE_SKILL[place][i]['check']( place, i ) ){
        triggerCombineByKey( place, i, "startRun" );
        triggerCombineByKey( place, i, "transfer" );
        triggerCombineByKey( place, i, "addEffect" );
    }
    updateActiveCoolDownLabel();
}
function triggerCombineByKey( place, i, key ){
    if( key in TEAM_COMBINE_SKILL[place][i] ){
        TEAM_COMBINE_SKILL[place][i][ key ]( place, i );
    }
}
function checkCombineSkillByKey( key ){
    $.each(TEAM_COMBINE_SKILL, function(place, actives){
        $.each(actives, function(i, active){
            if( key in active ){
                active[ key ]( place, i );
            }
        });
    });    
}