
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
    $("#BattleInfomationScrollbar").mCustomScrollbar({
        axis:"y",
        theme:"inset-dark"
    });

    //load history if exist
    if( $.url("?record") ){
        parseUploadJson( LZString.decompressFromEncodedURIComponent( $.url("?record") ) );
    }else{
        newRandomPlain();
        initialTeamMember();
    }
    MAIN_STATE = "count";
    PLAY_TURN = 0;

    closeCanvas();
    setComboShow();
    setHistoryShow();
    resetMemberSelect();
    resetTeamMembers();

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
    loadTeamMembers(HISTORY_TEAM_MEMBER);
    $("#TeamMember select").each(function(i){
        var msdropdown = $(this).msDropDown().data("dd");
        msdropdown.setIndexByValue( TEAM_MEMBERS[i]["id"] );
    });
    loadSkillVariable(HISTORY_SKILL_VARIABLE);
    showTeamInfomation();
    
    backInitColor();
    resetComboStack();
    resetAttackRecoverStack();

    checkSkillByKey('findMaxC');
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

function startEditTeam(){
    PLAY_TURN = 0;    
    $("#StartTeam").hide();
    $("#CloseTeam").show();
    $("#TeamMember").show();
    $("#SystemInfomation").show();
    $("#BattleInfomation").children().remove();
    resetTimeDiv();
    showTeamInfomation();
}
function closeEditTeam(){
    $("#StartTeam").show();
    $("#CloseTeam").hide();
    $("#TeamMember").hide();
    $("#SystemInfomation").hide();
    $("#TeamMember select").each(function(){
        var msdropdown = $(this).msDropDown().data("dd");
        msdropdown.setIndexByValue("NONE");
    });

    resetTeamMembers();
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
    TIME_LIMIT = parseInt( $(this).val() );
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
    resetTeamMembers();
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

//==============================================================
// Show Result
//==============================================================
function showResult(){
    $("#AttackNumber td").children().remove();
    $("#RecoverNumber td").children().remove();
    var total_attack = 0;
    var total_recover = 0;
    $.each(ATTACK_STACK, function(i, attack){
        var atk = Math.round( attack["base"] * attack["factor"] );
        total_attack += atk;
        if( attack["type"] == "person" ){
            $("#AttackNumber td").eq( attack["place"] ).append( 
                $("<sapn></span>").text(atk).addClass("AtkRecLabel") 
            ).append( $("<br>") );
        }
    });
    $.each(RECOVER_STACK, function(i, recover){
        var rec = Math.round( recover["base"] * recover["factor"] );
        total_recover += rec;
        $("#RecoverNumber td").eq( recover["place"] ).append(
            $("<sapn></span>").text(rec).addClass("AtkRecLabel")
        ).append( $("<br>") );
    });

    PLAY_TURN += 1;
    $("#BattleInfomation").append( $("<span></span>").text("第"+PLAY_TURN+"回合：") ).append("<br>");
    $("#BattleInfomation").append( $("<span></span>").text("總共造成 "+total_attack+" 點傷害") ).append("<br>");
    $("#BattleInfomation").append( $("<span></span>").text("總共回復 "+total_recover+" 點生命值") ).append("<br>");

    resetTimeDiv();
}
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
        resetTeamMembers();
    }
}
function removeSelfColor(id){
    $("#li_"+id).remove();
    resetTeamMembers();
}
function setOptionalColors(){
    COLORS = [];
    $("#optionalColors li").each(function(){
        if( $(this).find("img").length > 0 ){
            COLORS.push( $(this).find("img").attr("color") );
        }
    });
}

//==============================================================
// Team edit
//==============================================================
function initialTeamMember(){    
    TEAM_LEADER = NewCharacter("NONE");
    TEAM_FRIEND = NewCharacter("NONE");
    MEMBER_1 = NewCharacter("NONE");
    MEMBER_2 = NewCharacter("NONE");
    MEMBER_3 = NewCharacter("NONE");
    MEMBER_4 = NewCharacter("NONE");
    TEAM_MEMBERS = [
        TEAM_LEADER,
        MEMBER_1,
        MEMBER_2,
        MEMBER_3,
        MEMBER_4,
        TEAM_FRIEND,
    ];
}
function saveTeamMembers(){
    return [
        TEAM_LEADER["id"],
        MEMBER_1["id"],
        MEMBER_2["id"],
        MEMBER_3["id"],
        MEMBER_4["id"],
        TEAM_FRIEND["id"]
    ];
}
function loadTeamMembers(members){
    TEAM_LEADER = NewCharacter( members[0] );
    MEMBER_1    = NewCharacter( members[1] );
    MEMBER_2    = NewCharacter( members[2] );
    MEMBER_3    = NewCharacter( members[3] );
    MEMBER_4    = NewCharacter( members[4] );
    TEAM_FRIEND = NewCharacter( members[5] );
    TEAM_MEMBERS = [
        TEAM_LEADER,
        MEMBER_1,
        MEMBER_2,
        MEMBER_3,
        MEMBER_4,
        TEAM_FRIEND,
    ];
}
function resetMemberSelect(){
    $("#TeamMember select").each(function(i){
        var msdropdown = $(this).msDropDown().data("dd");
        for(var id in CHARACTERS){
            msdropdown.add({
                value: id,
                image: CHARACTERS[id]["img"]
            });
        }
        msdropdown.setIndexByValue( TEAM_MEMBERS[i]["id"] );
        msdropdown.on("change", function(){
            resetTeamMembers();
        });
    });
}

