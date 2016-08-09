
//==============================================================
// drag item analysis
//==============================================================
function resetDraggable(){
    $('#BaseCanvas').getLayers( function(layer){
        layer.x = layer.data.TD_INDEX * WIDTH;
        layer.y = layer.data.TR_INDEX * HEIGHT;
    });
    $('#BaseCanvas').getLayers( function(layer){
        layer.dragstart = function(layer, event){
            $('#BaseCanvas').moveLayer(layer, TR_INDEX*TD_INDEX-1);
            layer.opacity = 0.7;
            $('#BaseCanvas').drawLayer(layer);
            countGridPositon(layer);
            if( MAIN_STATE == MAIN_STATE_ENUM.READY ){
                initialMoveWave();
            }
        };
        layer.drag = function(layer){
            if( MAIN_STATE == MAIN_STATE_ENUM.READY ||
                MAIN_STATE == MAIN_STATE_ENUM.TIME_TO_MOVE ||
                MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
                dragPosition(layer);
            }else{ return false; }
        };
        layer.dragstop = function(layer){
            layer.opacity = 1;
            $('#BaseCanvas').drawLayer(layer);
            resetLocus();
            closeCanvas();
            if( MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
                endPosition(layer);
            }
            if( PLAY_TYPE == PLAY_TYPE_ENUM.FREE && MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
                HISTORY.push(null);
                resetDraggable();
                startDragging();
            }else if( PLAY_TYPE == PLAY_TYPE_ENUM.DRAG && MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
                endMoveWave();
            }else{
                resetDraggable();
                startDragging();
            }
        };
    });
    $('#BaseCanvas').drawLayers();
}

function stopDragging(){
    MOVE_OUT_OF_TIME = true;
    $('#BaseCanvas').getLayers( function(layer){
        layer.draggable = false;
        layer.x = layer.data.TD_INDEX * WIDTH;
        layer.y = layer.data.TR_INDEX * HEIGHT;
    });
    $('#BaseCanvas').drawLayers();
}
function startDragging(){
    MOVE_OUT_OF_TIME = false;
    $('#BaseCanvas').getLayers( function(layer){
        layer.draggable = true;
    });
    $('#BaseCanvas').drawLayers();
}

function countGridPositon(layer){
    TD_INDEX = layer.data.TD_INDEX;
    TR_INDEX = layer.data.TR_INDEX;
}

function endPosition(layer){
    layer.x = TD_INDEX*WIDTH;
    layer.y = TR_INDEX*HEIGHT;
    $('#BaseCanvas').drawLayer(layer);
}

function dragPosition(layer){

    var left = Math.max( 0, Math.min( layer.x , WIDTH*(TD_NUM-1) ) );
    var top  = Math.max( 0, Math.min( layer.y , HEIGHT*(TR_NUM-1) ) );
    var left_index = TD_INDEX;
    var top_index  = TR_INDEX;
    var left_vector = (left - (TD_INDEX*WIDTH) )/WIDTH;
    var top_vector  = (top  - (TR_INDEX*HEIGHT))/HEIGHT;
    var abs_left = Math.abs(left_vector);
    var abs_top = Math.abs(top_vector);

    if( abs_left > ACCURACY && abs_top > ACCURACY ){
        left_index += abs_left/left_vector;
        top_index  += abs_top/top_vector;
    }else if( abs_left - Math.max(abs_top-0.25,0) > ACCURACY ){
        left_index += abs_left/left_vector;
    }else if( abs_top - Math.max(abs_left-0.25,0) > ACCURACY ){
        top_index  += abs_top/top_vector;
    }

    if( left_index != TD_INDEX || top_index != TR_INDEX  ){
        if( ( MAIN_STATE == MAIN_STATE_ENUM.READY || MAIN_STATE == MAIN_STATE_ENUM.TIME_TO_MOVE )
            && !MOVE_OUT_OF_TIME ){
            //Maybe used in end attack effect
            newMoveWave();
            MAIN_STATE = MAIN_STATE_ENUM.MOVING;
            HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );

            // start timer
            if( TIME_IS_LIMIT && !TIME_RUNNING ){
                startToRunTimer();
            }

            // start locus
            if( LOCUS ){
                resetLocus();
                LOCUS_STACK.push( TR_INDEX*TD_NUM+TD_INDEX );
            }
        }
        if( PLAY_TYPE == PLAY_TYPE_ENUM.FREE && MAIN_STATE == MAIN_STATE_ENUM.MOVING && 
            HISTORY.slice(-1)[0] == null ){
            HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );   
            // start locus
            if( LOCUS ){
                resetLocus();
                LOCUS_STACK.push( TR_INDEX*TD_NUM+TD_INDEX );
            }         
        }

        var item_goal = $('#BaseCanvas').getLayer( left_index+'_'+top_index );
        console.log( left_index+'_'+top_index );
        if( item_goal ){

            var move_left = layer.data.TD_INDEX - item_goal.data.TD_INDEX;
            var move_top  = layer.data.TR_INDEX - item_goal.data.TR_INDEX;
            layer.data.TD_INDEX = left_index;
            layer.data.TR_INDEX = top_index;
            item_goal.data.TD_INDEX = TD_INDEX;
            item_goal.data.TR_INDEX = TR_INDEX;

            $('#BaseCanvas').animateLayer(
                item_goal.name,
                {
                    x: '+='+move_left*WIDTH,
                    y: '+='+move_top*HEIGHT,
                },
                DRAG_ANIMATE_TIME,
                function(layer){}
            );

            $('#BaseCanvas').setLayer(
                item_goal,
                { name: 'tmp', }
            );
            $('#BaseCanvas').setLayer(
                layer,
                { name: left_index+'_'+top_index, }
            );
            $('#BaseCanvas').setLayer(
                item_goal,
                { name: TD_INDEX+'_'+TR_INDEX, }
            );

        }
        
        TD_INDEX = left_index;
        TR_INDEX = top_index;
        HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );
        HISTORY_SHOW += 1;
        setHistoryShow();

        locusUpdate( TR_INDEX*TD_NUM+TD_INDEX );
        //checkInhibit(td_goal, item_base, item_goal);
    }
}

