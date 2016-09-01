
var BarManager = function(canvas, environment){
    var self = this;

    this.canvas = canvas;
    this.environment = environment;

    this.timeIcon = null;
    this.timeGrad = null;
    this.lifeIcon = null;
    this.lifeGrad = null;

    this.initialize = function(){
        self.canvas.attr('width', self.environment.hNum * BALL_SIZE).attr('height', ICON_SIZE);
        var ctx = self.canvas.get(0).getContext('2d');

        self.timeIcon = new Image();
        self.timeIcon.src = "img/UI/clock.png";
        self.lifeIcon = new Image();
        self.lifeIcon.src = "img/UI/heart.png";
        self.timeGrad = new Image();
        self.timeGrad.src = "img/UI/timeclip.png";
        self.lifeGrad = new Image();
        self.lifeGrad.src = "img/UI/lifeclip.png";
    };
    this.resetTime = function(){
        var ctx = self.canvas.get(0).getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, self.canvas.width(), self.canvas.height());
        
        ctx.fillStyle = "black";;
        ctx.fillRect(ICON_SIZE, 0, self.canvas.width()-ICON_SIZE, self.canvas.height());

        ctx.drawImage(self.timeGrad, ICON_SIZE, 0, self.canvas.width(), ICON_SIZE);
        ctx.drawImage(self.timeIcon, 0, 0, ICON_SIZE, ICON_SIZE);

        ctx.restore();
    };
    this.drawTimeBar = function(fraction){
        var length = ( self.canvas.width()-ICON_SIZE ) * fraction;
        var ctx = self.canvas.get(0).getContext('2d');

        ctx.save();
        ctx.clearRect(0, 0, self.canvas.width(), self.canvas.height());
        
        ctx.fillStyle = "black";;
        ctx.fillRect(ICON_SIZE, 0, self.canvas.width()-ICON_SIZE, self.canvas.height());

        ctx.drawImage(self.timeGrad, 0, 0, length, 32,
                                     ICON_SIZE, 0, length, ICON_SIZE);
        ctx.drawImage(self.timeIcon, 0, 0, ICON_SIZE, ICON_SIZE);

        ctx.restore();
    }
}


var ComboManager = function( scrollbar, comboInfo, historyManager ){
    var self = this;
    this.historyManager = historyManager;

    this.scrollbar = scrollbar;
    this.comboBox  = scrollbar.find("#comboBox");
    this.comboInfo = comboInfo;

    this.moveNum = 0;
    this.comboNum = 0;
    this.extraComboNum = 0;
    this.waveNum = 0;

    this.initialize = function(){
        self.scrollbar.mCustomScrollbar({
            axis  : "y",
            theme : "default"
        });
    };
    this.resetBox = function(){
        self.moveNum = 0;
        self.comboNum = 0;
        self.extraComboNum = 0;
        self.waveNum = 0;

        self.comboInfo.find('span').text('');
        self.comboBox.children().remove();
        self.scrollbar.mCustomScrollbar("update");
    };
    this.addMove = function(){
        ++ self.moveNum;
        self.comboInfo.find('#moveNum').text( self.moveNum );
    }
    this.addComboSet = function( ballPair ){
        ++ self.comboNum;
        self.comboInfo.find('#comboNum').text( self.comboNum );

        var div = $("<div>").addClass("imgComboSet");
        for(var i = 0; i < ballPair.length; i++){
            var image = $("<img>").addClass("comboBox").attr('src', ballPair[i].mapImgSrc());
            div.append(image);
        }
        self.comboBox.append(div.append("<hr>"));
        self.scrollbar.mCustomScrollbar("update");
    }
    this.addWave = function( waveNum ){
        if( waveNum == 0 ){
            self.comboBox.append( $("<div align='center'>首消</div><hr>").addClass("comboLabel") );
        }else if( waveNum == 1 ){
            self.comboBox.append( $("<div align='center'>落消</div><hr>").addClass("comboLabel") );
        }
    };

}