
//==============================================================
// READY
//==============================================================
$(document).ready( function(){
    //initail autoHidingNavbar
    $(".navbar-fixed-top").autoHidingNavbar();

    //initial Clipboard
    CLIPBOARD = new Clipboard( document.getElementById('clipboard') );
    CLIPBOARD.on('success', function(e) {
        alert("\n\n此次模擬結果網址：\n\n"+$("#clipboard").attr("data-clipboard-text")+"\n\n此網址已複製到剪貼簿。\n\n");
    });
    CLIPBOARD.on('error', function(e) {
        alert("製造網址時產生錯誤，敬請見諒。\n\n建議使用Chrome進行作業。");
    });

    //initial Scrollbar
    $("#Scrollbar").mCustomScrollbar({
        axis:"y",
        theme:"minimal-dark"
    });
    var amount=Math.max.apply(Math,$("#HorizontalScrollbar li").map(function(){return $(this).outerWidth(true);}).get());
    $("#HorizontalScrollbar").mCustomScrollbar({
        axis:"x",
        theme:"minimal-dark",
        advanced:{
            autoExpandHorizontalScroll:true
        },
        snapAmount: amount,
    });

    //load history if exist
    if( $.url("?record") ){
        parseUploadJson( LZString.decompressFromEncodedURIComponent( $.url("?record") ) );
    }else{
        newRandomPlain();
    }
    MAIN_STATE = "count";
    resetTeam();
    closeCanvas();
    setComboShow();
    setHistoryShow();

    setTimeout( function(){
    resetTimeDiv();
    }, 10);
});

//==============================================================
// Button click functions
//==============================================================
function newRandomPlain(){
    resetColors();
    initialTable();
    initialColor();

    autoCheckDropGroups();

    if( $("#optionalPanel").text() == "版面製作中" ){
        $("#dragContainment tr td").mousedown( function(){ setElementByOption(this); } );
    }else{
        nextMoveWave();
    }
}
function newOptionalPlain(){
    $("#optionalPanel").text("版面製作中");
    $("#optionalPanel").closest("button").attr("onclick","endOptionalPlain()");
    $("#dragContainment tr td").mousedown( function(){ setElementByOption(this); } );
    MAIN_STATE = "create";
    AUTO_REMOVE = false;
    resetMoveTime();
    stopDragging();
}
function endOptionalPlain(){
    $("#optionalPanel").text("開始自選版面");
    $("#optionalPanel").closest("button").attr("onclick","newOptionalPlain()");
    $("#dragContainment tr td").unbind("mousedown");
    $("#panelControl button").css('background','');
    CREATE_COLOR = null;
    returnMainState();
    returnAutoRemove();
    nextMoveWave();

}
function setColor(color, n){
    CREATE_COLOR = color;
    $("#mouseImg").remove();
    $("#panelControl button").css('background','');
    $("#panelControl button").eq(n).css('background','lightgray');
}
function setElementByOption(e){
    if( CREATE_COLOR != null ){
        $(e).find("img").remove()
        $(e).append( newElementByItem(CREATE_COLOR) );
    }
}

function toggleFreeDrag(){
    if( $("#freeDrag").text() == "自由移動" ){
        $("#freeDrag").text("一般移動");
        MAIN_STATE = "count";
    }else{
        $("#freeDrag").text("自由移動");
        MAIN_STATE = "freeDrag";
    }
}
function returnMainState(){
    if( $("#freeDrag").text() == "自由移動" ){
        MAIN_STATE = "freeDrag";
    }else{
        MAIN_STATE = "count";
    }
}
function toggleTimeLimit(){
    if( $("#timeLimit").text() == "限制時間" ){
        $("#timeLimit").text("無限時間");
        $("#timeRange").hide();
        TIME_IS_LIMIT = false;
    }else{
        $("#timeLimit").text("限制時間");
        $("#timeRange").show();
        TIME_IS_LIMIT = true;
        TIME_LIMIT = 5;
        MOVING = false;
    }
}
function toggleAutoRemove(){
    if( $("#autoRemove").text() == "自動消除" ){
        $("#autoRemove").text("保持待機");
        AUTO_REMOVE = false;
    }else{
        $("#autoRemove").text("自動消除");
        AUTO_REMOVE = true;
        checkGroups();
    }
}
function returnAutoRemove(){
    if( $("#autoRemove").text() == "自動消除" ){
        AUTO_REMOVE = true;
    }else{
        AUTO_REMOVE = false;
    }
}
function toggleDropable(){
    if( $("#dropable").text() == "取消落珠" ){
        $("#dropable").text("隨機落珠");
        DROPABLE = true;
        resetColors();
    }else{
        $("#dropable").text("取消落珠");
        DROPABLE = false;
    }
}
function toggleAudio(){
    if( $("#playAudio").text() == "播放音效" ){
        $("#playAudio").text("關閉音效");
        AUDIO = false;
    }else{
        $("#playAudio").text("播放音效");
        AUDIO = true;
    }
}

