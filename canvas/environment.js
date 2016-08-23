
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

	    self.colorProb.fill( new Object() );
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