//==============================================================
// inhibit frozen locus
//==============================================================
function checkInhibit(td_goal, item_base, item_goal){
    if( $(td_goal).children().length > 0 ){
        //檢查風化
        if( $(item_base).attr("inhibit") || $(item_goal).attr("inhibit") ){
            $("#dragContainment tr td img").removeAttr("style");      
            playAudioWrong();
            MOVE_OUT_OF_TIME = true;
            if( !TIME_IS_LIMIT ){
                TIME_RUNNING = false;
                endMoveWave();
            }
        }else if( LOCUS && LOCUS_TYPE == "rot" ){
            var index = LOCUS_STACK.indexOf( HISTORY.slice(-1)[0] );
            if( index >= 0 && index < LOCUS_STACK.length-1 ){
                $("#dragContainment tr td img").removeAttr("style");      
                playAudioWrong();
                MOVE_OUT_OF_TIME = true;
                if( !TIME_IS_LIMIT ){
                    TIME_RUNNING = false;
                    endMoveWave();
                }
            }
        }
    }
}

function frozenUpdate(){
    $("#dragContainment tr td img").each( function() {
        if( $(this).attr("frozen") ){
            var next_frozen = parseInt( $(this).attr("frozen") )+1;
            var item = $(this).attr("item");
            if( next_frozen > 3 ){
                $(this).removeAttr("frozen");
                item = item.substr(0, item.indexOf("i"))+item.substr(item.indexOf("i")+2);
            }else{
                $(this).attr("frozen", next_frozen);
                item = item.substr(0, item.indexOf("i")+1)+next_frozen+item.substr(item.indexOf("i")+2);
            }
            $(this).attr("item", item);
            $(this).attr("src", mapImgSrc(item) );
        }
    });
}

function resetLocus(){
    LOCUS_STACK = [];
    for( var i = 0; i < TR_NUM*TD_NUM; i++ ){
        if( $("#dragContainment tr td").eq(i).children().length > 0 ){
            var imgs = $("#dragContainment tr td").eq(i).find("img");
            imgs.attr('src', mapImgSrc( imgs.attr("item") ) );
        }
    }
    
    if( LOCUS_TYPE == 'fire' || LOCUS_TYPE == 'rot' ){
        resetCanvas();
    }
}

