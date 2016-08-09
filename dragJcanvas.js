
    

    
var BASE_LEFT;
var BASE_TOP;
var TR_INDEX = 5;
var TD_INDEX = 6;
var TR_NUM = 5;
var TD_NUM = 6;
var WIDTH = 80;
var HEIGHT = 80;
var ACCURACY = 0.6;

function countGridPositon(layer){
    TD_INDEX = layer.data.TD_INDEX;
    TR_INDEX = layer.data.TR_INDEX;
}

function dragPosition(layer){
    /*
    $("#dragContainment tr td img").each( function(){
        if ( !$(this).is('.ui-draggable-dragging') && $(this).attr("animate") != "busy" ) {
            $(this).removeAttr('style');
        }
    } );*/

    var left = Math.max( 0, Math.min( layer.x , WIDTH*(TD_NUM-1) ) );
    var top  = Math.max( 0, Math.min( layer.y , HEIGHT*(TR_NUM-1) ) );
    var left_index = TD_INDEX;
    var top_index  = TR_INDEX;
    var left_vector = (left - (TD_INDEX*WIDTH) )/WIDTH;
    var top_vector  = (top  - (TR_INDEX*HEIGHT))/HEIGHT;
    var abs_left = Math.abs(left_vector);
    var abs_top = Math.abs(top_vector);
    //console.log(  '('+layer.x+','+layer.y+') : '+ abs_left+' ; '+abs_top );

    if( abs_left > ACCURACY && abs_top > ACCURACY ){
        left_index += abs_left/left_vector;
        top_index  += abs_top/top_vector;
    }else if( abs_left - Math.max(abs_top-0.25,0) > ACCURACY ){
        left_index += abs_left/left_vector;
    }else if( abs_top - Math.max(abs_left-0.25,0) > ACCURACY ){
        top_index  += abs_top/top_vector;
    }

    if( left_index != TD_INDEX || top_index != TR_INDEX  ){

        console.log('NOW change');
        
        if( ( MAIN_STATE == MAIN_STATE_ENUM.READY || MAIN_STATE == MAIN_STATE_ENUM.TIME_TO_MOVE )
            && !MOVE_OUT_OF_TIME ){
            //Maybe used in end attack effect
            //newMoveWave();
            MAIN_STATE = MAIN_STATE_ENUM.MOVING;
            HISTORY.push( TR_INDEX*TD_NUM+TD_INDEX );

            // start timer
            if( TIME_IS_LIMIT && !TIME_RUNNING ){
                startToRunTimer();
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

        locusUpdate( TR_INDEX*TD_NUM+TD_INDEX );
        checkInhibit(td_goal, item_base, item_goal);

        
    }
}