function initialPlain(){
    backInitColor();
    nextMoveWave();
}
function finalPlain(){
    backFinalColor();
    nextMoveWave();
}
function replay(){
    $("#randomPanel").closest("button").prop("disabled", true);
    $("#optionalPanel").closest("button").prop("disabled", true);
    $("#initial").closest("button").prop("disabled", true);
    $("#final").closest("button").prop("disabled", true);
    $("#replay").closest("button").prop("disabled", true);

    MAIN_STATE = "review";
    AUTO_REMOVE = false;
    COLOR_RANDOM = HISTORY_RANDOM;
    loadSkillVariable(HISTORY_SKILL_VARIABLE);
    backInitColor();
    resetComboStack();
    replayHistory();
}
function endReplayHistory(){
    returnMainState();
    returnAutoRemove();
    $("#randomPanel").closest("button").prop("disabled", false);
    $("#optionalPanel").closest("button").prop("disabled", false);
    $("#initial").closest("button").prop("disabled", false);
    $("#final").closest("button").prop("disabled", false);
    $("#replay").closest("button").prop("disabled", false);
    $("#review").text("顯示軌跡");
    closeCanvas();;
    endMoveWave();
}
function toggleReviewPath(){
    if( $("#review").text() == "顯示軌跡" ){
        $("#review").text("隱藏軌跡");
        MAIN_STATE = "review";        
        AUTO_REMOVE = false;
        resetCanvas();
        drawPath();
    }else{
        $("#review").text("顯示軌跡");
        returnMainState();
        returnAutoRemove();
        closeCanvas();
        nextMoveWave();
    }
}

//==============================================================
// Show Result
//==============================================================
function showTime(now){    
    var timeFraction = ( TIME_LIMIT - ( now - START_TIME ) )/TIME_LIMIT;
    $("#timeRect").css( "clip", "rect(0px, "+
        parseInt($("#timeBack").css("width"))*timeFraction+"px,"+
        parseInt($("#timeBack").css("height"))+"px, 0px)" );
}
function setHistoryShow(){    
    $("#historyNum").text( HISTORY_SHOW );
}
function setComboShow(){    
    $("#comboNum").text( COMBO_SHOW );
}
function setExtraComboShow(combo){
    if( combo > 0 ){
        $("#extraCombo").text( '+'+combo );
    }else{
        $("#extraCombo").text('');
    }
}
function resetComboBox(){
    $("#comboBox").children().remove();
    $("#comboBox").attr("wave",-1);
}
function makeComboSet(setArr){
    var set_stack = [];
    for(var id of setArr){
        if( $("#dragContainment tr td").eq(id).children().length != 0 ){
            var item = $("#dragContainment tr td").eq(id).find("img.over").attr("item");
            var img = newElementByItem(item)[0].removeClass("draggable over").addClass("comboBox");
            set_stack.push(img);
        }
    }
    return set_stack;
}
function addComboSet(comboSet){
    if( parseInt( $("#comboBox").attr("wave") ) < 0 ){
        $("#comboBox").append( $("<div align=\"center\">首消</div><hr>").addClass("comboLabel") );
    }else if( parseInt( $("#comboBox").attr("wave") ) == 0 && DROP_WAVES > 0 ){
        $("#comboBox").append( $("<div align=\"center\">落消</div><hr>").addClass("comboLabel") );
    }
    $("#comboBox").attr("wave",DROP_WAVES);
    var div = $("<div>").addClass("imgComboSet");
    for(var e of comboSet){
        div.append(e);
    }
    $("#comboBox").append(div.append("<hr>"));

    $("#Scrollbar").mCustomScrollbar("update");
}

//==============================================================
// Set color drop
//==============================================================
function addColorIntoBar(){
    if( CREATE_COLOR != null ){
        var id = parseInt( $("#optionalColors").attr("IDmaker") );
        $("#optionalColors").attr("IDmaker", id+1);
        var element = $("<img>").attr("src", mapImgSrc(CREATE_COLOR) );
        element.attr("color",CREATE_COLOR).attr("onclick","removeSelfColor("+id+")");
        var li = $("<li></li>").attr("id","li_"+id).append(element);
        $("#optionalColors li").eq(-1).before(li);

        $("#HorizontalScrollbar").mCustomScrollbar("update");
        setOptionalColors();
    }
}
function removeSelfColor(id){
    $("#li_"+id).remove();
    setOptionalColors();
}
function setOptionalColors(){
    COLORS = [];
    $("#optionalColors li").each(function(){
        if( $(this).find("img").length > 0 ){
            COLORS.push( $(this).find("img").attr("color") );
        }
    });
    resetTeamLeaderSkill();
}

