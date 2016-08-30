

var FieldStrategyEmpty = function(field){
    var self = this;
    this.field = field;
    this.initialize = function(){};
    this.finalize = function(){};
    this.update = function(){};
}

//=========================================================
// 編輯盤面
//=========================================================
var FieldStrategyEdit = function(field){
    var self = this;
    this.field = field;
    this.lastSetPoint = null;
    this.lastSetColor = null;
    this.initialize = function(){};
    this.finalize = function(){
        self.field.historyManager.savePanel( self.field.balls );
    };

    //=========================================================
    // 當點下時 -> 被點位置的珠變色
    //=========================================================
    this.update = function(){

        if( self.field.mouseInfo.pressed ){
            var point = self.field.mouseInfo.point.clone();
            var selectedColor = CREATE_COLOR.color;
            var doSet = true;

            // 感覺沒必要做這個防呆處理
            if( self.lastSetPoint != null ){
                if( self.lastSetPoint.getGridX() == point.getGridX() && 
                    self.lastSetPoint.getGridY() == point.getGridY() && 
                    self.lastSetColor            == selectedColor ){
                    doSet = false;
                }
            }
            // 整理color item
            if( !selectedColor ){
                doSet = false;
            }else{
                if( CREATE_COLOR.strong  ){ selectedColor += "+"; }
                if( CREATE_COLOR.inhibit ){ selectedColor += "x"; }
                if( CREATE_COLOR.weather ){ selectedColor += "*"; }
                if( CREATE_COLOR.frozen  ){ selectedColor += "i"+CREATE_COLOR.frozen; }
                if( CREATE_COLOR.locking ){ selectedColor += "k"; }
                if( CREATE_COLOR.unknown ){ selectedColor += "q"; }
                if( CREATE_COLOR.reverse ){ selectedColor += "_"; }
            }

            if( doSet ){
                point.toGrid();
                self.field.deleteBallAtPoint(point);
                var ball = new Ball(point, selectedColor, BALL_SIZE);
                self.field.setBallAtPoint(ball, point);
                self.lastSetPoint = point;
                self.lastSetColor = selectedColor;
            }
        }
    };
};