function locusUpdate( id ){
    if( !LOCUS || LOCUS_STACK.length == 0 ){ return; }

    var last = LOCUS_STACK.slice(-1)[0];
    if( LOCUS_TYPE == '_' || LOCUS_TYPE == 'q' ){
        var imgs = $("#dragContainment tr td").eq(last).find("img");
        imgs.attr('src', mapImgSrc( imgs.attr("item")+LOCUS_TYPE ) );

    }else if( LOCUS_TYPE == 'rot' && LOCUS_STACK.length ){
        var startX = parseInt( id%TD_NUM )*WIDTH +WIDTH/2;
        var startY = parseInt( id/TD_NUM )*HEIGHT+HEIGHT/2;
        var goalX  = parseInt( last%TD_NUM ) *WIDTH +WIDTH/2;
        var goalY  = parseInt( last/TD_NUM ) *HEIGHT+HEIGHT/2;

        $('#dragCanvas').drawLine({
            strokeStyle: 'rgba(50, 200, 50, 0.8)',
            strokeWidth: 30,         rounded: true,
            layer: true,
            x1: startX,             y1: startY,
            x2: goalX,              y2: goalY
        });
    }else if( LOCUS_TYPE == 'fire' && LOCUS_STACK.length ){
        var startX = parseInt( id%TD_NUM )*WIDTH +WIDTH/2;
        var startY = parseInt( id/TD_NUM )*HEIGHT+HEIGHT/2;
        var goalX  = parseInt( last%TD_NUM ) *WIDTH +WIDTH/2;
        var goalY  = parseInt( last/TD_NUM ) *HEIGHT+HEIGHT/2;

        $('#dragCanvas').drawLine({
            strokeStyle: 'rgba(200, 0, 50, 0.8)',
            strokeWidth: 30,         rounded: true,
            layer: true,
            x1: startX,             y1: startY,
            x2: goalX,              y2: goalY
        });
    }

    LOCUS_STACK.push(id);
    while( LOCUS_STACK.length > LOCUS_LENGTH ){
        var pop = LOCUS_STACK.shift();

        if( LOCUS_TYPE == '_' || LOCUS_TYPE == 'q' ){
            var imgs = $("#dragContainment tr td").eq(pop).find("img");
            imgs.attr('src', mapImgSrc( imgs.attr("item") ) );
        }else if( LOCUS_TYPE == 'fire' || LOCUS_TYPE == "rot" ){
            $('#dragCanvas').removeLayer(0).drawLayers();
        }
    }

}

//==============================================================
// timer
//==============================================================
function countTimeLimit(){
    if( !TIME_IS_LIMIT ){ return false; }
    TIME_LIMIT = 5;
    if( TIME_FIXED ){
        if( TIME_FIX_LIST.length > 0 ){
            TIME_LIMIT = TIME_FIX_LIST[ TIME_FIX_LIST.length-1 ];
            TIME_FIX_LIST = [];
        }
    }else{
        for( var key in TIME_ADD_LIST ){
            TIME_LIMIT += TIME_ADD_LIST[key];
        }
        for( var key in TIME_MULTI_LIST ){
            TIME_LIMIT *= TIME_MULTI_LIST[key];
        }
    }
    TIME_LIMIT = Math.max( 1, TIME_LIMIT );
    setTimeLimit(TIME_LIMIT);
}
function startToRunTimer(){
    checkAdditionEffectByKey( 'setTime' );
    countTimeLimit();

    START_TIME = new Date().getTime() / 1000;
    TIME_RUNNING = true;
    TIME_INTERVAL = setInterval( function(){ dragTimer(); }, 10);
    switchTimeLifeToTime();
}
function dragTimer(){
    showTime();

    var now = new Date().getTime() / 1000;  
    if( TIME_IS_LIMIT && ( (now - START_TIME) > TIME_LIMIT || MOVE_OUT_OF_TIME )  ){
        MOVE_OUT_OF_TIME = true;
        TIME_RUNNING = false;

        if( MAIN_STATE == MAIN_STATE_ENUM.MOVING ){
            endMoveWave();
        }else{
            checkActiveSkillByKey("end");
            restartMoveWave();
        }
    }
}

