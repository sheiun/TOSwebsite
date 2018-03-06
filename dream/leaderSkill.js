//==============================================================
//==============================================================
// Skill Function
//==============================================================
//==============================================================

var BasicLeaderSetting = function( member ){}

//==============================================================
// NOBITA
//==============================================================
var NobitaNewItem = function( member, direct ){
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }

	var num = deletedWave.orderDeletePairs.length; 

    while( num > 0 && environmentManager.dropSpace.emptyPoints.length > 0){
        num -= 1;
        var rand = Math.floor( randomNext() * environmentManager.dropSpace.emptyPoints.length );
        var point = environmentManager.dropSpace.emptyPoints.splice(rand, 1)[0]; 
        environmentManager.dropSpace.fillPoints.push( point );
        environmentManager.dropSpace.newColors[ point.toText() ] = 'h+'; 
    }
}
//==============================================================
// DOREAMON
//==============================================================
var DoreamonSetting = function( member ){
    environmentManager.colorChangeable = false;
    environmentManager.pairSize[ 'w' ] = 2;
    environmentManager.pairSize[ 'h' ] = 2;
    environmentManager.groupSize[ 'h' ] = 2;
}

//==============================================================
//==============================================================
// Skill Database
//==============================================================
//==============================================================

var LEADER_SKILLS_DATA = {
    NONE : {
        id        : "NONE",
        label     : "靈魂收割 ‧ 結",
        info      : "當敵方生命力 40% 以下，無視防禦力和屬性，每回合以自身攻擊力 6 倍追打 1 次",
        init      : BasicLeaderSetting,
    },
	NOBITA : {
        id        : "NONE",
        label     : "大雄",
        info      : "大雄",
        init      : BasicLeaderSetting,
		newItem   : NobitaNewItem,
    },
	DOREAMON : {
        id        : "NONE",
        label     : "多啦A夢",
        info      : "多啦A夢",
        init      : DoreamonSetting, 
    },
};
