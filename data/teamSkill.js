//==============================================================
//==============================================================
// Team Skill Function
//==============================================================
//==============================================================

var BasicTeamSetting = function(leader, friend){}

//==============================================================
// Greek
//==============================================================
var GreekTeamSetting = function(leader, friend){
	this.count = 0;
}
var GreekTeamNewItem = function(leader, friend){	
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }

    // 第一波消除=>新回合重新計算
    if ( historyManager.deletedInfo.waves == 1 ) { this.variable.count = 0; }
    var num = deletedWave.orderDeletePairs.length + this.variable.count;

    while(num >= 5){
    	num -= 5;
        var rand = Math.floor( randomNext() * environmentManager.dropSpace.emptyPoints.length );
        var point = environmentManager.dropSpace.emptyPoints.splice(rand, 1)[0];
        environmentManager.dropSpace.fillPoints.push( point );
        environmentManager.dropSpace.newColors[ point.toText() ] = leader.color+'+';
    }

    this.variable.count = num;
}
//==============================================================
// BABYLON
//==============================================================
var BabylonTeamNewItem = function( leader, friend ){
    if( historyManager.deletedInfo.waveNum != 0 ){ return; }

    for(var x = 0; x < environmentManager.hNum; x++){
        if( checkFirstStraightByPlace( 5, x ) ){
            var newItemNum = 1;
            for(var y = environmentManager.vNum-1; y >= 0 && newItemNum; y--){
                var point = new Point( x, y, true );
                for(var i = 0; i < environmentManager.dropSpace.emptyPoints.length; i++){
                    if( point.toText() == environmentManager.dropSpace.emptyPoints[i].toText() ){
                        environmentManager.dropSpace.emptyPoints.splice( i, 1 );
                        environmentManager.dropSpace.newColors[ point.toText() ] = leader.color;
                        environmentManager.dropSpace.dropStack[ x ].push( leader.color );
                        -- newItemNum;
                        break;
                    }
                }
            }
        }
    }
}
//==============================================================
// OLD_GREEK
//==============================================================
var OldGreekTeamSetting = function(leader, friend){
	this.count = 0;
}
var OldGreekTeamNewItem = function(leader, friend){	
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }

    // 首波每串+1, 次波最多+5
    if ( historyManager.deletedInfo.waveNum == 0 ) { 
    	this.variable.count = 0;
    	var num = deletedWave.orderDeletePairs.length;
	    while(num > 0){
	    	num -= 1;
	        var rand = Math.floor( randomNext() * environmentManager.dropSpace.emptyPoints.length );
	        var point = environmentManager.dropSpace.emptyPoints.splice(rand, 1)[0];
	        environmentManager.dropSpace.fillPoints.push( point );
	        environmentManager.dropSpace.newColors[ point.toText() ] = leader.color;
	    }
    } else {
    	var num = deletedWave.orderDeletePairs.length;
    	while( num > 0 && this.variable.count < 5 ){
    		num -= 1;
    		this.variable.count += 1;
	        var rand = Math.floor( randomNext() * environmentManager.dropSpace.emptyPoints.length );
	        var point = environmentManager.dropSpace.emptyPoints.splice(rand, 1)[0];
	        environmentManager.dropSpace.fillPoints.push( point );
	        environmentManager.dropSpace.newColors[ point.toText() ] = leader.color;
    	}
    }
}
//==============================================================
// FALLEN_HALO
//==============================================================
var FallenHaloBreakColor = function(leader, friend){
    environmentManager.pairSize[ 'h' ] = 1;
    environmentManager.groupSize[ 'h' ] = 1;

    fieldManager.strategy.countDeleteBalls( fieldManager.balls );

    environmentManager.pairSize[ 'h' ] = 3;
    environmentManager.groupSize[ 'h' ] = 3;

    //設定消除珠動畫
    for(var i = 0 ; i < fieldManager.strategy.deletedWave.orderDeletePairs.length ; i++){ 
        var startFrame = DELETE_SPEED;
        for(var j = 0 ; j < fieldManager.strategy.deletedWave.orderDeletePairs[i].balls.length ; j++){
            var ball = fieldManager.strategy.deletedWave.orderDeletePairs[i].balls[j];
            ball.setState( BallState.DELETING );
            ball.frameCountToDelete = startFrame;
        }
    }
}