//==============================================================
// Team edit
//==============================================================
function resetTeam(){
    TEAM_LEADER = NewCharacter("NONE");
    TEAM_FRIEND = NewCharacter("NONE");
    MEMBER_1 = NewCharacter("NONE");
    MEMBER_2 = NewCharacter("NONE");
    MEMBER_3 = NewCharacter("NONE");
    MEMBER_4 = NewCharacter("NONE");

    TEAM_LEADER_WAKES = [
        WAKES[ TEAM_LEADER["wake"][0] ], WAKES[ TEAM_LEADER["wake"][1] ],
        WAKES[ TEAM_LEADER["wake"][2] ], WAKES[ TEAM_LEADER["wake"][3] ],
    ];
    TEAM_FRIEND_WAKES = [
        WAKES[ TEAM_FRIEND["wake"][0] ], WAKES[ TEAM_FRIEND["wake"][1] ],
        WAKES[ TEAM_FRIEND["wake"][2] ], WAKES[ TEAM_FRIEND["wake"][3] ],
    ];
    MEMBER_1_WAKES = [
        WAKES[ MEMBER_1["wake"][0] ], WAKES[ MEMBER_1["wake"][1] ],
        WAKES[ MEMBER_1["wake"][2] ], WAKES[ MEMBER_1["wake"][3] ],
    ];
    MEMBER_2_WAKES = [
        WAKES[ MEMBER_2["wake"][0] ], WAKES[ MEMBER_2["wake"][1] ],
        WAKES[ MEMBER_2["wake"][2] ], WAKES[ MEMBER_2["wake"][3] ],
    ];
    MEMBER_3_WAKES = [
        WAKES[ MEMBER_3["wake"][0] ], WAKES[ MEMBER_3["wake"][1] ],
        WAKES[ MEMBER_3["wake"][2] ], WAKES[ MEMBER_3["wake"][3] ],
    ];
    MEMBER_4_WAKES = [
        WAKES[ MEMBER_4["wake"][0] ], WAKES[ MEMBER_4["wake"][1] ],
        WAKES[ MEMBER_4["wake"][2] ], WAKES[ MEMBER_4["wake"][3] ],
    ];

    $("#TeamMember select").each(function(){
        var msdropdown = $(this).msDropDown().data("dd");
        for(var id in CHARACTERS){
            msdropdown.add({
                value: id,
                image: CHARACTERS[id]["img"]
            });
        }
        msdropdown.setIndexByValue("NONE");
    });

    $("#TeamLeaderSelect").on("change", function(){
        TEAM_LEADER = NewCharacter( $(this).val() );
        TEAM_LEADER_WAKES = [
            WAKES[ TEAM_LEADER["wake"][0] ], WAKES[ TEAM_LEADER["wake"][1] ],
            WAKES[ TEAM_LEADER["wake"][2] ], WAKES[ TEAM_LEADER["wake"][3] ],
        ];
        resetTeamLeaderSkill();
    });
    $("#TeamMember1Select").on("change", function(){
        MEMBER_1 = NewCharacter( $(this).val() );
        MEMBER_1_WAKES = [
            WAKES[ MEMBER_1["wake"][0] ], WAKES[ MEMBER_1["wake"][1] ],
            WAKES[ MEMBER_1["wake"][2] ], WAKES[ MEMBER_1["wake"][3] ],
        ];
        resetTeamLeaderSkill();
    });
    $("#TeamMember2Select").on("change", function(){
        MEMBER_2 = NewCharacter( $(this).val() );
        MEMBER_2_WAKES = [
            WAKES[ MEMBER_2["wake"][0] ], WAKES[ MEMBER_2["wake"][1] ],
            WAKES[ MEMBER_2["wake"][2] ], WAKES[ MEMBER_2["wake"][3] ],
        ];
        resetTeamLeaderSkill();
    });
    $("#TeamMember3Select").on("change", function(){
        MEMBER_3 = NewCharacter( $(this).val() );
        MEMBER_3_WAKES = [
            WAKES[ MEMBER_3["wake"][0] ], WAKES[ MEMBER_3["wake"][1] ],
            WAKES[ MEMBER_3["wake"][2] ], WAKES[ MEMBER_3["wake"][3] ],
        ];
        resetTeamLeaderSkill();
    });
    $("#TeamMember4Select").on("change", function(){
        MEMBER_4 = NewCharacter( $(this).val() );
        MEMBER_4_WAKES = [
            WAKES[ MEMBER_4["wake"][0] ], WAKES[ MEMBER_4["wake"][1] ],
            WAKES[ MEMBER_4["wake"][2] ], WAKES[ MEMBER_4["wake"][3] ],
        ];
        resetTeamLeaderSkill();
    });
    $("#TeamFriendSelect").on("change", function(){
        TEAM_FRIEND = NewCharacter( $(this).val() );
        TEAM_FRIEND_WAKES = [
            WAKES[ TEAM_FRIEND["wake"][0] ], WAKES[ TEAM_FRIEND["wake"][1] ],
            WAKES[ TEAM_FRIEND["wake"][2] ], WAKES[ TEAM_FRIEND["wake"][3] ],
        ];        
        resetTeamLeaderSkill();
    });

    resetTeamLeaderSkill();
}
function startEditTeam(){
    $("#StartTeam").hide();
    $("#CloseTeam").show();
    $("#TeamMember").show();
    resetTimeDiv();
}
function closeEditTeam(){
    $("#StartTeam").show();
    $("#CloseTeam").hide();
    $("#TeamMember").hide();

    TEAM_LEADER = CHARACTERS["NONE"];
    TEAM_FRIEND = CHARACTERS["NONE"];
    MEMBER_1 = CHARACTERS["NONE"];
    MEMBER_2 = CHARACTERS["NONE"];
    MEMBER_3 = CHARACTERS["NONE"];
    MEMBER_4 = CHARACTERS["NONE"];
    resetTeamLeaderSkill();
    resetTimeDiv();
}