//==============================================================
// table color group analysis
//==============================================================
function countColor(){
    //count for straight
    for(var i = 0; i < TD_NUM; i++){
        for(var j = 0; j < TR_NUM; j ++){

            now_id = i+'_'+j;
            layer = $('#BaseCanvas').getLayer( now_id );
            if( !layer ){ continue; }

            var color = layer.data.color;
            var frozen = layer.data.frozen;
            if( frozen && (parseInt(frozen) > 0) ){ continue; } 

            var set = new Set();           
            set.add( now_id );

            while( j < TR_NUM-1 ){
                next_id = i+'_'+(j+1);
                next_layer = $('#BaseCanvas').getLayer( next_id );
                if( !next_layer ){ break; }

                var next_color = next_layer.data.color;
                var next_frozen = next_layer.data.frozen;
                if( next_frozen && (parseInt(next_frozen) > 0) ){ break; }

                if( color && color == next_color ){
                    set.add( next_id );
                    j++;
                }else{
                    break;
                }
            }

            if( set.size >= SET_SIZE[color] ){
                COLOR_SETS[color].push(new Set(set));
                COLOR_SETS_PREPARE[color].push( new Set(set) );
                STRAIGHT_SETS[i].push(new Set(set));
            }
        }
    }
    //count for horizontal
    for(var j = 0; j < TR_NUM; j++){
        for(var i = 0; i < TD_NUM; i ++){

            now_id = i+'_'+j;
            layer = $('#BaseCanvas').getLayer( now_id );
            if( !layer ){ continue; }

            var color = layer.data.color;
            var frozen = layer.data.frozen;
            if( frozen && (parseInt(frozen) > 0) ){ continue; }  

            var set = new Set();         
            set.add( now_id );

            while( i < TD_NUM-1 ){
                next_id = (i+1)+'_'+j;
                next_layer = $('#BaseCanvas').getLayer( next_id );
                if( !next_layer ){ break; }

                var next_color = next_layer.data.color;
                var next_frozen = next_layer.data.frozen;
                if( next_frozen && (parseInt(next_frozen) > 0) ){ break; }

                if( color && color == next_color ){
                    set.add( next_id );
                    i++;
                }else{
                    break;
                }
            }
            if( set.size >= SET_SIZE[color] ){
                COLOR_SETS[color].push(new Set(set));
                COLOR_SETS_PREPARE[color].push(new Set(set));
                HORIZONTAL_SETS[j].push(new Set(set));
            }
        }
    }
}

function countGroup(){
    for(var key in COLOR_SETS_PREPARE){        
        while( COLOR_SETS_PREPARE[ key ].length > 0 ){
            var set = COLOR_SETS_PREPARE[ key ].pop();
            var setArr = Array.from(set);
            for(var id of setArr){
                Idx_i = parseInt( id.split('_')[0] );
                Idx_j = parseInt( id.split('_')[1] );

                for(var already_set of GROUP_SETS_PREPARE[ key ] ){
                    if(   already_set.has(id)                                          ||
                        ( already_set.has( (Idx_i+1)+'_'+Idx_j ) && Idx_i < TD_NUM-1 ) ||
                        ( already_set.has( (Idx_i-1)+'_'+Idx_j ) && Idx_i > 0        ) ||
                        ( already_set.has( Idx_i+'_'+(Idx_j+1) ) && Idx_j < TR_NUM-1 ) ||
                        ( already_set.has( Idx_i+'_'+(Idx_j-1) ) && Idx_j > 0        )    ){
                        for(var already_i of already_set){
                            set.add(already_i);
                        }
                        GROUP_SETS_PREPARE[ key ].splice( GROUP_SETS_PREPARE[ key ].indexOf( already_set ), 1);
                    }
                }
            }

            GROUP_SETS_PREPARE[ key ].push(set);
        }
    }

    for( var key in GROUP_SETS_PREPARE ){
        for( var set of GROUP_SETS_PREPARE[ key ] ){
            if( set.size >= GROUP_SIZE[key] ){
                GROUP_SETS[ key ].push(set);
            }
        }
    }

    ALL_GROUP_SET_STACK.push({
        'GROUP_SETS'        : GROUP_SETS,
        'STRAIGHT_SETS'     : STRAIGHT_SETS,
        'HORIZONTAL_SETS'   : HORIZONTAL_SETS
    });
}

function countComboStack(){
    var num = 0;
    for(var color in GROUP_SETS){
        num += GROUP_SETS[color].length;
        for(var set of GROUP_SETS[color]){
            var strong_amount = 0;
            for(var id of set){
                layer = $('#BaseCanvas').getLayer( id );
                strong = layer.data.strong;
                if( strong && parseInt( strong ) > 0 ){
                    strong_amount += 1;
                }
            }

            var combo = {
                color         : color,
                drop_wave     : DROP_WAVES,
                amount        : set.size,
                strong_amount : strong_amount,
                set           : set,
            }; 

            COMBO_STACK.push(combo);
            COMBO_TIMES += 1;
        }
    }
    return num;
}

//==============================================================
// remove & new group
//==============================================================
function removeGroups(next){
    var i = next;
    for( ; i >= 0; i--){
        var id = IndexToI_J(i);
        if( REMOVE_STACK.indexOf(id) >= 0 ){ continue; }
        var isSet = inGroup(id);
        if( isSet ){
            setTimeout( function(){
                removePeriod(isSet, i-1);
            }, REMOVE_TIME );
            break;
        }
    }
    if( i < 0 ){
        newGroups();
    }
}
function removePeriod(set, next){
    var setArr = Array.from(set);
    var comboSet = makeComboSet( Array.from(set) );
    for(var id of setArr){
        REMOVE_STACK.push(id);
        $('#BaseCanvas').animateLayer(
            id,
            { opacity: 0, },
            FADEOUT_TIME, 
            function(layer){
                $('#BaseCanvas').removeLayer(layer)
        });
    }
    COMBO_SHOW += 1;
    setComboShow();
    addComboSet(comboSet);
    playAudioRemove();

    // greek skill extracombo
    checkTeamSkillByKey( 'extraCombo' );

    setTimeout( function(){
        removeGroups(next-1);
    }, FADEOUT_TIME );
}
function inGroup(id){
    for(var key in GROUP_SETS){
        for(var set of GROUP_SETS[key]){
            if( set.has(id) ){
                return set;
            }
        }
    }
    return false;
}

