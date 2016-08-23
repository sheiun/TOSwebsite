
var Point = function(x, y, grid){
    console.log('point.start');

    var self = this;
    if(grid){
        this.x = x * BALL_SIZE;
        this.y = y * BALL_SIZE;
    }else{
        this.x = x;
        this.y = y;
    }

    this.getX = function(){
        return self.x;
    };
    this.getY = function(){
        return self.y;
    };
    this.getGridX = function(){
        return Math.floor( self.x / BALL_SIZE);
    };
    this.getGridY = function(){
        return Math.floor( self.y / BALL_SIZE);
    };
    this.toGrid = function(){
        this.x = Math.floor( self.x / BALL_SIZE) * BALL_SIZE;
        this.y = Math.floor( self.y / BALL_SIZE) * BALL_SIZE;
    };
    this.clone = function(){
        return new Point(self.x, self.y, false);
    };
};

var MouseInfo = function(){
    var self = this;
    console.log('MouseInfo.start');
    this.point = new Point();
    console.log('MouseInfo.point');
    this.lastPressed = false;
    this.pressed = false;
    this.clone = function(){
        var ret = new MouseInfo();
        ret.point = self.point.clone();
        ret.pressed = self.pressed;
        ret.lastPressed = self.lastPressed;
        return ret;
    };
};

var EnvironmentManager = function(){

	var self = this;

    this.hNum = 0;
    this.vNum = 0;

	this.colors          = null;
    this.teamColors      = null;
    this.colorMap        = null;
    this.colorProb       = null;
    this.colorChangeable = true;

    this.initialize = function(){
	    self.hNum = 6;
	    self.vNum = 5;

		self.colors          = ['w', 'f', 'p', 'l', 'd', 'h'];
	    self.teamColors      = new Array(self.hNum);
	    self.colorMap        = {};
	    self.colorProb       = new Array(self.hNum);
	    self.colorChangeable = true;
    console.log('environmentManager.initialize.colorChangeable');

	    //self.colorProb.fill( {} );
	    for(var i = 0; i < self.hNum; i++){
	    	self.colorProb[i] = {};
	    }
    console.log('environmentManager.initialize.fill');
	    self.setTeamColorProb();
    console.log('environmentManager.initialize.setTeamColorProb');
    };
    this.setTeamColorProb = function(){
	    for(var i = 0; i < self.hNum; i++){
	        if( self.colorChangeable ){
	            var team_colors = {}, tmp_colors = {};
	            var prob = 0;
	            var color_len = 0;

	            // 計算出現過哪幾種屬性(有在colorProb直接設定的不用計算)
	            for( var c of self.colors ){
	                if( !(c in self.colorProb[i]) ){
	                    tmp_colors[c] = ( c in tmp_colors ) ? tmp_colors[c]+1 : 1;
	                    color_len++;
	                }
	            }
	            // 像昇華4直接設定落珠率的直接使用
	            for( var c in self.colorProb[i] ){
	                team_colors[c] = prob + self.colorProb[i][c];
	                prob += self.colorProb[i][c];
	            }
	            // 最終的機率是累加
	            var elseProb = 1 - prob;
	            for( var c in tmp_colors ){
	                var c_prob = tmp_colors[c] * ( elseProb / color_len ) ;
	                team_colors[c] = prob + c_prob;
	                prob += c_prob;
	            }

	            self.teamColors[i] = ( team_colors );
	        }else{
	            self.teamColors[i] = ( {'w': 1/6, 'f': 2/6, 'p': 3/6, 
	                                    'l': 4/6, 'd': 5/6, 'h': 6/6 } );
	        }
	    }
    };

    this.nextColorAtX = function(x){
	    var colors = self.teamColors[x];
	    var rand = randomNext();
	    var color = 'w';

	    for( var c in colors ){
	        if( rand <= colors[c] ){
	            color = c;
	            break;
	        }
	    }
	    if( color in self.colorMap ){
	        color = self.colorMap[color];
	    }
	    return color;
	};

};