//==============================================================
// WARLORD
//==============================================================
var WarLordTeamSetting = function(leader, friend){
    environmentManager.colorChangeable = false;
    environmentManager.pairSize[ 'w' ] = 2;
    environmentManager.pairSize[ 'f' ] = 2;
    environmentManager.pairSize[ 'p' ] = 2;
    environmentManager.pairSize[ 'l' ] = 2;
    environmentManager.pairSize[ 'd' ] = 2;
    environmentManager.pairSize[ 'h' ] = 2;
}
//==============================================================
// TABLE_KNIGHT
//==============================================================
var TableKnightBreakColor = function(leader, friend){ 
    environmentManager.pairSize[ leader.color ] = 1;
    environmentManager.groupSize[ leader.color ] = 1;

    fieldManager.strategy.countDeleteBalls( fieldManager.balls );

    environmentManager.pairSize[ leader.color ] = 3;
    environmentManager.groupSize[ leader.color ] = 3;

    //設定消除珠動畫
    for(var i = 0 ; i < fieldManager.strategy.deletedWave.orderDeletePairs.length ; i++){ 
        var startFrame = DELETE_SPEED;
        for(var j = 0 ; j < fieldManager.strategy.deletedWave.orderDeletePairs[i].balls.length ; j++){
            var ball = fieldManager.strategy.deletedWave.orderDeletePairs[i].balls[j];
            ball.setState( BallState.DELETING );
            ball.frameCountToDelete = startFrame;
        }
    }
}
//==============================================================
// DARK_GOLD_MAYA
//==============================================================
var DarkGoldMayaSetting = function(leader, friend){
    environmentManager.colorChangeable = false;
    environmentManager.pairSize[ 'w' ] = 2;
    environmentManager.pairSize[ 'f' ] = 2;
    environmentManager.pairSize[ 'p' ] = 2;
    environmentManager.pairSize[ 'l' ] = 2;
    environmentManager.pairSize[ 'd' ] = 2;
    environmentManager.pairSize[ 'h' ] = 2;
    this.count = 0;
}
var DarkGoldMayaBreakColor = function(leader, friend) {
	if( this.variable.count == 0 ) { 
		this.variable.count += 1;

		var deletedPairs = new BallPair();
		var deletedPosition = [0, 4, 6, 8, 12, 17, 21, 23, 25, 29];
		for(var i = 0; i < deletedPosition.length; i++ ){
			var ballPosition = deletedPosition[i];
			if( ballPosition < fieldManager.balls.length &&
				fieldManager.balls[ ballPosition ] != null ) {
				deletedPairs.addBall( fieldManager.balls[ ballPosition ] );
			}
		}
		fieldManager.strategy.deletedWave.orderDeletePairs.push( deletedPairs );
		console.log(fieldManager.strategy.deletedWave.orderDeletePairs);
	    //設定消除珠動畫
	    for(var i = 0 ; i < fieldManager.strategy.deletedWave.orderDeletePairs.length ; i++){ 
	        var startFrame = DELETE_SPEED;
	        for(var j = 0 ; j < fieldManager.strategy.deletedWave.orderDeletePairs[i].balls.length ; j++){
	            var ball = fieldManager.strategy.deletedWave.orderDeletePairs[i].balls[j];
	            ball.setState( BallState.DELETING );
	            ball.frameCountToDelete = startFrame;
	        }
	    }

	}else{
		this.variable.count = 0;
	}
}

//==============================================================
//==============================================================
var TEAM_SKILLS_DATA = {
	findTeamSkills : function(leader, friend){
		var skillArray = new Array();
		if( leader.id == friend.id && leader.id.startsWith("GREEK") ){
			skillArray.push("GREEK_TEAM");
		}
		if( leader.id == friend.id && leader.id.startsWith("BABYLON") ){
			skillArray.push("BABYLON_TEAM");
		}
		if( leader.id == friend.id && leader.id.startsWith("OLD_GREEK") ){
			skillArray.push("OLD_GREEK_TEAM");
		}
		if( leader.id == friend.id && leader.id.startsWith("FALLEN_HALO") ){
			skillArray.push("FALLEN_HALO_TEAM");
		}
		if( leader.id == friend.id && leader.id == "IMPERIAL_WARLORD_W" ){
			skillArray.push("WARLORD_TEAM");
		}
		if( leader.id == friend.id && leader.id == "TABLE_KNIGHT_L" ){
			skillArray.push("TABLE_KNIGHT_TEAM");
		}
		if( leader.id == friend.id && leader.id == "DARK_GOLD_MAYA" ){
			skillArray.push("DARK_GOLD_MAYA_TEAM");
		}
		return skillArray;
	},

	NONE: {
		id: "NONE",
		init: BasicTeamSetting,
	},
	GREEK_TEAM: {
		id: "GREEK_TEAM",
		init: GreekTeamSetting,
		newItem: GreekTeamNewItem,
	},
	BABYLON_TEAM: {
		id: "BABYLON_TEAM",
		init: BasicTeamSetting,
		newItem: BabylonTeamNewItem,
	},
	OLD_GREEK_TEAM: {
		id: "OLD_GREEK_TEAM",
		init: OldGreekTeamSetting,
		newItem: OldGreekTeamNewItem,
	},
	FALLEN_HALO_TEAM: {
		id: "FALLEN_HALO_TEAM",
		init: BasicTeamSetting,
		breakColor: FallenHaloBreakColor,
	},
	WARLORD_TEAM: {
		id: "WARLORD_TEAM",
		init: WarLordTeamSetting,
	},
	TABLE_KNIGHT_TEAM: {
		id: "TABLE_KNIGHT_TEAM",
		init: BasicTeamSetting,
		breakColor: TableKnightBreakColor,
	},
	DARK_GOLD_MAYA_TEAM: {
		id: "DARK_GOLD_MAYA_TEAM",
		init: DarkGoldMayaSetting,
		breakColor: DarkGoldMayaBreakColor,
	},
};