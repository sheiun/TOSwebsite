//==============================================================
// team variable
//==============================================================
var GREEK_LEFT_COUNT  = {'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0};
var GREEK_RIGHT_COUNT = {'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0};
var GREEK_TEAM_COUNT = {'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0};
var COUPLE_RAND_STACK = [];

//==============================================================
// team skill
//==============================================================
function BibleSkill(color){
    for(var i = 0; i < TD_NUM; i++){
        var trigger = false;
        for(var set of STRAIGHT_SETS[i]){
            if( set.size >= 4 ){
                trigger = true;
            }
        }
        if( trigger && DROP_WAVES == 0 ){
            for(var id = (TR_NUM-1)*TD_NUM+i; id >= 0; id -= TD_NUM ){
                if( REMOVE_STACK.indexOf(id) >= 0 ){
                    REMOVE_STACK.splice( REMOVE_STACK.indexOf(id), 1 );
                    DROP_STACK[i].push( newElementByItem( color ) );
                    break;
                }
            }
        }
    }
}

function GreekSkill(color, leader){
    var check_straight = 0;
    var check_horizontal = 0;
    for(var i = 0; i < TD_NUM; i++ ){
        check_straight += STRAIGHT_SETS[i].length;
    }
    for(var i = 0; i < TR_NUM; i++){
        check_horizontal += HORIZONTAL_SETS[i].length;
    }

    var num = 0;
    if(leader == "left"){
        num += GREEK_LEFT_COUNT[color];
    }else if(leader == "right"){
        num += GREEK_RIGHT_COUNT[color];
    }
    for(var set of GROUP_SETS[color]){
        num += set.size;
    }

    while( num >= 3 ){
        num -= 3;
        var rand_i;
        if( COMBO_TIMES == 1 && check_straight == 1 ||
            COMBO_TIMES == 1 && check_horizontal == 1 ){
            console.log(REMOVE_STACK);
            rand_i = Math.floor( Math.random()* ( REMOVE_STACK.length-1 ) );
        }else{
            rand_i = Math.floor( Math.random()*REMOVE_STACK.length );
        }
        var id = REMOVE_STACK[rand_i];
        REMOVE_STACK.splice(rand_i,1);
        STRONG_STACK[id] = color+'+';
    }

    if(leader == "left"){
        GREEK_LEFT_COUNT[color] = num;
    }else if(leader == "right"){
        GREEK_RIGHT_COUNT[color] = num;
    }
}

function TeamGreekSkill(color){
    if( DROP_WAVES == 0 ){
        GREEK_TEAM_COUNT[color] = 0;
    }
    var comboTimes = GREEK_TEAM_COUNT[color];
    for(var key in GROUP_SETS){
        comboTimes += GROUP_SETS[key].length;
    }
    while( comboTimes >= 5 && REMOVE_STACK.length >= 2 ){
        comboTimes -= 5;
        var rand_i = Math.floor( Math.random()*REMOVE_STACK.length );
        var id = REMOVE_STACK[rand_i];
        REMOVE_STACK.splice(rand_i,1);
        STRONG_STACK[id] = color;
        var rand_i = Math.floor( Math.random()*REMOVE_STACK.length );
        var id = REMOVE_STACK[rand_i];
        REMOVE_STACK.splice(rand_i,1);
        STRONG_STACK[id] = color;
    }
    GREEK_TEAM_COUNT[color] = comboTimes;
}

function coupleEndSkill(color){
    var num = 2;
    var ld_stack = getStackOfPanelByColorArr(['l', 'd']);
    for(var i of COUPLE_RAND_STACK){
        if( ld_stack.indexOf(i) >= 0 ){ 
            ld_stack.splice( ld_stack.indexOf(i), 1 );
        }
    }
    var wh_stack = getStackOfPanelByColorArr(['w', 'h']);
    for(var i of COUPLE_RAND_STACK){
        if( wh_stack.indexOf(i) >= 0 ){ 
            wh_stack.splice( wh_stack.indexOf(i), 1 );
        }
    }
    var fp_stack = getStackOfPanelByColorArr(['f', 'p']);
    for(var i of COUPLE_RAND_STACK){
        if( wh_stack.indexOf(i) >= 0 ){ 
            fp_stack.splice( fp_stack.indexOf(i), 1 ); 
        }
    }

    while( num > 0 ){
        num--;
        if( ld_stack.length > 0 ){
            coupleTurnRandToColor(ld_stack, color);
        }else if( wh_stack.length > 0 ){
            coupleTurnRandToColor(wh_stack, color);
        }else if( fp_stack.length > 0 ){
            coupleTurnRandToColor(fp_stack, color);
        }
    }
}

function coupleTurnRandToColor(stack, color){
    var rand_i = Math.floor( Math.random()*stack.length );
    var id = stack[rand_i];
    COUPLE_RAND_STACK.push(id);
    stack.splice(rand_i,1);
    var imgs = $("#dragContainment tr td").eq(id).find("img");
    var item = ($(imgs).attr("src").indexOf("+") >= 0) ? color+"+" : color;
    var hide_items = newElementByItem(item);
    $(hide_items[0]).hide();
    $(hide_items[1]).hide();
    $("#dragContainment tr td").eq(id).find("img").fadeOut( FADEOUT_TIME, function(){
        $(this).remove();
        $("#dragContainment tr td").eq(id).append( hide_items );
        $("#dragContainment tr td").eq(id).find("img").fadeIn( FADEOUT_TIME );
        COUPLE_RAND_STACK = [];
    });
}

function startBrokeBoundary(){
    $('#timeRange').val(10);
    $("#timeLimit").text("限制時間");
    $("#freeDrag").text("一般移動");
    $("#randomPanel").closest("button").prop("disabled", true);
    $("#optionalPanel").closest("button").prop("disabled", true);
    $("#initial").closest("button").prop("disabled", true);
    $("#final").closest("button").prop("disabled", true);
    $("#replay").closest("button").prop("disabled", true);

    MOVE_OUT_OF_TIME = false;
    TIME_LIMIT = 10;
    TIME_IS_LIMIT = true;
    START_TIME = new Date().getTime() / 1000;
    TIME_RUNNING = true;
    TIME_INTERVAL = setInterval( function(){ dragTimer(); }, 10);
    MAIN_STATE = "count";


    $("#dragContainment").attr("td", 6).attr("tr", 8);
    resetHistory();
    resetDropStack();
    resetComboStack();
    resetColors();
    resetBase();
    initialTable();

    for(var i = 3; i < TR_NUM; i++){
        for(var j = 0; j < TD_NUM; j++){
            id = (i-3)*TD_NUM+j;
            if( id < INITIAL_PANEL.length && INITIAL_PANEL[id] ){
                var item = INITIAL_PANEL[id];
                if( item ){
                    $("#dragContainment tr td").eq(i*TD_NUM+j).append( newElementByItem(item) );
                }
            }
        }
    }
    for(var i = 0; i < TD_NUM; i++){
        var num = 0;
        for(var j = TR_NUM-1; j >= 0; j--){
            if( $("#dragContainment tr td").eq(j*TD_NUM+i).children().length == 0 ){
                DROP_STACK[i].push( newElementByID(i) );
                num++;
            }else{
                if( num > 0 ){
                    var imgs = $("#dragContainment tr td").eq(j*TD_NUM+i).find("img").remove();
                    $(imgs).attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP+j*HEIGHT);
                    $("#dragContainment tr td").eq((j+num)*TD_NUM+i).append(imgs);
                }
            }
        }
        var length = DROP_STACK[i].length;
        for(var n = 0; n < length; n++){
            var elements = DROP_STACK[i].pop();
            elements[0].attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP-(length-n)*HEIGHT);
            elements[1].attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP-(length-n)*HEIGHT);
            $("#dragContainment tr td").eq( (n+num-length)*TD_NUM+i ).append(elements);
        }
    }    
    var max_drop = 0;
    $("#dragContainment tr td img").each(function(){
        if( $(this).attr("drop") ){
            max_drop = $(this).attr("drop") > max_drop ? $(this).attr("drop") : max_drop;
            $(this).offset({top: $(this).attr("toTop"), left: $(this).attr("toLeft")});
            $(this).animate({"top": "+="+parseInt($(this).attr("drop"))*HEIGHT+"px" },
                            {duration: parseInt($(this).attr("drop"))*DROP_TIME});
            $(this).removeAttr("drop").removeAttr("toTop").removeAttr("toLeft");
        }
    });
    setTimeout( function(){
        resetDraggable();
        startDragging();
    }, max_drop*DROP_TIME );

    window.scrollTo(0, $("#clock").offset().top);
}

