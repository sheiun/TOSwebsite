
var SceneManager = function(element, touchDevice){

    var self = this;
    this.scene = null;
    console.log('sceneManagerField.new.scene');
    this.mouseInfo = new MouseInfo();
    console.log('sceneManagerField.new.MouseInfo');

    this.skipMode = false;
    this.nextScene = null;
    this.element = element;
    console.log('sceneManagerField.new.element');

    this.changeScene = function(scene){
	   this.nextScene = scene;
    };
    // 取得相對(canvas)座標XY
    this.updateMousePoint = function(event){
        var rect = event.target.getBoundingClientRect();
        self.mouseInfo.point.x = event.clientX - rect.left;
        self.mouseInfo.point.y = event.clientY - rect.top;
    };

    //=========================================================
    // 電腦版
    //=========================================================
    this.mouseDown = function (event){
        self.updateMousePoint(event);
        self.mouseInfo.pressed = true;
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
    	}
        return false;
    };
    this.mouseUp = function(event){
        self.updateMousePoint(event);
        self.mouseInfo.pressed = false;
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };
    this.mouseMove = function (event){
        self.updateMousePoint(event);
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };
    this.mouseOut = function(event){
        self.updateMousePoint(event);
        self.mouseInfo.pressed = false;
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };

    //=========================================================
    // 觸控板
    //=========================================================
    this.touchStart = function (){
        var e = event.touches[0];
        self.updateMousePoint(e);
        self.mouseInfo.pressed = true;
    	if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };
    this.touchEnd = function(){
        try{
            self.mouseInfo.pressed = false;
    	    if(self.scene){
    		    self.scene.updateMouseInfo(self.mouseInfo);
            }
            if(touchDevice){
                self.click();
            }
        }catch(e){ alert(e); }
        return false;
    };
    this.touchMove = function (){
        var e = event.touches[0];
        self.updateMousePoint(e);
		if(self.scene){
            self.scene.updateMouseInfo(self.mouseInfo);
        }
        return false;
    };

    this.click = function(event){
        if(self.onCanvasClick)
            self.onCanvasClick();
    };

    //=========================================================
    // 電腦<->觸控 bind 不同function
    //=========================================================
    if( !touchDevice ){
        this.element[0].onmousemove = this.mouseMove;
        this.element[0].onmousedown = this.mouseDown;
        this.element[0].onmouseup = this.mouseUp;
        this.element[0].onmouseout = this.mouseOut;
    }else{
        this.element[0].ontouchmove = this.touchMove;
        this.element[0].ontouchstart = this.touchStart;
        this.element[0].ontouchend = this.touchEnd;
    }
    this.element[0].onclick = this.click;
    console.log('sceneManagerField.touchDevice');
    //=========================================================

	//=========================================================
    // 不斷用 timeInterval update
    //=========================================================
    this.stopInterval = function(){
        clearInterval(self.timerId);
        self.timerId = null;
    };
    this.startInterval = function(skipMode){
        self.skipMode = skipMode;
        clearInterval(self.timerId);
        if(self.skipMode){
            // 直接顯示消除結果的話: 將timeinterval->0
            self.timerId = setInterval(self.timerFunc, 0);
        }else{
            self.timerId = setInterval(self.timerFunc, 33);
        }
    };
    this.timerFunc = function(){
        self.update();
        self.draw();
        ++ self.frameCount;
    };
    this.update = function(){
        self.mouseInfo.lastPressed = self.mouseInfo.pressed;
        if(self.nextScene){
	        if(self.scene){
		        self.scene.finalize();
		        self.scene = null;
	        }
            self.scene = self.nextScene;
            self.nextScene = null;
            self.scene.initialize();
        }
    	if(self.scene){
            self.scene.update();
    	}
    };
    this.draw = function(){
        if(!self.skipMode){
    	    if(self.scene){
    		    self.scene.draw();
    	    }
        }
    };
}