//==============================================================
// scroll
//==============================================================
function scroll_top(){
    $("html, body").animate({ scrollTop: 0 }, "fast");
};
function scroll_bottom(){
    $("html, body").animate({ scrollTop: $(document).height() }, "fast");
};
function hide_navbar(){
    $('.navbar-fixed-top').autoHidingNavbar('hide');
}

//==============================================================
// Change Function
//==============================================================

$("#file").change(function (){
    if( $(this).val() !== '' ){
        upload();
    }
});
$('#timeRange').change(function (){
    $(this).val( Math.max( parseInt($(this).attr("min")), 
        Math.min( parseInt($(this).attr("max")), parseInt($(this).val()) ) ) );
    TIME_LIMIT = $(this).val();
});
$('#speedSelect').change(function (){
    REPLAY_SPEED = parseInt($(this).val());
});
$('#colorSelect').change(function (){
    var colorArr = $(this).val().split(",");
    for(var i = 0; i < colorArr.length; i++){
        $("#panelControl button").eq(i).attr("onclick","setColor('"+colorArr[i]+"',"+i+")");
        $("#panelControl button img").eq(i).attr("src",mapImgSrc(colorArr[i]));
    }
});
$("#dropColorSelect").change(function (){
    $("#HorizontalScrollbar").hide();
    COLOR_MAP = {};
    for( var i = 0; i < TD_NUM; i++ ){
        for( var c of ['wq','fq','pq','lq','dq','hq'] ){
            delete COLOR_PROB[i][c];
        }
    }

    if( $(this).val() == "optional" ){
        $("#optionalColors li img").closest("li").remove();
        var id = 0;
        for(var c of ["w", "f", "p", "l", "d", "h"]){
            var element = $("<img>").attr("src", mapImgSrc(c) );
            element.attr("color",c).attr("onclick","removeSelfColor("+id+")");
            var li = $("<li></li>").attr("id","li_"+id).append(element);
            $("#optionalColors li").eq(-1).before(li);
            id++;
        }
        $("#optionalColors").attr("IDmaker", id);
        $("#HorizontalScrollbar").show();
        setOptionalColors();

    }else if( $(this).val().indexOf("MAP") >= 0 ) {
        var colorBeMap = $(this).val().split(",")[1];
        var colorToMap = $(this).val().split(",")[2];
        COLORS = ['w', 'f', 'p', 'l', 'd', 'h'];
        COLOR_MAP[colorBeMap] = colorToMap;

    }else if( $(this).val() == "question" ){
        COLORS = ['w', 'f', 'p', 'l', 'd', 'h'];
        for( var i = 0; i < TD_NUM; i++ ){
            for( var c of ['wq','fq','pq','lq','dq','hq'] ){
                COLOR_PROB[i][c] = 0.1/6;
            }
        }

    }else{
        COLORS = $(this).val().split(",");
    }

    resetTeamLeaderSkill();
});