function endBrokeBoundary(){ 
    $('#timeRange').val(5);
    $("#randomPanel").closest("button").prop("disabled", false);
    $("#optionalPanel").closest("button").prop("disabled", false);
    $("#initial").closest("button").prop("disabled", false);
    $("#final").closest("button").prop("disabled", false);
    $("#replay").closest("button").prop("disabled", false);
    $("#dragContainment").attr("td", 6).attr("tr", 5);
    $('#clipboard').attr("data-clipboard-text", "null");
    TIME_LIMIT = 10;
    resetHistory();
    resetBase();
    initialTable();

    for(var i = 0; i < TR_NUM; i++){
        for(var j = 0; j < TD_NUM; j++){
            id = (i+3)*TD_NUM+j;
            if( id < INITIAL_PANEL.length && INITIAL_PANEL[id] ){
                var item = INITIAL_PANEL[id];
                if( item ){
                    $("#dragContainment tr td").eq(i*TD_NUM+j).append( newElementByItem(item) );
                }
            }
        }
    }
    window.scrollTo(0, $("#clock").offset().top-3*HEIGHT);
    checkAttack();
}



//==============================================================
// base skill
//==============================================================
function getStackOfPanelByColor(color){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        if( c == color ){
            stack.push(i);
        }
    }
    return stack;
}
function getStackOfPanelByColorArr(colorArr){
    var stack = [];
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        var c = $("#dragContainment tr td").eq(i).find("img.over").attr("color");
        if( colorArr.indexOf(c) >= 0 ){
            stack.push(i);
        }
    }
    return stack;
}