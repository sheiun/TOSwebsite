
//====================================================
// EDIT MODE
//====================================================
var CREATE_COLOR = {
    color   : null,
    strong  : null,
    weather : null,
    frozen  : null,
    locking : null,
    reverse : null,
    inhibit : null,
    unknown : null,
    phantom : null,
};
function randomPanel(){
    var savedNewDrop = environmentManager.newDrop;
    var savedTeamColors = environmentManager.teamColors;
    var deleteFinished = function(){
        barManager.resetTime();
        comboManager.resetBox();
        historyManager.savePanel( fieldManager.balls );
        historyManager.random = RANDOM;
        historyManager.cleanRouteInfo();

        fieldManager.setStrategy( new FieldStrategyEdit(fieldManager, false) );
        environmentManager.teamColors = savedTeamColors;
        environmentManager.newDrop = savedNewDrop;
        sceneManager.setSkipMode(false);
    }

    environmentManager.resetColorSetting();
    environmentManager.setTeamColorProb();
    fieldManager.reset();
    fieldManager.setStrategy( new FieldStrategyDropDelete( fieldManager, deleteFinished, null, true ) );
    fieldManager.environment.newDrop = true;
    fieldManager.sceneManager.setSkipMode(true);
}
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
function setNewDrop(button){
    if( !environmentManager ){ return; }
    if( !environmentManager.newDrop ){
        environmentManager.newDrop = true;
        $(button).css('background','#004d66').css('color','white');
    }else{
        environmentManager.newDrop = false;
        $(button).css('background','').css('color','black');
    }    
}
function resetRandom(){
    RANDOM = new Date().getTime();
    historyManager.random = RANDOM;
}
function savePanel(saveNum, button){
    if( historyManager.getSettingInfo(saveNum) ){
        $(button).css('background','').css('color','black');
        historyManager.removeSettingInfo(saveNum);
    }else{
        $(button).css('background','#004d66').css('color','white');

        var settingInfo = historyManager.newSettingInfo(saveNum);
        //盤面
        var balls = new Array();
        for(var i = 0; i < fieldManager.balls.length; i++){
            var ball = fieldManager.balls[i];
            if( ball ){ balls.push( ball.item ); }
            else{ balls.push( "" ); }
        }
        settingInfo.panel = balls.join(",");
        settingInfo.random = RANDOM;
        //落珠
        settingInfo.newDrop = environmentManager.newDrop;
        settingInfo.dropMode = dropColorManager.mode;
        settingInfo.optional = dropColorManager.getOptionalColors().join(",");
        //隊伍
    }
}

//====================================================
// MOVE MODE
//====================================================
function setFreeMove(button){
    if( !environmentManager ){ return; }
    if( !environmentManager.freeMove ){
        environmentManager.freeMove = true;
        $(button).css('background','#004d66').css('color','white');
    }else{
        environmentManager.freeMove = false;
        $(button).css('background','').css('color','black');
    } 
}
function setTimeLimit(button){
    if( !environmentManager ){ return; }
    var num = parseInt( $(button).val() );
    num = Math.min( Math.max( num, 1 ), 60 );
    environmentManager.timeLimit = num;
    $(button).val( num );
}
function setTimeLimitUp(button){
    if( !environmentManager ){ return; }
    var num = parseInt( $(button).val() );
    num = Math.min( Math.max( num+1, 1 ), 60 );
    environmentManager.timeLimit = num;
    $(button).val( num );
}
function setTimeLimitDown(button){
    if( !environmentManager ){ return; }
    var num = parseInt( $(button).val() );
    num = Math.min( Math.max( num-1, 1 ), 60 );
    environmentManager.timeLimit = num;
    $(button).val( num );
}
function setInfLocus(button){
    if( !environmentManager ){ return; }
    if( !environmentManager.locusInf ){
        environmentManager.locusInf = true;
        $(button).css('background','#004d66').css('color','white');
    }else{
        environmentManager.locusInf = false;
        $(button).css('background','').css('color','black');
    } 
}
function setLocusMode(button){
    environmentManager.setLocusMode( $(button).val() );
}