$("#locusSelect").change(function (){
    if( $(this).val() == "null" ){
        LOCUS = false;
    }else{
        LOCUS = true;
        if( $(this).val().indexOf("Inf") >= 0 ){
            LOCUS_LENGTH = Infinity;
            LOCUS_TYPE = $(this).val().split('Inf')[0];
        }else{            
            LOCUS_LENGTH = 6;
            LOCUS_TYPE = $(this).val();
        }
    }
});


function resetTeamLeaderSkill(){
    for( var i = 0; i < TD_NUM; i++ ){
        for( var c of ['w','f','p','l','d','h'] ){
            delete COLOR_PROB[i][c];
        }
    }
    TEAM_COLORS_CHANGEABLE = true;
    GROUP_SIZE = {'w':3, 'f':3, 'p':3, 'l':3, 'd':3, 'h':3};

    TEAM_LEADER_SKILL = LEADER_SKILLS[ TEAM_LEADER['leader'] ];
    TEAM_FRIEND_SKILL = LEADER_SKILLS[ TEAM_FRIEND['leader'] ];

    if( "preSet" in TEAM_LEADER_SKILL ){
        TEAM_LEADER_SKILL_VAR = TEAM_LEADER_SKILL['preSet']( TEAM_LEADER );
    }
    if( "preSet" in TEAM_FRIEND_SKILL ){
        TEAM_FRIEND_SKILL_VAR = TEAM_FRIEND_SKILL['preSet']( TEAM_FRIEND );
    }

    checkWakeSkill();
    checkTeamSkill();
    resetColors();
}
function checkWakeSkill(){
    for(var wake of TEAM_LEADER_WAKES){
        if( "preSet" in wake ){
            wake["preSet"]( TEAM_LEADER, 0 );
        }
    }
    for(var wake of MEMBER_1_WAKES){
        if( "preSet" in wake ){
            wake["preSet"]( MEMBER_1, 1 );
        }
    }
    for(var wake of MEMBER_2_WAKES){
        if( "preSet" in wake ){
            wake["preSet"]( MEMBER_2, 2 );
        }
    }
    for(var wake of MEMBER_3_WAKES){
        if( "preSet" in wake ){
            wake["preSet"]( MEMBER_3, 3 );
        }
    }
    for(var wake of MEMBER_4_WAKES){
        if( "preSet" in wake ){
            wake["preSet"]( MEMBER_4, 4 );
        }
    }
    for(var wake of TEAM_FRIEND_WAKES){
        if( "preSet" in wake ){
            wake["preSet"]( TEAM_FRIEND, 5 );
        }
    }
}
function checkTeamSkill(){
    TEAM_SKILL = TEAM_LEADER_SKILLS["NONE"];
    if( TEAM_LEADER['leader'] == TEAM_FRIEND['leader'] && TEAM_FRIEND['leader'] == "GREEK" ){
        TEAM_SKILL = TEAM_LEADER_SKILLS["GREEK"];
    }
    if( TEAM_LEADER['leader'] == TEAM_FRIEND['leader'] && TEAM_FRIEND['leader'] == "BABYLON" ){
        TEAM_SKILL = TEAM_LEADER_SKILLS["BABYLON"];
    }
    if( TEAM_LEADER['leader'] == TEAM_FRIEND['leader'] && TEAM_FRIEND['leader'] == "DARK_LUCIFER" ){
        TEAM_SKILL = TEAM_LEADER_SKILLS["DARK_LUCIFER"];
    }
    if( TEAM_LEADER['leader'] == TEAM_FRIEND['leader'] && TEAM_FRIEND['leader'] == "COUPLE_F" ){
        TEAM_SKILL = TEAM_LEADER_SKILLS["COUPLE_FF"];
    }
    if( TEAM_LEADER['leader'] == TEAM_FRIEND['leader'] && TEAM_FRIEND['leader'] == "COUPLE_P" ){
        TEAM_SKILL = TEAM_LEADER_SKILLS["COUPLE_PP"];
    }
    if( (TEAM_LEADER['leader'] == "COUPLE_F" && TEAM_FRIEND['leader'] == "COUPLE_P") || 
        (TEAM_LEADER['leader'] == "COUPLE_P" && TEAM_FRIEND['leader'] == "COUPLE_F") ){
        TEAM_SKILL = TEAM_LEADER_SKILLS["COUPLE_FP"];
    }
    if( "preSet" in TEAM_SKILL ){
        TEAM_SKILL_VAR = TEAM_SKILL["preSet"]( TEAM_LEADER, TEAM_FRIEND );
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
