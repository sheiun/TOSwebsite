

var FieldStrategyEmpty = function(feild){
    var self = this;
    this.field = field;
    this.lastSetPoint = null;
    this.lastSetColor = null;
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
    this.finalize = function(){};

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