
//==============================================================
// BASIC LENGTH
//==============================================================
var WIDTH = 80;
var HEIGHT = 80;

var TR_INDEX;
var TD_INDEX;
var BASE_LEFT;
var BASE_TOP;
var TR_NUM = parseInt( $("#dragContainment").attr("tr") );
var TD_NUM = parseInt( $("#dragContainment").attr("td") );

var ACCURACY = 0.6;

//==============================================================
// GLOBAL VARIABLE
//==============================================================
var COLORS = ['w', 'f', 'p', 'l', 'd', 'h'];
var TEAM_COLORS = [ ];
var CREATE_COLOR = null;

var STRAIGHT_SETS = [];
var HORIZONTAL_SETS = [];
var COLOR_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
var COLOR_SETS_PREPARE = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
var GROUP_SIZE = {'w':3, 'f':3, 'p':3, 'l':3, 'd':3, 'h':3};
var GROUP_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
var COLOR_RANDOM = Math.floor( Math.random() * 1000 );
var MAX_AUTO_DROP_TIMES = 100;

var REMOVE_STACK = [];
var STRONG_STACK = {};
var DROP_STACK = [];
var DROP_WAVES = 0;
var COMBO_TIMES = 0;
var COMBO_STACK = [];
var COMBO_SHOW = 0;
var HISTORY_SHOW = 0;
var HISTORY_RANDOM = COLOR_RANDOM;
var HISTORY_SKILL_VARIABLE;

var DRAG_ANIMATE_TIME = 100;
var REMOVE_TIME = 100;
var FADEOUT_TIME = 200;
var DROP_TIME = 150;

var MOVING = false;
var MOVE_OUT_OF_TIME = false;
var START_TIME = 0;
var TIME_INTERVAL;
var TIME_RUNNING = false;
var TIME_GRADIENT;
var TIME_RECT;

var HISTORY = [];
var INITIAL_PANEL = [];
var FINAL_PANEL = [];
var CLIPBOARD;
var MIN_SHIFT = 8;
var MAX_SHIFT = 35;

var MAIN_STATE;

//==============================================================
// CONTROL PARAMETER
//==============================================================
var TIME_IS_LIMIT = true;
var TIME_LIMIT = 5;
var DROPABLE = false;
var AUTO_REMOVE = true;
var REPLAY_SPEED = 300;
var AUDIO = true;

var TEAM_COLORS_CHANGEABLE = true;
var TEAM_LEADER_LEFT = null;
var TEAM_LEADER_RIGHT = null;

//==============================================================
// reset functions
//==============================================================
function resetDraggable(){
    $("#dragContainment tr td img").removeAttr("style");
    $("img.draggable").draggable({
        containment: "#dragContainment",
        zIndex: 2500,
        start: function(event, ui){
            countGridPositon(this);
            if( (MOVING && MAIN_STATE == "freeDrag") || TIME_RUNNING ){ 
                return; 
            }
            initialMoveWave();
        },
        drag: function(event, ui) {
            if( MOVE_OUT_OF_TIME ){ return false; }
            dragPosition(this);
        },
        stop: function(){
            if( !MOVE_OUT_OF_TIME ){
                endPosition(this);
            }
            if( MAIN_STATE == "freeDrag" && !MOVE_OUT_OF_TIME ){
                HISTORY.push(null);
                resetDraggable();
                startDragging();
            }
            if( MAIN_STATE == "count" && !MOVE_OUT_OF_TIME ){
                endMoveWave();
            }
        },
    });
}