function checkPanelLoader(){
    $("#PanelLoader").find("div button").eq(0).prop("disabled", historyManager.getSettingInfo(1)==null );
    $("#PanelLoader").find("div button").eq(1).prop("disabled", historyManager.getSettingInfo(2)==null );
    $("#PanelLoader").find("div button").eq(2).prop("disabled", historyManager.getSettingInfo(3)==null );
}
function randomPanelToMove(){
    var savedNewDrop  = environmentManager.newDrop;
    var deleteFinished = function(){
        barManager.resetTime();
        comboManager.resetBox();
        historyManager.savePanel( fieldManager.balls );
        historyManager.random = RANDOM;
        historyManager.cleanRouteInfo();

        fieldManager.setStrategy( new FieldStrategyMove(fieldManager, false) );
        environmentManager.newDrop = savedNewDrop;
        sceneManager.setSkipMode(false);
    }

    fieldManager.reset();
    fieldManager.setStrategy( new FieldStrategyDropDelete( fieldManager, deleteFinished, null, true ) );
    fieldManager.environment.newDrop = true;
    fieldManager.sceneManager.setSkipMode(true);
}
function loadPanel(saveNum){
    var settingInfo = historyManager.getSettingInfo(saveNum);
    if( !settingInfo ){ return; }

    //盤面
    var balls = settingInfo.panel.split(",");
    for(var i = 0; i < balls.length; i++){
        var item = balls[i];
        var point = new Point( Math.floor( i / environmentManager.vNum ), i % environmentManager.vNum, true );
        if( item ){
            var ball = new Ball( point, item, BALL_SIZE );
            fieldManager.setBallAtPoint( ball, point );
        }else{
            fieldManager.setBallAtPoint( null, point );
        }
    }
    historyManager.savePanel( fieldManager.balls );
    historyManager.cleanRouteInfo();
    //落珠
    environmentManager.newDrop = settingInfo.newDrop;   
    if( environmentManager.newDrop ){
        $("#DropAttrSetting button").eq(0).css('background','#004d66').css('color','white');
    }else{
        $("#DropAttrSetting button").eq(0).css('background','').css('color','black');
    }     

    dropColorManager.mode = settingInfo.dropMode;
    dropColorManager.selector.val(settingInfo.dropMode);
    dropColorManager.selector.selectpicker('refresh');
    if( settingInfo.optional ){        
        dropColorManager.scrollbar.show();
        dropColorManager.optionalList.find("li.option").remove();
        initialOptional = settingInfo.optional.split(",");
        for(var i = 0; i < initialOptional.length; i++){
            dropColorManager.addColor( initialOptional[i] );
        }
    }
    //隊伍

    fieldManager.setStrategy( new FieldStrategyMove(fieldManager, false) );
}

//====================================================
// REPLAY MODE
//====================================================
function stopReplay(button){
    if( !environmentManager ||
        !(fieldManager.strategy instanceof FieldStrategyMove) ){ return; }
    if( !environmentManager.stopReplay ){
        environmentManager.stopReplay = true;
        $(button).css('background','#004d66').css('color','white');
    }else{
        environmentManager.stopReplay = false;
        $(button).css('background','').css('color','black');
    }
}
function showRecord(button){
    if( !environmentManager || gameMode != GAME_MODE.REPLAY ){ return; }
    if( !environmentManager.showRecord ){
        historyManager.parseRecordLines();
        environmentManager.showRecord = true;
        $(button).css('background','#004d66').css('color','white');
    }else{
        environmentManager.showRecord = false;
        $(button).css('background','').css('color','black');
    }
}
function setReplaySpeed(button){
    if( !environmentManager ){ return; }
    var num = parseInt( $(button).val() );
    num = Math.min( Math.max( num, 1 ), 10 );
    environmentManager.replaySpeed = num;
    $(button).val( num );
}
function shareUrl(button){
    var settingInfo = historyManager.newSettingInfo(0);
    //盤面
    settingInfo.panel  = historyManager.panel.join(",");
    settingInfo.route  = historyManager.routeInfoString;
    settingInfo.random = historyManager.random;
    settingInfo.phantom  = environmentManager.phantom;
    //落珠
    settingInfo.newDrop  = environmentManager.newDrop;
    settingInfo.dropMode = dropColorManager.mode;
    settingInfo.optional = dropColorManager.getOptionalColors().join(",");
    //播放
    settingInfo.showRecord = environmentManager.showRecord;
    //隊伍
    settingInfo.team = teamManager.toText();

    var encode = LZString.compressToEncodedURIComponent( JSON.stringify(settingInfo) );
    var url = "?info=" + encode;
    window.open( "canvas.html" + url, "_blank" );
}
function parseUrl(){
    var settingInfoText = LZString.decompressFromEncodedURIComponent( $.url("?info") );
    if( !settingInfoText ){ return; }

    try{        
        var settingInfo = JSON.parse( settingInfoText );
        //盤面
        historyManager.panel = settingInfo.panel.split(",");
        historyManager.routeInfoString = settingInfo.route;
        historyManager.random = settingInfo.random;
        RANDOM = settingInfo.random;
        environmentManager.phantom = settingInfo.phantom;
        //落珠
        environmentManager.newDrop = settingInfo.newDrop;
        if( environmentManager.newDrop ){
            $("#DropAttrSetting button").eq(0).css('background','#004d66').css('color','white');
        }
        environmentManager.showRecord = settingInfo.showRecord;
        if( environmentManager.showRecord ){
            $("#ReplayAttrSetting button").eq(1).css('background','#004d66').css('color','white');
        }

        dropColorManager.mode = settingInfo.dropMode;
        dropColorManager.selector.val(settingInfo.dropMode);
        dropColorManager.selector.selectpicker('refresh');
        if( settingInfo.optional ){        
            dropColorManager.scrollbar.show();
            dropColorManager.optionalList.find("li.option").remove();
            initialOptional = settingInfo.optional.split(",");
            for(var i = 0; i < initialOptional.length; i++){
                dropColorManager.addColor( initialOptional[i] );
            }
        }        
        //隊伍
        teamManager.setTeamFromText( settingInfo.team );

    }catch(e){
        alert(e);
    }
}

//====================================================
// navbar
//====================================================
function scroll_top(){
    $("html, body").animate({ scrollTop: 0 }, "fast");
};
function scroll_bottom(){
    $("html, body").animate({ scrollTop: $(document).height() }, "fast");
};
function hide_navbar(){
    $('nav.navbar-fixed-top').autoHidingNavbar('hide');
}