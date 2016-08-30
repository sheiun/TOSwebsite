
var HistoryManager = function(){
	var Route = function(){
		this.record     = new Array();
		this.startPoint = new Point();
	}
    var RouteInfo = function(){
    	var self = this;
  	    this.routes = new Array();
  	    this.index  = null;
  	    this.getCurrentRoute = function(){
  	    	if( self.index != null && self.index < self.routes.length ){
  	    		return self.routes[self.index];
  	    	}
  	    	return null;
  	    };
  	    this.nextRoute = function(){
  	    	if( self.index != null && self.index < self.routes.length-1 ){
  	    		++ self.index;
  	    		return true;
  	    	}
  	    	self.index = null;
  	    	return false;
  	    }
    }

	var self = this;

    this.panel = null;
    this.random = 0;

    this.routeInfo = null;
    this.routeInfoString = "";

    this.initialize = function(){};

    this.savePanel = function( balls ){
    	self.panel = new Array();
    	for(var i = 0; i < balls.length; i++){
    		var ball = balls[i];
    		self.panel.push( ball.item );
    	}
    }
    this.saveRouteInfo = function(){
    	self.routeInfoString = "";
    	for(var i = 0; i < self.routeInfo.routes.length; i++){
    		if( i>0 ){ self.routeInfoString += ";"; }
    		self.routeInfoString += self.routeInfo.routes[i].startPoint.getGridX();
    		self.routeInfoString += ",";
    		self.routeInfoString += self.routeInfo.routes[i].startPoint.getGridY();
    		self.routeInfoString += ":";
    		for(var j = 0; j < self.routeInfo.routes[i].record.length; j++){
    			self.routeInfoString += self.routeInfo.routes[i].record[j];
    		}
    	}
    	console.log(self.routeInfoString);
    }

    this.resetRouteInfo = function(){
    	self.routeInfo = new RouteInfo();
    }
    this.startNewRoute = function(point){
    	var route = new Route();
    	route.startPoint = point.clone().toGrid();
		self.routeInfo.routes.push( route );
		self.routeInfo.index = self.routeInfo.routes.length-1;
    }
    this.addRecord = function(direction){
		self.routeInfo.getCurrentRoute().record.push( direction );
    }
	this.getRouteInfo = function(){
		var routeInfo = new RouteInfo();
	    var routesText = self.routeInfoString.split(";");
		for(var i = 0 ; i < routesText.length ; ++ i){
			var pointText = routesText[i].split(':')[0].split(',');
			var routeText = routesText[i].split(':')[1];

    		var route = new Route();
    		route.startPoint = new Point( Number( pointText[0] ), Number( pointText[1] ), true );
			for(var j = 0; j < routeText.length; j++){
				route.record.push( Number( routeText.charAt(j) ) );
			}
			routeInfo.routes.push( route );
		}
		routeInfo.index = 0;
		return routeInfo;
	}


};