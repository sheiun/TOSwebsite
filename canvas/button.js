
(function(){
    var oldLog = console.log;
    console.log = function (message) {        
        $('#log').append( '\n'+message );
        oldLog.apply(console, arguments);
    };
})();


var CREATE_COLOR = {
    color   : null,
    strong  : null,
    weather : null,
    frozen  : null,
    locking : null,
    reverse : null,
    inhibit : null,
    unknown : null,
};
function setColor(color, button){
    if( CREATE_COLOR.color == color ){
        CREATE_COLOR.color = null;
        $(button).css('background','');
    }else{
        CREATE_COLOR.color = color;
    	$("#ColorSelector button").css('background','');
    	$(button).css('background','#004d66');
    }
}
function setColorAttr(attr, button){
    if( ! CREATE_COLOR[attr] ){
        CREATE_COLOR[attr] = 1;
    	$(button).css('background','#004d66').css('color','white');
    }else{
        CREATE_COLOR[attr] = null;
    	$(button).css('background','').css('color','black');
    }
}
function setColorFrozen(attr, button){
    if( ! CREATE_COLOR[attr] ){
        CREATE_COLOR[attr] = 1;
    	$(button).css('background','#004d66').css('color','white');
    }else if( CREATE_COLOR[attr] < 4 ){
        CREATE_COLOR[attr] = CREATE_COLOR[attr] + 1;
    	$(button).css('background','#004d66').css('color','white');
    	$(button).text( "冰凍珠 "+CREATE_COLOR[attr] );
    }else{
        CREATE_COLOR[attr] = null;
    	$(button).css('background','').css('color','black');
    	$(button).text( "冰凍珠" );
    }
}