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
var EnchantedInjunctionSetting = function( member, COMBINE ){
	return {
        COLOR           : member['color'],
        TYPE            : member['type'],
        COMBINE         : COMBINE,
        COLOR_MAIN      : this.config[0],
        COLOR_EXCLUSIVE : this.config[1],
        COLOR_TO_H      : this.config[2],
	};
}
var EnchantedInjunctionCheck = function( place, i ){
	var VAR = this.variable;
    var useable = checkCombineUseable( VAR['COMBINE'] );
	return useable['check'] && 
		checkHasElementByColorArr( [ VAR['COLOR_TO_H'], VAR['COLOR_EXCLUSIVE'], 'h' ] ) &&
		checkHasElementByColorWithoutStrong( VAR['COLOR_MAIN'] );
}
var EnchantedInjunctionTransfer = function( place, i ){
	var VAR = this.variable;
    var useable = checkCombineUseable( VAR['COMBINE'] );
    for(var key in useable['locations']){
    	var i = useable['locations'][key];
    	var location = VAR['COMBINE'][key][i];
    	var action = TEAM_ACTIVE_SKILL[ location.PLACE ][ location.i ];
    	action['variable']['COOLDOWN'] = action['coolDown'];
    }

    for(var id of getStackOfPanelByColorArr( [ VAR['COLOR_MAIN'], VAR['COLOR_EXCLUSIVE'], 'h' ] ) ){
    	turnElementToColorByID( id, VAR['COLOR_MAIN']+"+" );
    }
    for(var id of getStackOfPanelByColor( VAR['COLOR_TO_H'] )){
    	turnElementToColorByID( id, 'h' );
    }
}

var EnchantedInjunctionW_Mapping = function(){
	if( checkActiveSkillIDByConfig({
            ID    : [ "RUNE_STRENGTHEN_W", "DESPERATE_ATTACK" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		combineSkillMapping( 'ENCHANTED_INJUNCTION_W', [ ["RUNE_STRENGTHEN_W"], ["DESPERATE_ATTACK"] ] );
	}
}
var EnchantedInjunctionF_Mapping = function(){
	if( checkActiveSkillIDByConfig({
            ID    : [ "RUNE_STRENGTHEN_F", "DESPERATE_ATTACK" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		combineSkillMapping( 'ENCHANTED_INJUNCTION_F', [ ["RUNE_STRENGTHEN_F"], ["DESPERATE_ATTACK"] ] );
	}
}
var EnchantedInjunctionP_Mapping = function(){
	if( checkActiveSkillIDByConfig({
            ID    : [ "RUNE_STRENGTHEN_P", "DESPERATE_ATTACK" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		combineSkillMapping( 'ENCHANTED_INJUNCTION_P', [ ["RUNE_STRENGTHEN_P"], ["DESPERATE_ATTACK"] ] );
	}
}
var EnchantedInjunctionL_Mapping = function(){
	if( checkActiveSkillIDByConfig({
            ID    : [ "RUNE_STRENGTHEN_L", "DESPERATE_ATTACK" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		combineSkillMapping( 'ENCHANTED_INJUNCTION_L', [ ["RUNE_STRENGTHEN_L"], ["DESPERATE_ATTACK"] ] );
	}
}
var EnchantedInjunctionD_Mapping = function(){
	if( checkActiveSkillIDByConfig({
            ID    : [ "RUNE_STRENGTHEN_D", "DESPERATE_ATTACK" ],
            check : [ "{0}>0", "{1}>0" ],
        }) ){
		combineSkillMapping( 'ENCHANTED_INJUNCTION_D', [ ["RUNE_STRENGTHEN_D"], ["DESPERATE_ATTACK"] ] );
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
		config   : [ 'w', 'f', 'p' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionW_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
	},
	ENCHANTED_INJUNCTION_F : {
		id       : 'ENCHANTED_INJUNCTION_F',
		label    : '敕令強化 ‧ 火靈',
		info     : '火符石，木符石與心符石轉化為火強化符石；同時水符石轉化為心強化符石',
		config   : [ 'f', 'p', 'w' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionF_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
	},
	ENCHANTED_INJUNCTION_P : {
		id       : 'ENCHANTED_INJUNCTION_P',
		label    : '敕令強化 ‧ 木靈',
		info     : '木符石，水符石與心符石轉化為木強化符石；同時火符石轉化為心強化符石',
		config   : [ 'p', 'w', 'f' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionP_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
	},
	ENCHANTED_INJUNCTION_L : {
		id       : 'ENCHANTED_INJUNCTION_L',
		label    : '敕令強化 ‧ 光靈',
		info     : '光符石，暗符石與心符石轉化為光強化符石；同時火符石轉化為心強化符石',
		config   : [ 'l', 'd', 'f' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionL_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
	},
	ENCHANTED_INJUNCTION_D : {
		id       : 'ENCHANTED_INJUNCTION_D',
		label    : '敕令強化 ‧ 暗靈',
		info     : '暗符石，光符石與心符石轉化為暗強化符石；同時木符石轉化為心強化符石',
		config   : [ 'd', 'l', 'p' ],
		check    : EnchantedInjunctionCheck,
		mapping  : EnchantedInjunctionD_Mapping,
		preSet   : EnchantedInjunctionSetting,
		transfer : EnchantedInjunctionTransfer,
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