function resetBase(){
    TR_NUM = parseInt( $("#dragContainment").attr("tr") );
    TD_NUM = parseInt( $("#dragContainment").attr("td") );
    BASE_LEFT = $("#dragContainment td").eq(0).offset().left;
    BASE_TOP = $("#dragContainment td").eq(0).offset().top;
}
function resetColors(){
    TEAM_COLORS = []; 
    for(var i = 0; i < TD_NUM; i++){
        if( TEAM_COLORS_CHANGEABLE ){
            TEAM_COLORS.push( COLORS );
        }else{
            TEAM_COLORS.push(['w', 'f', 'p', 'l', 'd', 'h']);
        }
    }
}
function resetColorGroupSet(){
    STRAIGHT_SETS = [];
    for(var i = 0; i < TD_NUM; i++){
        STRAIGHT_SETS.push([]);
    }
    HORIZONTAL_SETS = [];
    for(var i = 0; i < TR_NUM; i++){
        HORIZONTAL_SETS.push([]);
    }
    COLOR_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
    COLOR_SETS_PREPARE = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};

    GROUP_SETS = {'w':[], 'f':[], 'p':[], 'l':[], 'd':[], 'h':[]};
}
function resetDropStack(){
    REMOVE_STACK = [];
    STRONG_STACK = {};
    DROP_STACK = [];
    for(var i = 0; i < TD_NUM; i++){
        DROP_STACK.push([]);
    }
}
function resetComboStack(){    
    DROP_WAVES = 0;
    COMBO_TIMES = 0;
    COMBO_STACK = [];
    COMBO_SHOW = 0;
    setComboShow();
    resetComboBox();
}
function resetMoveTime(){
    MOVING = false;
    START_TIME = 0;
    TIME_RUNNING = false;
    clearInterval(TIME_INTERVAL);
}
function resetHistory(){
    HISTORY_SHOW = 0;
    HISTORY_RANDOM =  COLOR_RANDOM;
    HISTORY_SKILL_VARIABLE = saveSkillVariable();
    HISTORY = [];
    INITIAL_PANEL = [];
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        if( $("#dragContainment tr td").eq(i).find("img") == 0 ){
            INITIAL_PANEL.push( undefined );
        }else{
            try{
                var item = $("#dragContainment tr td").eq(i).find("img.over").attr("item");
                INITIAL_PANEL.push( item );
            }catch(e){
                INITIAL_PANEL.push( undefined );
            }
        }
    }
    FINAL_PANEL = [];
}
function recordFinal(){
    FINAL_PANEL = [];
    for(var i = 0; i < TR_NUM*TD_NUM; i++){
        if( $("#dragContainment tr td").eq(i).find("img") == 0 ){
            INITIAL_PANEL.push( undefined );
        }else{
            try{
                var item = $("#dragContainment tr td").eq(i).find("img.under").attr("item");
                FINAL_PANEL.push( item );
            }catch(e){
                FINAL_PANEL.push( undefined );
            }
        }
    }

    var record = LZString.compressToEncodedURIComponent( parseDownloadJson() );
    var url = $.url("hostname")+$.url("path")+"?record="+record;
    $('#clipboard').attr("data-clipboard-text", url);
}
function resetCanvas(){
    $('#dragCanvas').show();
    $('#dragCanvas').clearCanvas();
    $('#dragCanvas').offset( $("#dragContainment").offset() );
    $('#dragCanvas').attr("width",TD_NUM*WIDTH).attr("height",TR_NUM*HEIGHT);   
}
function closeCanvas(){
    $('#dragCanvas').hide();
    $('#dragCanvas').clearCanvas();
    $('#dragCanvas').offset( $("#dragContainment").offset() );
    $('#dragCanvas').attr("width",TD_NUM*WIDTH).attr("height",TR_NUM*HEIGHT);
}
function resetTimeDiv(){
    $("#clock").offset({left: $("#dragContainment").offset().left });
    $("#timeBack").css( "width", TD_NUM*WIDTH-($("#clock").width()/2) );
    $("#timeBack").css( "height", $("#clock").height()/2 );
    $("#timeBack").offset({top: $("#clock").offset().top+($("#clock").height()/4),
                            left: $("#clock").offset().left+($("#clock").width()/2) });
    $("#timeRect").css( "width", TD_NUM*WIDTH-($("#clock").width()/2) );
    $("#timeRect").css( "height", $("#clock").height()/2 );
    $("#timeRect").offset({top: $("#clock").offset().top+($("#clock").height()/4),
                            left: $("#clock").offset().left+($("#clock").width()/2) });
}
function renewTimeDiv(){
    resetTimeDiv();
    $("#timeRect").css( "clip", "rect(0px, "+
        parseInt($("#timeBack").css("width"))+"px,"+
        parseInt($("#timeBack").css("height"))+"px, 0px)" );
}