var FieldStrategyDropDelete = function(field, deleteFinished, dropFinished){
    var Mode = {
        WAITING    :0,
        TRY_DELETE :1,
        DELETING   :2,
        TRY_DROP   :3,
        DROPPING   :4
    };

    var self = this;
    this.field      = field;
    this.frameCount = 0;
    this.mode       = Mode.TRY_DELETE;

    this.deleteFinished = deleteFinished;
    this.dropFinished   = dropFinished;

    this.initialize = function(){ };
    this.finalize = function(){
        self.field.slantMove = false;
    };
    this.update = function(){        
        for(var i = 0; i < self.field.balls.length; ++ i){
            if( self.field.balls[i] ){
                self.field.balls[i].update();
            }
        }
        switch(self.mode){
            case Mode.WAITING    :break;
            case Mode.TRY_DELETE :self.updateTryDelete(); break;
            case Mode.DELETING   :self.updateDeleting();  break;
            case Mode.TRY_DROP   :self.updateTryDrop();   break;
            case Mode.DROPPING   :self.updateDropping();  break;
        }
        ++ self.frameCount;
    };

    this.updateTryDelete = function(){
        // 被消除名單
        var deleteLists = self.countDeleteBalls( self.field.balls );

        if( deleteLists.length == 0 ){
            self.mode = Mode.WAITING;
            self.frameCount = 0;
            if( self.deleteFinished ){
                self.deleteFinished();
            }
            //updateInfo();
        }else{
            for(var i = 0 ; i < deleteLists.length ; i++){
                var startFrame = DELETE_SPEED * (i + 1);
                for(var j = 0 ; j < deleteLists[i].balls.length ; j++){
                    var ball = deleteLists[i].balls[j];
                    ball.setState( BallState.DELETING );
                    ball.frameCountToDelete = startFrame;
                }
            }
            self.mode = Mode.DELETING;
            self.frameCount = 0;
        }
    };
    this.updateDeleting = function(){
        var isAllDeleted = function(){
            for(var i = 0; i < self.field.balls.length; i++){
                if( self.field.balls[i] != null && self.field.balls[i].state == BallState.DELETING ){
                    return false;
                }
            }
            return true;
        };

        if( isAllDeleted() ){
            for(var i = 0; i < self.field.balls.length; i++){
                if( self.field.balls[i] != null && self.field.balls[i].state == BallState.DELETED){
                    self.field.balls[i] = null;
                }
            }
            self.mode = Mode.TRY_DROP;
            self.frameCount = 0;
        }
    };
    this.updateTryDrop = function(){
        // 計算落下距離
        for(var i = 0; i < self.field.environment.hNum; i++){
            var dropGrid = 0;
            for(var j = self.field.environment.vNum-1; j >= 0; j--){
                var ball = self.field.balls[ i * self.field.environment.vNum + j ];
                if( !ball ){
                    dropGrid += 1;
                }else if( dropGrid > 0 ){
                    ball.dropGrid = dropGrid;
                    ball.setState(BallState.DROPPING);
                    ball.frameCountToDropEnd = dropGrid * DROP_SPEED;
                    self.field.balls[ i * self.field.environment.vNum + (j+dropGrid) ] = ball;
                    self.field.balls[ i * self.field.environment.vNum + j ] = null;
                }
            }
            // 新增珠落下
            if( self.field.environment.newDrop && dropGrid > 0 ){
                for(var j = 1; j <= dropGrid; j++){
                    var color = self.field.environment.nextColorAtX(i);
                    var point = new Point(i, -1 * j, true);
                    var ball = new Ball( point, color, BALL_SIZE );
                    ball.dropGrid = dropGrid;
                    ball.setState(BallState.DROPPING);
                    ball.frameCountToDropEnd = dropGrid * DROP_SPEED;
                    self.field.balls[ i * self.field.environment.vNum + (dropGrid-j) ] = ball;
                }
            }
        }

        self.mode = Mode.DROPPING;
        self.frameCount = 0;
    };
    this.updateDropping = function(){        
        var isAllDroped = function(){
            for(var i = 0; i < self.field.balls.length; i++){
                if( self.field.balls[i] != null && self.field.balls[i].state == BallState.DROPPING ){
                    return false;
                }
            }
            return true;
        };

        if( isAllDroped() ){
            self.mode = Mode.TRY_DELETE;
            self.frameCount = 0;
        }
    };

    this.countDeleteBalls = function( balls ){
        var checkBall = function(ball){
            if( !ball || !ball.color ){ return false; }
            if( ball.frozen && ball.frozen > 1 ){ return false; }
            return true;
        }
        var checkConnect = function(ballPair, ball){
            if( !ball || !ball.color || !ballPair.color ){ return false; }
            return ball.color == ballPair.color;
        }
        var checkDelete = function(ballPair, list){
            if( ballPair.balls.length >= self.field.environment.pairSize[ ballPair.color ] ){
                list.push(ballPair);
            }
        }
        var mergePair = function(pair1, pair2){
            for(var i = 0; i < pair2.points.length; i++){
                var check = false;
                for(var j = 0; j < pair1.points.length; j++){
                    if( pair2.points[i].getX() == pair1.points[j].getX() &&
                        pair2.points[i].getY() == pair1.points[j].getY() ){
                        check = true;
                        break;
                    }
                }
                if( !check ){
                    pair1.addBall( pair2.balls[i] );
                }
            }
            pair2.reset();
        }
        var checkOverlap = function(pair1, pair2){
            for(var i = 0; i < pair1.points.length; i++){
                for(var j = 0; j < pair2.points.length; j++){
                    if( ( Math.abs( pair1.points[i].getGridX() - pair2.points[j].getGridX() ) <= 1 &&
                          pair1.points[i].getGridY() == pair2.points[j].getGridY()                    ) ||
                        ( Math.abs( pair1.points[i].getGridY() - pair2.points[j].getGridY() ) <= 1 &&
                          pair1.points[i].getGridX() == pair2.points[j].getGridX()                    ) ){
                        return true;
                    }
                }
            }
            return false;
        }

        var deleteWave = {
            vDeletePairs : new Array(),
            hDeletePairs : new Array(),
            orderDeletePairs : new Array(),
            colorDeletePairs : new Array(self.field.environment.colors.length),
        };
        for(var i = 0; i < self.field.environment.colors.length; i++){
            deleteWave.colorDeletePairs[i] = new Array();
        }

        // vertical
        for(var i =0; i < self.field.environment.hNum; i++ ){
            var pair = new BallPair();

            for(var j =0; j < self.field.environment.vNum; j++ ){
                var ball = balls[i * self.field.environment.vNum + j];

                if( checkBall(ball) ){
                    if( pair.empty() ){
                        pair.addBall( ball );
                        pair.color = ball.color;
                    }else if( checkConnect( pair, ball ) ){
                        pair.addBall( ball );
                    }else{
                        checkDelete(pair, deleteWave.vDeletePairs);
                        pair = new BallPair();
                        pair.addBall( ball );
                        pair.color = ball.color;
                    }
                }else{
                    checkDelete(pair, deleteWave.vDeletePairs);
                    pair = new BallPair();
                }
            }
            checkDelete(pair, deleteWave.vDeletePairs);
        }
        // horizontal
        for(var i =0; i < self.field.environment.vNum; i++ ){
            var pair = new BallPair();

            for(var j =0; j < self.field.environment.hNum; j++ ){
                var ball = balls[j * self.field.environment.vNum + i];

                if( checkBall(ball) ){
                    if( pair.empty() ){
                        pair.addBall( ball );
                        pair.color = ball.color;
                    }else if( checkConnect( pair, ball ) ){
                        pair.addBall( ball );
                    }else{
                        checkDelete(pair, deleteWave.hDeletePairs);
                        pair = new BallPair();
                        pair.addBall( ball );
                        pair.color = ball.color;
                    }
                }else{
                    checkDelete(pair, deleteWave.hDeletePairs);
                    pair = new BallPair();
                }
            }
            checkDelete(pair, deleteWave.hDeletePairs);
        }

        // merge Pairs in color
        for(var i = 0; i < deleteWave.vDeletePairs.length; i++){
            deleteWave.orderDeletePairs.push( deleteWave.vDeletePairs[i] );
        }
        for(var i = 0; i < deleteWave.hDeletePairs.length; i++){
            deleteWave.orderDeletePairs.push( deleteWave.hDeletePairs[i] );
        }
        for(var i = 0; i < deleteWave.orderDeletePairs.length; i++){
            var pair = deleteWave.orderDeletePairs[i];
            var colorIndex = self.field.environment.getColorIndex( pair.color );
            for(var j = 0; j < deleteWave.colorDeletePairs[colorIndex].length; j++ ){
                var savedPair = deleteWave.colorDeletePairs[colorIndex][j];
                if( checkOverlap(pair, savedPair) ){
                    mergePair(pair, savedPair);
                }
            }
            deleteWave.colorDeletePairs[colorIndex].push(pair);
        }

        // remove empty pair
        var tmpArray = new Array();
        for(var i = 0; i < deleteWave.orderDeletePairs.length; i++){
            if( !deleteWave.orderDeletePairs[i].empty() ){
                tmpArray.push( deleteWave.orderDeletePairs[i] );
            }
        }
        deleteWave.orderDeletePairs = tmpArray;
        for(var i = 0; i < deleteWave.colorDeletePairs.length; i++){
            var tmpArray = new Array();
            for(var j = 0; j < deleteWave.colorDeletePairs[i].length; j++ ){
                if( !deleteWave.colorDeletePairs[i][j].empty() ){
                    tmpArray.push( deleteWave.colorDeletePairs[i][j] );
                }
            }
            deleteWave.colorDeletePairs[i] = tmpArray;
        }

        return deleteWave.orderDeletePairs;
    };

}

