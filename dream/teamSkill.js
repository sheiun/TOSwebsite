//==============================================================
//==============================================================
// Team Skill Function
//==============================================================
//==============================================================

var BasicTeamSetting = function(leader, friend){}


//==============================================================
// NOBITA
//==============================================================
var NobitaTeamSetting = function(leader, friend){
	this.count = 0;
}
var NobitaTeamBreakColor = function(leader, friend) {
	var SetDeleteBalls = function(ballArray){
		var deletedPairs = new BallPair();
		for(var i = 0; i < ballArray.length; i++ ){
			var ballPosition = ballArray[i];
			if( ballPosition < fieldManager.balls.length &&
				fieldManager.balls[ ballPosition ] != null ) {
				deletedPairs.addBall( fieldManager.balls[ ballPosition ] );
			}
		}
		fieldManager.strategy.deletedWave.info = "TeamSkill";
		fieldManager.strategy.deletedWave.orderDeletePairs.push( deletedPairs );
	}
	var StartDeleteBalls = function(){
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
	 
    var deletedWave = historyManager.deletedInfo.getCurrentWave(); 
	if( this.variable.count == 0 &&  !deletedWave  ){
		this.variable.count = 1;
		var deletedPosition = [2, 7, 12, 17, 22, 27];
		SetDeleteBalls(deletedPosition); 
		StartDeleteBalls();
	}else if( this.variable.count == 1 ){
		this.variable.count = 2;
		var deletedPosition = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
		SetDeleteBalls(deletedPosition); 
		StartDeleteBalls();
	}else if( this.variable.count == 2 ){
		this.variable.count = 3;
		var deletedPosition = [1, 6, 11, 16, 21, 26, 3, 8, 13, 18, 23, 28];
		SetDeleteBalls(deletedPosition); 
		StartDeleteBalls();
	}else if( this.variable.count == 3 ){
		this.variable.count = 4;
		var deletedPosition = [5, 6, 7, 8, 9, 20, 21, 22, 23, 24];
		SetDeleteBalls(deletedPosition); 
		StartDeleteBalls();
	}else if( this.variable.count == 4 ){
		this.variable.count = 5;
		var deletedPosition = [0, 5, 10, 15, 20, 25, 4, 9, 14, 19, 24, 29];
		SetDeleteBalls(deletedPosition); 
		StartDeleteBalls();
	}else if( this.variable.count == 5 ){
		this.variable.count = 6;
		var deletedPosition = [0, 1, 2, 3, 4, 25, 26, 27, 28, 29];
		SetDeleteBalls(deletedPosition); 
		StartDeleteBalls();
	}else if( this.variable.count == 6 ){
		this.variable.count = 7;
		var deletedPosition = [0, 4, 6, 8, 12, 17, 21, 23, 25, 29];
		SetDeleteBalls(deletedPosition); 
		StartDeleteBalls();
	}else{
		this.variable.count = 0;
	}
}

//==============================================================
// DORAEMON
//============================================================== 
var DoreamonTeamNewItem = function(leader, friend){	
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
    if( !deletedWave ){ return; }

    // 首消每串+2, 次消每串+1 +水珠減半
    if ( historyManager.deletedInfo.waveNum == 0 ) {  
    	var num = deletedWave.orderDeletePairs.length * 2;
	    while(num > 0 && environmentManager.dropSpace.emptyPoints.length > 0){
	    	num -= 1;
	        var rand = Math.floor( randomNext() * environmentManager.dropSpace.emptyPoints.length );
	        var point = environmentManager.dropSpace.emptyPoints.splice(rand, 1)[0];
	        environmentManager.dropSpace.fillPoints.push( point );
	        environmentManager.dropSpace.newColors[ point.toText() ] = leader.color+'+';
	    }
    } else {
    	var num = deletedWave.orderDeletePairs.length;
		var leaderColorPairs = deletedWave.colorDeletePairs[ getColorIndex(leader.color) ];
		for(var i = 0; i < leaderColorPairs.length; i++){
			num += (leaderColorPairs[i].balls.length -1) /2;
		}
    	while( num > 0 && environmentManager.dropSpace.emptyPoints.length > 0 ){
    		num -= 1; 
	        var rand = Math.floor( randomNext() * environmentManager.dropSpace.emptyPoints.length );
	        var point = environmentManager.dropSpace.emptyPoints.splice(rand, 1)[0];
	        environmentManager.dropSpace.fillPoints.push( point );
	        environmentManager.dropSpace.newColors[ point.toText() ] = leader.color;
    	}
    }
}

//==============================================================
// SHIZUKA
//==============================================================
var ShizukaTeamSetting = function(leader, friend){
    environmentManager.pairSize[ 'f' ] = 5;
    environmentManager.groupSize[ 'f' ] = 5;
}
var ShizukaTeamNewItem = function(leader, friend){
    var deletedWave = historyManager.deletedInfo.getCurrentWave();
	
    if( deletedWave.colorDeletePairs[ getColorIndex(leader.color) ].length > 0 ){ 
		environmentManager.pairSize[ 'f' ] = 2;
		environmentManager.groupSize[ 'f' ] = 3;
		console.log(environmentManager.pairSize[ 'f' ]);
	}

	var num = 0;
	for(var i = 0; i < deletedWave.orderDeletePairs.length; i++){
		var len = deletedWave.orderDeletePairs[i].balls.length;
		if( len < 4 ){ num += len -1; }
		else if( len < 10 ){ num += len -3; }
		else if( len < 15 ){ num += len -5; }
		else{ num += len * 0.5; }
	}
    while( num > 0 && environmentManager.dropSpace.emptyPoints.length > 0 ){
    	num -= 1; 
	    var rand = Math.floor( randomNext() * environmentManager.dropSpace.emptyPoints.length );
	    var point = environmentManager.dropSpace.emptyPoints.splice(rand, 1)[0];
	    environmentManager.dropSpace.fillPoints.push( point );
	    environmentManager.dropSpace.newColors[ point.toText() ] = leader.color+"+";
    }
}
var ShizukaTeamNewDelete = function(leader, friend) { 
	environmentManager.pairSize[ 'f' ] = 5;
	environmentManager.groupSize[ 'f' ] = 5;
}

//==============================================================
//==============================================================
var TEAM_SKILLS_DATA = {
	findTeamSkills : function(leader, friend){
		var skillArray = new Array();
		
		if( leader.id == friend.id && leader.id.startsWith("NOBITA") ){
			skillArray.push("NOBITA_TEAM");
		}
		if( leader.id == friend.id && leader.id.startsWith("DOREAMON") ){
			skillArray.push("DOREAMON_TEAM");
		}
		if( leader.id == friend.id && leader.id.startsWith("SHIZUKA") ){
			skillArray.push("SHIZUKA_TEAM");
		}

		return skillArray;
	},

	NONE: {
		id: "NONE",
		init: BasicTeamSetting,
	},
	NOBITA_TEAM: {
		id: "NOBITA_TEAM",
		init: NobitaTeamSetting,
		breakColor: NobitaTeamBreakColor,
	}, 
	DOREAMON_TEAM: {
		id: "DOREAMON_TEAM",
		init: BasicTeamSetting,
		newItem: DoreamonTeamNewItem,
	},
	SHIZUKA_TEAM: {
		id: "SHIZUKA_TEAM",
		init: ShizukaTeamSetting,
		newItem: ShizukaTeamNewItem,
		newDelete: ShizukaTeamNewDelete,
	},
};