function stopDragging(){
    MOVE_OUT_OF_TIME = true;
    $("#dragContainment tr td img").removeAttr("style");
    $("img.draggable").draggable({ disabled: true });
}
function startDragging(){
    MOVE_OUT_OF_TIME = false;
    $("img.draggable").draggable({ disabled: false });
}

function playAudioRemove(){
    if( !AUDIO ){ return; }
    if( COMBO_SHOW < 10 ){
        var mp3 = "sound/combo"+COMBO_SHOW+".mp3";
    }else{
        var mp3 = "sound/combo10.mp3";
    }
    var audio = new Audio(mp3);
    audio.volume = 0.5;
    audio.play();
}
function playAudioWrong(){
    if( !AUDIO ){ return; }
    var audio = new Audio('sound/wrong.mp3');
    audio.volume = 0.8;
    audio.play();
}

//==============================================================
// drag item analysis
//==============================================================
function countGridPositon(e){
    TD_INDEX = $(e).closest("td").index();
    TR_INDEX = $(e).closest("tr").index();
}

function endPosition(e){
    dragPosition(e);

    var over = $(e).clone();
    $("#dragContainment tr td").eq(TR_INDEX*TD_NUM+TD_INDEX).prepend(over);
    $(e).remove();
}

function dragPosition(e){
    $("#dragContainment tr td img").each( function(){
        if ( !$(this).is('.ui-draggable-dragging') && $(this).attr("animate") != "busy" ) {
            $(this).removeAttr('style');
        }
    } );

    var left = Math.max( 0, Math.min( $(e).offset().left - BASE_LEFT, WIDTH*(TD_NUM-1) ) );
    var top  = Math.max( 0, Math.min( $(e).offset().top  - BASE_TOP, HEIGHT*(TR_NUM-1) ) );
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
        if( !MOVING && !MOVE_OUT_OF_TIME && !TIME_RUNNING ){
            newMoveWave();
            MOVING = true;
            START_TIME = new Date().getTime() / 1000;
            HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );
            if( TIME_IS_LIMIT ){
                TIME_RUNNING = true;
                TIME_INTERVAL = setInterval( function(){ dragTimer(); }, 10);
            }
        }
        if( MAIN_STATE == "freeDrag" && MOVING &&!HISTORY.slice(-1)[0] ){
            HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );            
        }

        var td_base = $("#dragContainment tr td").eq(TR_INDEX*TD_NUM+TD_INDEX);
        var td_goal = $("#dragContainment tr td").eq(top_index*TD_NUM+left_index);
        var items = $(td_base).find("img");
        var item_base = $(td_base).find("img.under");
        var item_goal = $(td_goal).find("img");

        if( $(td_goal).children().length > 0 ){
            var offset_base = $(item_base).offset();
            var offset_goal = $(item_goal).offset();
            var top_vector = (offset_base.top - offset_goal.top);
            var left_vector = (offset_base.left - offset_goal.left);

            items.remove();
            item_goal.remove();
            $(td_base).append(item_goal);
            $(td_goal).append(items);

            $(item_base).offset(offset_goal);
            $(item_goal).offset(offset_goal);
            $(item_goal).attr("animate","busy");
            $(item_goal).animate( { top: "+="+top_vector+"px",left: "+="+left_vector+"px"},
                                  { duration: DRAG_ANIMATE_TIME,
                                        complete: function(){
                                            $(this).removeAttr("animate");
                                        } } );
        }else{
            items.remove();
            $(td_goal).append(items);
            $(item_base).offset(offset_goal);
        }
        
        TD_INDEX = left_index;
        TR_INDEX = top_index;
        HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );
        HISTORY_SHOW += 1;
        setHistoryShow();

        if( $(td_goal).children().length > 0 ){
            //檢查風化
            if( $(item_base).attr("inhibit") || $(item_goal).attr("inhibit") ){
                $("#dragContainment tr td img").removeAttr("style");      
                playAudioWrong();
                MOVE_OUT_OF_TIME = true;
                if( !TIME_IS_LIMIT ){
                    endMoveWave();
                }
            }
        }
    }
}