var FieldStrategyMove = function(field, replay){
    var Mode = {
        WAITING :0,
        MOVING  :1
    };
    var MovingInfo = function( mouseInfo ){
        this.lastMousePoint = mouseInfo.point.clone();
    };

    var self = this;
    this.field = field;
    this.replay = replay;
    this.mode = Mode.WAITING;
    this.modeFrameCount = 0;

    this.replayFrameCount = 0;
    this.replayRouteInfo = null;
    this.replayMouseInfo = null;

    self.lastPoint = null;

    this.initialize = function(){        
        self.field.setHistoryPanel();
        self.field.historyManager.resetRouteInfo();

        //待整理
        /*
        self.field.moveNum = 0;
        self.field.slantMove = false;
        self.field.ctwTimer = 0;
        self.field.ctwTimerStarted = false;
        self.field.routeInfos = new Array();*/
    };
    this.finalize = function(){
        self.field.movingBall = null;
    };
    this.update = function(){
        for(var i = 0 ; i < self.field.balls.length ; ++ i){
            if( self.field.balls[i] != null ){
                self.field.balls[i].update();
            }
        }
        if( self.replay ){
            self.updateReplayMouseInfo();
        }

        switch(self.mode){
            case Mode.WAITING : self.updateWaiting(); break;
            case Mode.MOVING  : self.updateMoving();  break;
        }
        if( self.field.isCtwMode && self.field.ctwTimerStarted ){
            self.field.ctwTimer++;
        }
        ++ self.modeFrameCount;
    };

    this.updateReplayMouseInfo = function(){
        if( self.replayFrameCount == null ){ return; }
        // 路徑設定
        if( self.replayFrameCount == 0 ){
            self.replayMovePrepare();
            self.replayMoveStart();
        }

        // 移動開始
        if(self.replayFrameCount >= 2){
            var routeIndex = Math.floor( (self.replayFrameCount - 2) / MOVE_FRAME);

            if( routeIndex < self.replayRoute.record.length ){
                self.replayMouseInfo.lastPressed = true;
                self.replayMouseInfo.pressed = true;
                // 依照方向移動虛擬滑鼠位置
                self.updateReplayMouseMoveVector( self.replayRoute.record[routeIndex] ); 
            }else{
                self.replayMouseInfo.lastPressed = true;
                self.replayMouseInfo.pressed = false;
                // 設置下一段路徑
                if( self.replayRouteInfo.nextRoute() ){
                    self.replayFrameCount = -1;
                }
            }             
        }

        ++ self.replayFrameCount;
    }
    this.updateWaiting = function(){
        var mouseInfo = self.replay ? self.replayMouseInfo : self.field.mouseInfo;

        if( mouseInfo && mouseInfo.pressed ){
            self.mode = Mode.MOVING;
            self.modeFrameCount = 0;

            self.movingInfo = new MovingInfo( mouseInfo );
            self.field.movingBall = self.field.getBallAtPoint( mouseInfo.point );
            self.field.movingBall.setState( BallState.MOVING );
            self.field.deleteBallAtPoint( mouseInfo.point );
            self.lastPoint = self.field.getBallCenterPoint( self.field.movingBall );

            /* ctwモードの場合はWAITING->MOVINGになった瞬間にタイマーリセット
            if(parent.isCtwMode && !parent.ctwTimerStarted){
                parent.ctwTimer = 0;
                parent.ctwTimerStarted = true;
            }*/

            // 記録
            if( !self.replay ){
                self.field.historyManager.startNewRoute( mouseInfo.point );
            }

        }
        /* 自由移動時間內判定
        var ctwTimeOver = parent.ctwTimer >= parent.ctwTimeLimit;
        if(!recordPlay){
          if(parent.isCtwMode && ctwTimeOver){
            parent.saveRoute();
            parent.setStrategy(new FieldStrategyDropDelete(parent, false, recordPlay));
          }
        }*/
    }
    this.updateMoving = function(){

        var mouseInfo = self.replay ? self.replayMouseInfo : self.field.mouseInfo;

        var mouseMoved = mouseInfo && 
                         mouseInfo.point.getX() != self.movingInfo.lastMousePoint.x || 
                         mouseInfo.point.getY() != self.movingInfo.lastMousePoint.y;
        var mouseReleased = mouseInfo && !mouseInfo.pressed;
        /* CTWモードでは時間切れの場合に強制的にマウスが離された事にする。
        //var ctwTimeOver = parent.ctwTimer >= parent.ctwTimeLimit;
        if(!recordPlay){
            if(parent.isCtwMode && ctwTimeOver){
              mouseMoved = false;
              mouseReleased = true;
            }
        }*/

        if( mouseMoved ){
            // 1. 計算滑鼠移動量
            // 2. 以移動量更動移動珠位置
            // 3. 計算移動珠所在格
            var newPoint  = self.field.getBallCenterPoint( self.field.movingBall );
            var direction = getDirectionByPoints( self.lastPoint, newPoint );
            var angle         = getAngleByPoints( self.lastPoint, self.field.movingBall.point );
            var angleIsSlant  = (angle > (90 * 0) + 45 - 15 && angle < (90 * 0) + 45 + 15) ||
                                (angle > (90 * 1) + 45 - 15 && angle < (90 * 1) + 45 + 15) ||
                                (angle > (90 * 2) + 45 - 15 && angle < (90 * 2) + 45 + 15) ||
                                (angle > (90 * 3) + 45 - 15 && angle < (90 * 3) + 45 + 15);
            var slantMove     = (direction == Direction8.TENKEY_1) || 
                                (direction == Direction8.TENKEY_3) || 
                                (direction == Direction8.TENKEY_7) || 
                                (direction == Direction8.TENKEY_9); 

            self.updateMovingBall( mouseInfo );
            if( self.checkMoveVector( newPoint, direction, angle, angleIsSlant, slantMove ) ){
                self.exchangeBall( newPoint, direction )
            }

        }
        if( mouseReleased ){
            self.field.setBallAtPoint( self.field.movingBall, self.field.getBallCenterPoint( self.field.movingBall ) );
            self.field.movingBall.setState( BallState.NORMAL );
            self.field.movingBall = null;

            self.movingInfo = null;
            self.lastPoint = null;

            self.mode = Mode.WAITING;
            self.modeFrameCount = 0;
            self.field.setStrategy( new FieldStrategyDropDelete(self.field, false, null, null) );
            
            // 記録
            if( !self.replay ){
                self.field.historyManager.saveRouteInfo();
            }

/*          // 「非CTWモード」の場合は再生モード、操作モード共に消去Strategyに
            if(!parent.isCtwMode){
              if(!recordPlay)
                parent.saveRoute();
              parent.setStrategy(new FieldStrategyDropDelete(parent, false, recordPlay));
            }
            // 「CTWモード」の場合は再生モード時は時間切れで消去Strategyに、操作モード時は操作の完了を以て消去Strategyに
            else {
              if(!recordPlay){
                if(ctwTimeOver){
                  parent.saveRoute();
                  parent.setStrategy(new FieldStrategyDropDelete(parent, false, recordPlay));
                }
              }else{
                // 普通に考えるとlastRoute = self.recordRouteIndex == self.recordRouteInfos.length;とするべきだがself.recordRouteIndexは操作再生の処理で一足先にインクリメントされているので。
                var lastRoute = self.recordRouteIndex == self.recordRouteInfos.length;
                console.log(self.recordRouteIndex + "," + self.recordRouteInfos.length);
                if(lastRoute){
                  parent.setStrategy(new FieldStrategyDropDelete(parent, false, recordPlay));
                }
              }
            }

            */
        }
    }

    //===========================================================
    // 計算用
    //===========================================================
    this.replayMovePrepare = function(){console.log('prepare');
        if( !self.replayRouteInfo ){
            self.replayRouteInfo = self.field.historyManager.getRouteInfo();
        }
        self.replayRoute = self.replayRouteInfo.getCurrentRoute();
    }
    this.replayMoveStart = function(){
        self.replayMouseInfo = new MouseInfo();
        self.replayMouseInfo.point = new Point(
            self.replayRoute.startPoint.getX() + BALL_SIZE / 2, 
            self.replayRoute.startPoint.getY() + BALL_SIZE / 2 );
        self.replayMouseInfo.lastPressed = false;
        self.replayMouseInfo.pressed = true;
    }
    this.updateReplayMouseMoveVector = function( direction ){
        switch(direction){
            case Direction8.TENKEY_4: self.replayMouseInfo.point.x -= SPEED; break;
            case Direction8.TENKEY_8: self.replayMouseInfo.point.y -= SPEED; break;
            case Direction8.TENKEY_6: self.replayMouseInfo.point.x += SPEED; break;
            case Direction8.TENKEY_2: self.replayMouseInfo.point.y += SPEED; break;
            case Direction8.TENKEY_1: self.replayMouseInfo.point.x -= SPEED;
                                      self.replayMouseInfo.point.y += SPEED; break;
            case Direction8.TENKEY_3: self.replayMouseInfo.point.x += SPEED;
                                      self.replayMouseInfo.point.y += SPEED; break;
            case Direction8.TENKEY_7: self.replayMouseInfo.point.x -= SPEED;
                                      self.replayMouseInfo.point.y -= SPEED; break;
            case Direction8.TENKEY_9: self.replayMouseInfo.point.x += SPEED;
                                      self.replayMouseInfo.point.y -= SPEED; break;
        }
    }

    this.updateMovingBall = function(mouseInfo){
        var moveVector = new Point( mouseInfo.point.getX() - self.movingInfo.lastMousePoint.getX(), 
                                    mouseInfo.point.getY() - self.movingInfo.lastMousePoint.getY(), false );
        self.movingInfo.lastMousePoint = mouseInfo.point.clone();

        self.field.movingBall.point.x += moveVector.getX();
        self.field.movingBall.point.y += moveVector.getY();
        //範圍限制
        self.field.movingBall.point.x = Math.min( Math.max( self.field.movingBall.point.getX(), 0 ), BALL_SIZE * (self.field.environment.hNum-1) );
        self.field.movingBall.point.y = Math.min( Math.max( self.field.movingBall.point.getY(), 0 ), BALL_SIZE * (self.field.environment.vNum-1) );
    }
    this.checkMoveVector = function( newPoint, direction, angle, angleIsSlant, slantMove ){
        if( self.lastPoint.getGridX() != newPoint.getGridX() || 
            self.lastPoint.getGridY() != newPoint.getGridY() ){
            if( !slantMove && angleIsSlant ){ return false; }
            return true;
        }
        return false; 
    }
    this.exchangeBall = function( newPoint, direction ){
        var ball      = self.field.getBallAtPoint( newPoint );
        self.field.deleteBallAtPoint( newPoint );
        self.field.setBallAtPoint( ball, self.lastPoint );
        self.lastPoint = newPoint.clone();

        // 記録
        if( !self.replay ){
            self.field.historyManager.addRecord( direction );
        }
    }

}