var FieldManager = function(canvas, history, environment){
    var self = this;
    this.canvas         = canvas;
    this.historyManager = history;
    this.environment    = environment;

    this.strategy = new FieldStrategyEdit(self);
    this.mouseInfo  = new MouseInfo();
    this.frameCount = 0;

    this.movingBall = null;
    this.balls      = new Array();
    this.newBalls   = new Array();

    // 待整理
    this.isCtwMode = false;
    this.routeInfos = new Array();
    this.moveNum = 0;
    this.deletedColors = new Array(6);
    this.slantMove = false;
    this.ctwTimeLimit = 30 * 5;
    this.ctwTimer = 0;
    this.ctwTimerStarted = false;

    this.initialize = function(){
        if(self.lastLayout){
            self.reloadByLayout(self.lastLayout);
        }else{
            self.reset();

            /*
            var savedStrategy = fieldScene.strategy;
            self.setStrategy(new FieldStrategyDropDelete(self, true, false));
            // 消し終わったらスキップモードを解除しStrategyを元の状態に戻す
            self.strategy.deleteFinished = function(){
            self.setStrategy(savedStrategy);
            setSkipMode(false);
            };
            // 消去処理は見せないためにスキップモード設定
            setSkipMode(true);*/
        }
        return;
    };
    this.finalize = function(){
        // console.log("FieldScene.finalize");
    };

    this.reset = function(){
        var hNum = self.environment.hNum;
        var vNum = self.environment.vNum;
        self.canvas.attr('width', hNum * BALL_SIZE).attr('height', vNum * BALL_SIZE);
        self.balls = new Array(hNum * vNum);

        for(var x = 0 ; x < hNum ; ++ x){
            for(var y = 0 ; y < vNum ; ++ y){
                var color = self.environment.nextColorAtX(x);
                self.balls[x * vNum + y] = new Ball( new Point(x, y, true), color );
            }
        }
    };
    this.createBall = function(gridX, gridY, color){
        self.balls[gridX + gridY * hNum] = new Ball(self.gridPointToPoint(new Point(gridX, gridY)), color, BALL_SIZE);
    };

    //=========================================================
    // SceneManager update 時會一直call update, updateMouseInfo, draw
    //=========================================================
    this.update = function(){
      self.strategy.update();
      ++ self.frameCount;
    };
    this.updateMouseInfo = function(mouseInfo){
        self.mouseInfo = mouseInfo.clone();
    };
    this.draw = function(){
        // 背景清空
        var ctx = self.canvas.get(0).getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, self.canvas.width(), self.canvas.height());
        ctx.restore();
        // 先畫一般的珠，再畫移動中的珠
        for(var i = 0 ; i < self.balls.length ; ++ i){
            var ball = self.balls[i];
            if( ball != null && ball.state != BallState.MOVING ){
                ball.drawBall( ctx );
            }
        }
        if( self.movingBall != null ){
            self.movingBall.drawBall( ctx );
        }
    };

    //=========================================================
    // Point 和 ball 的交接
    //=========================================================
    this.getBallAtPoint = function(point){
        if( point.getGridX() < 0 || point.getGridX() >= self.hNum || 
            point.getGridY() < 0 || point.getGridY() >= self.vNum ){
            return null;
        }
        return self.balls [point.getGridX() * self.environment.vNum + point.getGridY()];
    };
    this.deleteBallAtPoint = function(point){
        if( point.getGridX() < 0 || point.getGridX() >= self.hNum || 
            point.getGridY() < 0 || point.getGridY() >= self.vNum ){
            return null;
        }
        self.balls[point.getGridX() * self.environment.vNum + point.getGridY()] = null;
    };
    this.setBallAtPoint = function(ball, point){
        if( point.getGridX() < 0 || point.getGridX() >= self.hNum || 
            point.getGridY() < 0 || point.getGridY() >= self.vNum ){
            return null;
        }
        if(ball != null){
            ball.point = point.clone();
        }
        self.balls[point.getGridX() * self.environment.vNum + point.getGridY()] = ball;
    };
    this.getBallPoint = function(ball){
        return ball.point.clone();
    };

};