//==============================================================
// timer
//==============================================================
function dragTimer(){
    var now = new Date().getTime() / 1000;
    showTime(now);

    if( TIME_IS_LIMIT && ( (now - START_TIME) > TIME_LIMIT || MOVE_OUT_OF_TIME )  ){
        MOVE_OUT_OF_TIME = true;
        TIME_RUNNING = false;
        endMoveWave();
    }
}

//==============================================================
// make element
//==============================================================
function initialTable(){
    $("#dragContainment tr").remove();
    for(var i = 0; i < TR_NUM; i++){
        var tr = $("<tr></tr>");
        for(var j = 0; j < TD_NUM; j++){
            $(tr).append($("<td></td>"));
        }
        $("#dragContainment").append(tr);
    }    
}

function initialColor(){
    for(var i = 0; i < TD_NUM; i++){
        for(var j = 0; j < TR_NUM; j ++){
            var target = $("#dragContainment tr td").eq(j*TD_NUM+i);
            if( $(target).children().length == 0 ){
                $(target).append( newElementByID(j*TD_NUM+i) );
            }
        }
    }
}

function mapColor(color){
    if( color ){
        return color[0];
    }else{
        return null;
    }
}
function mapImgSrc(item){
    if( item.indexOf('q') >= 0 ){ return "img/Icon/q.png"; }
    if( item.indexOf('X') >= 0 ){ return "img/Icon/x.png"; }
    return "img/Icon/"+item+".png";
}
function randomBySeed(){    
    var rand = Math.sin(COLOR_RANDOM++) * 10000;
    return rand - Math.floor(rand);
}