function resetDropColors(){
    if( $("#dropColorSelect").val() == "optional" ){
        if( $("#HorizontalScrollbar").is(":visible") ){
            setOptionalColors();
        }else{
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
        }

    }else if( $("#dropColorSelect").val().indexOf("MAP") >= 0 ) {
        var colorBeMap = $("#dropColorSelect").val().split(",")[1];
        var colorToMap = $("#dropColorSelect").val().split(",")[2];
        COLOR_MAP[colorBeMap] = colorToMap;

    }else if( $("#dropColorSelect").val() == "question" ){
        for( var i = 0; i < TD_NUM; i++ ){
            for( var c of ['wq','fq','pq','lq','dq','hq'] ){
                COLOR_PROB[i][c] = 0.1/6;
            }
        }

    }else if( $("#dropColorSelect").val() ){
        COLORS = $("#dropColorSelect").val().split(",");
    }
}

function resetTeamMembers(){
    TIME_LIMIT = 5;
    PLAY_TURN = 0;
    $('#timeRange').val(5);
    $("#BattleInfomation").children().remove();

    TEAM_LEADER = NewCharacter( $("#TeamLeaderSelect").val() );
    MEMBER_1    = NewCharacter( $("#TeamMember1Select").val() );
    MEMBER_2    = NewCharacter( $("#TeamMember2Select").val() );
    MEMBER_3    = NewCharacter( $("#TeamMember3Select").val() );
    MEMBER_4    = NewCharacter( $("#TeamMember4Select").val() );
    TEAM_FRIEND = NewCharacter( $("#TeamFriendSelect").val() );
    TEAM_MEMBERS = [
        TEAM_LEADER,
        MEMBER_1,
        MEMBER_2,
        MEMBER_3,
        MEMBER_4,
        TEAM_FRIEND,
    ];

    cleanColors();
    resetDropColors();
    resetMemberWakes();
    resetTeamLeaderSkill();
    resetColors();
    showTeamInfomation();
}
function resetMemberWakes(){
    TEAM_LEADER_WAKES = [
        WAKES_DATA[ TEAM_LEADER["wake"][0] ], WAKES_DATA[ TEAM_LEADER["wake"][1] ],
        WAKES_DATA[ TEAM_LEADER["wake"][2] ], WAKES_DATA[ TEAM_LEADER["wake"][3] ],
    ];
    MEMBER_1_WAKES = [
        WAKES_DATA[ MEMBER_1["wake"][0] ], WAKES_DATA[ MEMBER_1["wake"][1] ],
        WAKES_DATA[ MEMBER_1["wake"][2] ], WAKES_DATA[ MEMBER_1["wake"][3] ],
    ];
    MEMBER_2_WAKES = [
        WAKES_DATA[ MEMBER_2["wake"][0] ], WAKES_DATA[ MEMBER_2["wake"][1] ],
        WAKES_DATA[ MEMBER_2["wake"][2] ], WAKES_DATA[ MEMBER_2["wake"][3] ],
    ];
    MEMBER_3_WAKES = [
        WAKES_DATA[ MEMBER_3["wake"][0] ], WAKES_DATA[ MEMBER_3["wake"][1] ],
        WAKES_DATA[ MEMBER_3["wake"][2] ], WAKES_DATA[ MEMBER_3["wake"][3] ],
    ];
    MEMBER_4_WAKES = [
        WAKES_DATA[ MEMBER_4["wake"][0] ], WAKES_DATA[ MEMBER_4["wake"][1] ],
        WAKES_DATA[ MEMBER_4["wake"][2] ], WAKES_DATA[ MEMBER_4["wake"][3] ],
    ];
    TEAM_FRIEND_WAKES = [
        WAKES_DATA[ TEAM_FRIEND["wake"][0] ], WAKES_DATA[ TEAM_FRIEND["wake"][1] ],
        WAKES_DATA[ TEAM_FRIEND["wake"][2] ], WAKES_DATA[ TEAM_FRIEND["wake"][3] ],
    ];

    TEAM_WAKES = [
        TEAM_LEADER_WAKES,
        MEMBER_1_WAKES,
        MEMBER_2_WAKES,
        MEMBER_3_WAKES,
        MEMBER_4_WAKES,
        TEAM_FRIEND_WAKES,
    ];

    checkWakeSkill();
}
function checkWakeSkill(){
    $.each(TEAM_WAKES, function(place, wakes){
        $.each(wakes, function(i, wake){
            if( "preSet" in wake ){
                wake["preSet"]( TEAM_MEMBERS[place], place, TEAM_MEMBERS[place]['wake_var'][i] );
            }
        });
    });
}
function resetTeamLeaderSkill(){
    TEAM_COLORS_CHANGEABLE = true;
    GROUP_SIZE = {'w':3, 'f':3, 'p':3, 'l':3, 'd':3, 'h':3};

    TEAM_LEADER_SKILL = LEADER_SKILLS_DATA[ TEAM_LEADER['leader'] ];
    TEAM_FRIEND_SKILL = LEADER_SKILLS_DATA[ TEAM_FRIEND['leader'] ];
    checkTeamSkill();

    if( "preSet" in TEAM_LEADER_SKILL ){
        TEAM_LEADER_SKILL_VAR = TEAM_LEADER_SKILL['preSet']( TEAM_LEADER );
    }
    if( "preSet" in TEAM_FRIEND_SKILL ){
        TEAM_FRIEND_SKILL_VAR = TEAM_FRIEND_SKILL['preSet']( TEAM_FRIEND );
    }
}
function checkTeamSkill(){
    TEAM_SKILL = [];
    TEAM_SKILL_VAR = {};
    for( var teamSkillKey in TEAM_SKILLS_DATA ){
        TEAM_SKILLS_DATA[teamSkillKey]["mapping"]();
    }
    for( var teamSkill of TEAM_SKILL ){
        if( "preSet" in teamSkill ){
            TEAM_SKILL_VAR[ teamSkill["id"] ] = teamSkill["preSet"]( TEAM_LEADER, TEAM_FRIEND );
        }
    }
}

