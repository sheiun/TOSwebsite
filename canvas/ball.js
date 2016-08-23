
var Ball = function(point, item, size){

    var self = this;

    this.state = BallState.NORMAL;
    this.point = point;
    this.color = item[0];
    this.item = item;
    this.size = size;
    this.stateFrameCount = 0;
    this.alpha = 1.0;
    this.frameCountToDelete = 15;
    this.frameCountToDropEnd = 16;
    this.dropGrid = 0;

    this.strong  = item.indexOf('+') >= 0 ? 1 : null;
    this.inhibit = item.indexOf('x') >= 0 ? 1 : null;
    this.locking = item.indexOf('k') >= 0 ? 1 : null;
    this.frozen  = item.indexOf('i') >= 0 ? parseInt( item[ item.indexOf('i') + 1 ] ) : null;
    this.weather = item.indexOf('*') >= 0 ? 1 : null;

    this.setState = function(state){
        self.state = state;
        self.stateFrameCount = 0;
        if(self.state == BallState.MOVING){
            self.alpha = 0.5;
        }else if(self.state == BallState.DELETED){
            self.alpha = 0.0;
        }else{
            self.alpha = 1.0;
        }
    };
    this.update = function(){
        if(self.state == BallState.DELETING){
            if(self.stateFrameCount >= self.frameCountToDelete - 15){
                self.alpha = 1.0 * (self.frameCountToDelete - self.stateFrameCount) / 15.0;
            }
            if(self.stateFrameCount >= self.frameCountToDelete){
                self.setState(BallState.DELETED);
            }
        }
        else if(self.state == BallState.DROPPING){
            self.point.y = self.point.y + (self.size / self.frameCountToDropEnd) * self.dropGrid;
            if(self.stateFrameCount == self.frameCountToDropEnd - 1){
                self.setState(BallState.NORMAL);
            }
        }
        ++ self.stateFrameCount;
    };

    this.drawBall = function(ctx){
        var image = new Image();
        image.src = self.mapImgSrc();
        ctx.save();
        ctx.globalAlpha = self.alpha;
        ctx.drawImage(image, self.point.getX(), self.point.getY(), BALL_SIZE, BALL_SIZE);
        ctx.restore();

        if(self.frozen){
            var frozenImage = new Image();
            frozenImage.src = "img/Icon/i"+self.frozen+".png";
            ctx.drawImage(frozenImage, self.point.getX(), self.point.getY(), BALL_SIZE, BALL_SIZE);
        }
        if(self.weather){
            var weatherImage = new Image();
            weatherImage.src = "img/Icon/+.png";
            ctx.drawImage(weatherImage, self.point.getX(), self.point.getY(), BALL_SIZE, BALL_SIZE);
        }
    };

    this.mapImgSrc = function(){
        var plus     = self.item.indexOf('+') >= 0 ? '+' : '';
        var reverse  = self.item.indexOf('_') >= 0 ? '_' : '';

        if( item.indexOf('x') >= 0 ){
            item = 'x';
        }else if( item.indexOf('q') >= 0 ){
            item = 'q';
        }else if( item.indexOf('k') >= 0 ){
            item = self.color+'k';
        }else{
            item = self.color+plus+reverse ;
        }
        return "img/Icon/"+item+".png";
    }

};




var BALL_SIZE =  80;

var BallState = {
    NORMAL:0,
    MOVING:1,
    DELETING:2,
    DELETED:3
};

var BallColor = {
    RED:0,
    GREEN:1,
    BLUE:2,
    LIGHT:3,
    DARK:4,
    LIFE:5,
    POISON:6,
    OZYAMA:7,
    NUM:8
};

var ImageResource = {
    BALL_WATER         :new Image(),
    BALL_FIRE          :new Image(),
    BALL_PLANT         :new Image(),
    BALL_LIGHT         :new Image(),
    BALL_DARK          :new Image(),
    BALL_HEART         :new Image(),
    BALL_WATER_STRONG  :new Image(),
    BALL_FIRE_STRONG   :new Image(),
    BALL_PLANT_STRONG  :new Image(),
    BALL_LIGHT_STRONG  :new Image(),
    BALL_DARK_STRONG   :new Image(),
    BALL_HEART_STRONG  :new Image(),
    BALL_WATER_REVERSE :new Image(),
    BALL_FIRE_REVERSE  :new Image(),
    BALL_PLANT_REVERSE :new Image(),
    BALL_LIGHT_REVERSE :new Image(),
    BALL_DARK_REVERSE  :new Image(),
    BALL_HEART_REVERSE :new Image(),
    BALL_WATER_LOCK    :new Image(),
    BALL_FIRE_LOCK     :new Image(),
    BALL_PLANT_LOCK    :new Image(),
    BALL_LIGHT_LOCK    :new Image(),
    BALL_DARK_LOCK     :new Image(),
    BALL_HEART_LOCK    :new Image(),
    BALL_ICE_0         :new Image(),
    BALL_ICE_1         :new Image(),
    BALL_ICE_2         :new Image(),
    BALL_ICE_3         :new Image(),
    BALL_UNKNOWN       :new Image(),
    BALL_ICE_0         :new Image(),
};

ImageResource.BALL_WATER.src = "img/Icon/w.png";
ImageResource.BALL_FIRE.src = "img/Icon/f.png";
ImageResource.BALL_PLANT.src = "img/Icon/p.png";
ImageResource.BALL_LIGHT.src = "img/Icon/l.png";
ImageResource.BALL_DARK.src = "img/Icon/d.png";
ImageResource.BALL_HEART.src = "img/Icon/h.png";
ImageResource.BALL_WATER_STRONG.src = "img/Icon/w+.png";
ImageResource.BALL_FIRE_STRONG.src = "img/Icon/f+.png";
ImageResource.BALL_PLANT_STRONG.src = "img/Icon/p+.png";
ImageResource.BALL_LIGHT_STRONG.src = "img/Icon/l+.png";
ImageResource.BALL_DARK_STRONG.src = "img/Icon/d+.png";
ImageResource.BALL_HEART_STRONG.src = "img/Icon/h+.png";
ImageResource.BALL_WATER_REVERSE.src = "img/Icon/w_.png";
ImageResource.BALL_FIRE_REVERSE.src = "img/Icon/f_.png";
ImageResource.BALL_PLANT_REVERSE.src = "img/Icon/p_.png";
ImageResource.BALL_LIGHT_REVERSE.src = "img/Icon/l_.png";
ImageResource.BALL_DARK_REVERSE.src = "img/Icon/d_.png";
ImageResource.BALL_HEART_REVERSE.src = "img/Icon/h_.png";
ImageResource.BALL_WATER_LOCK.src = "img/Icon/wk.png";
ImageResource.BALL_FIRE_LOCK.src = "img/Icon/fk.png";
ImageResource.BALL_PLANT_LOCK.src = "img/Icon/pk.png";
ImageResource.BALL_LIGHT_LOCK.src = "img/Icon/lk.png";
ImageResource.BALL_DARK_LOCK.src = "img/Icon/dk.png";
ImageResource.BALL_HEART_LOCK.src = "img/Icon/hk.png";