function newElementByID(id){
    var td_seat = id%TD_NUM;
    var colors = TEAM_COLORS[td_seat];
    var color = colors[ Math.floor( randomBySeed() * colors.length ) ];
    return newElementByItem(color);
}
function newElementByItem(item){
    var color = mapColor(item);
    if( color ){
        var src_path = mapImgSrc(item);
        var strong = item.indexOf('+') >= 0 ? 1 : undefined;
        var inhibit = ( item.indexOf('x') >= 0 || item.indexOf('X') >= 0 ) ? 1 : undefined;
        var locking = item.indexOf('k') >= 0 ? 1 : undefined;

        var frozen = item.indexOf('i') >= 0 ? 0 : undefined;
        if( item.indexOf('i') >= 0 ){
            frozen = parseInt( item[ item.indexOf('i') + 1 ] );
        }


        var img = $("<img></img>").attr("src",src_path).attr("color",color).attr("item",item);
        img.attr("strong",strong).attr("inhibit",inhibit).attr("frozen",frozen).attr("locking",locking);

        var over = img.clone().addClass("draggable over");
        var under = img.clone().addClass("draggable under");
        return [over, under];
    }else{
        return null;
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

//==============================================================
//  stage define 
//==============================================================
function initialMoveWave(){    
    resetBase();
    resetMoveTime();
}
function endMoveWave(){
    resetMoveTime();
    stopDragging();
    recordFinal();    
    checkGroups();
}
function nextMoveWave(){
    resetDraggable();
    startDragging();
    showResult();
}
function newMoveWave(){
    //Maybe used in next move
    resetComboStack();
    resetHistory();
    renewTimeDiv();
}

function checkGroups(){
    if( !AUTO_REMOVE ){ return; }

    resetBase();
    resetColorGroupSet();
    resetDropStack();

    countColor();
    countGroup();

    var num = 0;
    for(var color in GROUP_SETS){
        num += GROUP_SETS[color].length;
        for(var set of GROUP_SETS[color]){
            var strong_amount = 0;
            for(var i of set){
                if( $("#dragContainment tr td img.over ").eq(i).prop('strong') ){
                    strong_amount += 1;
                }
            }

            var combo = {};
            combo['drop_wave'] = DROP_WAVES;
            combo['color'] = color;
            combo['amount'] = set.size;
            combo['strong_amount'] = strong_amount;
            combo['set'] = set
            COMBO_STACK.push(combo);
            COMBO_TIMES += 1;
        }
    }

    if( num == 0 ){
        if( TR_NUM > 5 ){
            endBrokeBoundary()
        }else{
            checkAttack();
        }
    }else{
        setTimeout( function(){
            removeGroups(TD_NUM*TR_NUM-1);
        }, REMOVE_TIME);        
    }
}
function autoCheckDropGroups(){
    resetBase();
    resetColorGroupSet();
    resetDropStack();
    countColor();
    countGroup();

    var times = 0;
    var num = 0;
    for(var color in GROUP_SETS){
        num += GROUP_SETS[color].length;
    }
    while( num > 0 && times < MAX_AUTO_DROP_TIMES ){
        for(var i = TD_NUM*TR_NUM-1; i >= 0; i--){
            if( REMOVE_STACK.indexOf(i) >= 0 ){ continue; }
            var isSet = inGroup(i);
            if( isSet ){
                var setArr = Array.from(isSet);
                for(var id of setArr){
                    REMOVE_STACK.push(id);
                    $("#dragContainment tr td").eq(id).find("img").remove();
                    $("#dragContainment tr td").eq(id).append( newElementByID(id) );
                }
            }
        }

        resetColorGroupSet();
        resetDropStack();
        countColor();
        countGroup();

        num = 0;
        for(var color in GROUP_SETS){
            num += GROUP_SETS[color].length;
        }

        times++;
    }
}

function checkStartSkill(){

}
function checkNewItemSkill(){

    if( TEAM_LEADER_LEFT  == "GREEK-w" ){ GreekSkill('w', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-w" ){ GreekSkill('w', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-f" ){ GreekSkill('f', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-f" ){ GreekSkill('f', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-p" ){ GreekSkill('p', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-p" ){ GreekSkill('p', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-l" ){ GreekSkill('l', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-l" ){ GreekSkill('l', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-d" ){ GreekSkill('d', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-d" ){ GreekSkill('d', 'right'); }
    if( TEAM_LEADER_LEFT  == "GREEK-h" ){ GreekSkill('h', 'left'); }
    if( TEAM_LEADER_RIGHT == "GREEK-h" ){ GreekSkill('h', 'right'); }

    if( TEAM_LEADER_LEFT  == "BIBLE-w" ){ BibleSkill('w'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-w" ){ BibleSkill('w'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-f" ){ BibleSkill('f'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-f" ){ BibleSkill('f'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-p" ){ BibleSkill('p'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-p" ){ BibleSkill('p'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-l" ){ BibleSkill('l'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-l" ){ BibleSkill('l'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-d" ){ BibleSkill('d'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-d" ){ BibleSkill('d'); }
    if( TEAM_LEADER_LEFT  == "BIBLE-h" ){ BibleSkill('h'); }
    if( TEAM_LEADER_RIGHT == "BIBLE-h" ){ BibleSkill('h'); }

    if( TEAM_LEADER_LEFT  == "GREEK-w" && TEAM_LEADER_RIGHT == "GREEK-w" ){ TeamGreekSkill("w"); }
    if( TEAM_LEADER_LEFT  == "GREEK-f" && TEAM_LEADER_RIGHT == "GREEK-f" ){ TeamGreekSkill("f"); }
    if( TEAM_LEADER_LEFT  == "GREEK-p" && TEAM_LEADER_RIGHT == "GREEK-p" ){ TeamGreekSkill("p"); }
    if( TEAM_LEADER_LEFT  == "GREEK-l" && TEAM_LEADER_RIGHT == "GREEK-l" ){ TeamGreekSkill("l"); }
    if( TEAM_LEADER_LEFT  == "GREEK-d" && TEAM_LEADER_RIGHT == "GREEK-d" ){ TeamGreekSkill("d"); }
}
function checkEndSkill(){

    if( TEAM_LEADER_LEFT  == "COUPLE-f" ){ coupleEndSkill("f"); }
    if( TEAM_LEADER_RIGHT == "COUPLE-f" ){ coupleEndSkill("f"); }
    if( TEAM_LEADER_LEFT  == "COUPLE-p" ){ coupleEndSkill("p"); }
    if( TEAM_LEADER_RIGHT == "COUPLE-p" ){ coupleEndSkill("p"); }

    nextMoveWave();

}
function checkAttack(){
    frozenUpdate();
    
    setTimeout(function(){
        checkEndSkill();
    }, 1000);
}

//==============================================================
// table color group analysis
//==============================================================
function countColor(){
    //count for straight
    for(var i = 0; i < TD_NUM; i++){
        for(var j = 0; j < TR_NUM; j ++){
            var set = new Set();
            var now = j*TD_NUM+i;
            var color = $("#dragContainment tr td").eq(now).find("img.over").attr("color");
            var frozen = $("#dragContainment tr td").eq(now).find("img.over").attr("frozen");
            if( frozen ){
                if( parseInt(frozen) > 0 ){ continue; }
            }

            set.add(now);
            while( j < TR_NUM-1 ){
                var next = (j+1)*TD_NUM+i;
                var next_color = $("#dragContainment tr td").eq(next).find("img.over").attr("color");
                var next_frozen = $("#dragContainment tr td").eq(next).find("img.over").attr("frozen");
                if( next_frozen ){
                    if( parseInt(next_frozen) > 0 ){
                        break;
                    }
                }

                if( color && color == next_color ){
                    set.add(next);
                    j++;
                }else{
                    break;
                }
            }
            if( set.size >= GROUP_SIZE[color] ){
                COLOR_SETS[color].push(new Set(set));
                COLOR_SETS_PREPARE[color].push( new Set(set) );
                STRAIGHT_SETS[i].push(new Set(set));
            }
        }
    }
    //count for horizontal
    for(var i = 0; i < TR_NUM; i++){
        for(var j = 0; j < TD_NUM; j ++){
            var set = new Set();
            var now = i*TD_NUM+j;
            var color = $("#dragContainment tr td").eq(now).find("img.over").attr("color");
            var frozen = $("#dragContainment tr td").eq(now).find("img.over").attr("frozen");
            if( frozen ){
                if( parseInt(frozen) > 0 ){ continue; }
            }

            set.add(now);
            while( j < TD_NUM-1 ){
                var next = i*TD_NUM+j+1;
                var next_color = $("#dragContainment tr td").eq(next).find("img.over").attr("color");
                var next_frozen = $("#dragContainment tr td").eq(next).find("img.over").attr("frozen");
                if( next_frozen ){
                    if( parseInt(next_frozen) > 0 ){
                        break;
                    }
                }

                if( color && color == next_color ){
                    set.add(next);
                    j++;
                }else{
                    break;
                }
            }
            if( set.size >= GROUP_SIZE[color] ){
                COLOR_SETS[color].push(new Set(set));
                COLOR_SETS_PREPARE[color].push(new Set(set));
                HORIZONTAL_SETS[i].push(new Set(set));
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
                for(var already_set of GROUP_SETS[ key ] ){
                    if(   already_set.has(id)                                           ||
                        ( already_set.has(id+1)      && id%TD_NUM < TD_NUM-1          ) ||
                        ( already_set.has(id-1)      && id%TD_NUM > 0                 ) ||
                        ( already_set.has(id+TD_NUM) && id        < TD_NUM*(TR_NUM-1) ) ||
                        ( already_set.has(id-TD_NUM) && id        >= TD_NUM           ) ){
                        for(var already_i of already_set){
                            set.add(already_i);
                        }
                        GROUP_SETS[ key ].splice( GROUP_SETS[ key ].indexOf( already_set ), 1);
                    }
                }
            }
            GROUP_SETS[ key ].push(set);
        }
    }

}

//==============================================================
// remove & new group
//==============================================================
function removeGroups(next){    
    if( !AUTO_REMOVE ){ return; }

    var i = next;
    for( ; i >= 0; i--){
        if( REMOVE_STACK.indexOf(i) >= 0 ){ continue; }
        var isSet = inGroup(i);
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
        if( !AUTO_REMOVE ){ break; }
        REMOVE_STACK.push(id);
        $("#dragContainment tr td").eq(id).find("img").fadeOut( FADEOUT_TIME, function (){
            $(this).remove();
        });
    }
    COMBO_SHOW += 1;
    setComboShow();
    addComboSet(comboSet);
    playAudioRemove();

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
    if( !AUTO_REMOVE ){ return; }

    REMOVE_STACK.sort(function(a, b){return a-b});
    console.log(REMOVE_STACK);

    /*
    TODO
    希臘/巴比隊長技使用
    */
    checkNewItemSkill();

    for(var color in GROUP_SETS){
        for(var set of GROUP_SETS[color]){
            if( set.size >= 5 ){
                var rand_i = Math.floor( randomBySeed() * REMOVE_STACK.length );
                var id = REMOVE_STACK[rand_i];
                REMOVE_STACK.splice(rand_i,1);
                STRONG_STACK[id] = color+'+';
            }
        }
    }
    for(var i = 0; i < TD_NUM*TR_NUM; i++){
        if( REMOVE_STACK.indexOf(i) >= 0 ){
            if( DROPABLE ){
                var elements = newElementByID(i);
                if( elements ){
                    DROP_STACK[i%TD_NUM].push( elements );
                }
            }
        }else if( i in STRONG_STACK ){
            if( DROPABLE ){
                var elements = newElementByItem(STRONG_STACK[i]);
                if( elements ){
                    DROP_STACK[i%TD_NUM].push( elements );
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
    if( !AUTO_REMOVE ){ return; }

    for(var i = 0; i < TD_NUM; i++){
        var num = 0;
        var length = DROP_STACK[i].length;
        for(var j = TR_NUM-1; j >= 0; j--){
            if( $("#dragContainment tr td").eq(j*TD_NUM+i).children().length == 0 ){
                num++;
            }else{
                if( num > 0 ){
                    var imgs = $("#dragContainment tr td").eq(j*TD_NUM+i).find("img").remove();
                    $(imgs).attr("drop",num).attr("toLeft",BASE_LEFT+i*WIDTH).attr("toTop",BASE_TOP+j*HEIGHT);
                    $("#dragContainment tr td").eq((j+num)*TD_NUM+i).append(imgs);
                }
            }
        }
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
            max_drop = Math.max( $(this).attr("drop"), max_drop );
            $(this).offset({top: $(this).attr("toTop"), left: $(this).attr("toLeft")});
            $(this).animate({"top": "+="+parseInt($(this).attr("drop"))*HEIGHT+"px" },
                            {duration: parseInt($(this).attr("drop"))*DROP_TIME});
            $(this).removeAttr("drop").removeAttr("toTop").removeAttr("toLeft");
        }
    });

    setTimeout( function(){
        checkGroups();
    }, max_drop*DROP_TIME );
}