function showTeamInfomation(){
    $.each(TEAM_MEMBERS, function(place, member){
        $("#LabelInfomation td span").eq(place).text( member['label'] );
        $("#HealthInfomation td span").eq(place).text( member['health'] );
        $("#AttackInfomation td span").eq(place).text( member['attack'] );
        $("#RecoveryInfomation td span").eq(place).text( member['recovery'] );

        $("#Wakes1Infomation td span").eq(place).text( member['wake_info'][0] );
        $("#Wakes2Infomation td span").eq(place).text( member['wake_info'][1] );
        $("#Wakes3Infomation td span").eq(place).text( member['wake_info'][2] );
        $("#Wakes4Infomation td span").eq(place).text( member['wake_info'][3] );
    });

    var letterMap = TEAM_LEADER_SKILL['letter'];
    var letter1 = COLOR_LETTERS[ letterMap[0] ][ TEAM_LEADER_SKILL_VAR['COLOR'] ];
    var letter2 = COLOR_LETTERS[ letterMap[1] ][ TEAM_LEADER_SKILL_VAR['COLOR'] ];
    $('#LeaderSkillInfomation td span').eq(0).text( TEAM_LEADER_SKILL['label'].format( letter1 ) );
    $('#LeaderSkillInfomation td span').eq(1).text( TEAM_LEADER_SKILL['info'].format( letter2 ) );
    letterMap = TEAM_FRIEND_SKILL['letter'];
    letter1 = COLOR_LETTERS[ letterMap[0] ][ TEAM_FRIEND_SKILL_VAR['COLOR'] ];
    letter2 = COLOR_LETTERS[ letterMap[1] ][ TEAM_FRIEND_SKILL_VAR['COLOR'] ];
    $('#LeaderSkillInfomation td span').eq(2).text( TEAM_FRIEND_SKILL['label'].format( letter1 ) );
    $('#LeaderSkillInfomation td span').eq(3).text( TEAM_FRIEND_SKILL['info'].format( letter2 ) );

    $("#TeamSkillInfoTD").children().remove();
    $.each(TEAM_SKILL, function(i, team_skill){
        var label = $("<span></span>").text( team_skill['label'] );
        label.addClass('labelInfo').attr("onclick","$('#teamSkillInfo"+i+"').toggle()");
        var info = $("<span></span>").append("<br>").append(team_skill['info']).append("<br>");
        info.attr("id","teamSkillInfo"+i).hide();
        $("#TeamSkillInfoTD").append( [label, info] );
    });

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
