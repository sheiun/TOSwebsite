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
    var useable = checkCombineUseable( VAR['COMBINE'] )
	return useable['check'];
}

//==============================================================
// Enchanted Injunction
//==============================================================
var EnchantedInjunctionWCheck = function( trigger_place, trigger_i ){
	var VAR = this.variable;
    var useable = checkCombineUseable( VAR['COMBINE'] )
	return useable['check'];
}
var EnchantedInjunctionWMapping = function(){
	if( checkActiveSkillIDByConfig({
            ID    : [ "RUNE_STRENGTHEN_W", "DESPERATE_ATTACK" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		combineSkillMapping( 'ENCHANTED_INJUNCTION_W', [ ["RUNE_STRENGTHEN_W"], ["DESPERATE_ATTACK"] ] );
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
		check    : EnchantedInjunctionWCheck,
		mapping  : EnchantedInjunctionWMapping,
		preSet   : BasicCombineSkillSetting,
	},
};

function NewCombineSkill( id ){
    var activeObj = $.extend(true, {}, COMBINE_SKILLS_DATA[id]);
    activeObj['variable'] = {};
    return activeObj;
}

function combineSkillMapping( combineID, needArr ){
	var combine = {};
	$.each(needArr, function(n, needSkills){
		combine[n] = [];
	});

	$.each(TEAM_ACTIVE_SKILL, function(trigger_place, trigger_actives){
		$.each(trigger_actives, function(trigger_i, trigger_active){
			var check = false;
			var needType = -1;
			$.each(needArr, function(n, needSkills){
				if( needSkills.indexOf( trigger_active['id'] ) >= 0 ){
					check = true;
					needType = n;
					return false;
				}
			});
			if( check ){
				combine[needType].push( { ID: trigger_active['id'], PLACE: trigger_place, i: trigger_i } );
			}
		});
	});

	for(var needType in combine){
		for(var location of combine[needType]){
			var id    = location['ID'];
			var place = location['PLACE'];
			var i     = location['i'];
			var check = true;
			var need  = $.extend(true, {}, combine);
			$.each(needArr, function(n, needSkills){
				if( needType == n ){
					need[n] = [ { id: id, PLACE: place, i: i } ];
				}else if( combine[n].length == 0 ){
					check = false;
					return false;
				}
			});
			if( check ){
				var combineSkill = NewCombineSkill( combineID );
				var member = TEAM_MEMBERS[place];
				combineSkill['variable'] = combineSkill['preSet']( member, need );
				TEAM_COMBINE_SKILL[place].push( combineSkill );
			}
		}
	}
}

function triggerCombine(place, i){
    if( TEAM_COMBINE_SKILL.length <= place || TEAM_COMBINE_SKILL[place].length <= i ){
        return false;
    }

    if( TEAM_COMBINE_SKILL[place][i]['check']( place, i ) ){
console.log("check-true");
        triggerCombineByKey( place, i, "startRun" );
        triggerCombineByKey( place, i, "transfer" );
        triggerCombineByKey( place, i, "addEffect" );
    }
    updateActiveCoolDownLabel();
}
function triggerCombineByKey( place, i, key ){
    if( key in TEAM_COMBINE_SKILL[place][i] ){
console.log("trigger-"+key);
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

function checkCombineUseable( COMBINE ){
    var combineCheck = true;
    var locations = {};
    for( var key in COMBINE ){
        var check = false;
        $.each(COMBINE[key], function(i, location){
            var active = TEAM_ACTIVE_SKILL[location.PLACE][location.i];
            if( active['variable']['COOLDOWN'] == 0 ){
                check = true;
                locations[key] = i;
                return false;
            }
        });
        if( !check ){
            combineCheck = false;
            break;
        }
    }

    return {
        check    : combineCheck,
        locations: locations,
    };
}