function newGroups(){

    REMOVE_STACK.sort(function(a, b){return a-b});

    //  希臘/巴比隊長技使用
    checkLeaderSkillByKey( 'newItem' );
    checkTeamSkillByKey( 'newItem' );
    checkAdditionEffectByKey( 'newItem' );

    for(var color in GROUP_SETS){
        for(var set of GROUP_SETS[color]){
            if( set.size >= 5 ){
                var id = selectAndRemoveRandomItemFromArrBySeed( REMOVE_STACK )
                STRONG_STACK[id] = color+'+';
            }
        }
    }
    for(var i = 0; i < TD_NUM; i++){
        for(var j = 0; j < TR_NUM; j ++){
            var id = i+'_'+j;
            if( REMOVE_STACK.indexOf(id) >= 0 ){
                if( DROPABLE ){
                    var elements = newElementByID( j*TD_NUM+i );
                    if( elements ){
                        DROP_STACK[i].push( elements );
                    }
                }
            }else if( i in STRONG_STACK ){
                if( DROPABLE ){
                    var elements = newElementByItem(STRONG_STACK[i]);
                    if( elements ){
                        DROP_STACK[i].push( elements );
                    }
                }
            }
        }
    }

    setTimeout( function(){
        DROP_WAVES += 1;
        dropGroups();
    }, REMOVE_TIME);
}

//==============================================================
// drop new element from stack
//==============================================================
function dropGroups(){

    for(var i = 0; i < TD_NUM; i++){
        var num = 0;
        var length = DROP_STACK[i].length;
        for(var j = TR_NUM-1; j >= 0; j--){
            id = i+'_'+j;
            if( ! $('#BaseCanvas').getLayer(id) ){
                num++;
            }else{
                if( num > 0 ){
                    layer = $('#BaseCanvas').getLayer(id);
                    layer.data.drop = num;
                    layer.data.newTR = parseInt(layer.data.TR_INDEX) + num;
                    layer.data.newName = true;
                }
            }
        }
        for(var n = 0; n < length; n++){
            var itemData = DROP_STACK[i].pop();
            itemData.TD_INDEX = i;
            itemData.TR_INDEX = n+num-length;
            itemData.drop = num;
            itemData.newTR = n+num-length;
            itemData.newName = true;
            drawItemLayerAtXY( i*WIDTH, -(length-n)*HEIGHT, i, 'add'+n, itemData );
        }
    }
    
    var max_drop = 0;
    $('#BaseCanvas').getLayers( function(layer){
        if( layer.data.drop ){
            max_drop = Math.max( parseInt(layer.data.drop), max_drop );
            $('#BaseCanvas').animateLayer(
                layer,
                { y: '+='+parseInt(layer.data.drop)*HEIGHT, },
                parseInt(layer.data.drop)*DROP_TIME,
                function(layer){ 
                    if( layer.data.newName ){
                        checkAndChangeLayerName( layer.data.TD_INDEX+'_'+layer.data.newTR );
                        changeLayerName(layer);
                    }
                    delete layer.data.drop;
                }
            );
        }
    });

    setTimeout( function(){
        checkGroups();
    }, max_drop*DROP_TIME );
}

function changeLayerName(layer){
    layer.data.TR_INDEX = layer.data.newTR;
    console.log( layer.name+' => '+layer.data.TD_INDEX+'_'+layer.data.newTR );
    $('#BaseCanvas').setLayer(
        layer,
        { name: layer.data.TD_INDEX+'_'+layer.data.newTR }
    );
    delete layer.data.newTR;
    delete layer.data.newName;
}
function checkAndChangeLayerName(name){
    if( ! $('#BaseCanvas').getLayer(name) ){ return; }
    layer = $('#BaseCanvas').getLayer(name);
    if( ! layer.data.newName ){ return; }
    checkAndChangeLayerName( layer.data.TD_INDEX+'_'+layer.data.newTR );
    changeLayerName(layer);
}
