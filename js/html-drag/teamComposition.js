//==============================================================
//==============================================================
// Team Composition
//==============================================================
//==============================================================

function resetTeamComposition(){ 

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
    resetTeamLeaderSkill();
    resetMemberActiveSkill();
    resetMemberWakes();

    checkCombineSkill();    
    checkTeamSkill();

    resetColors();
    resetHealthPoint();
    resetBattleStack();
}

function resetMemberWakes(){
    TEAM_WAKES = [];
    $.each(TEAM_MEMBERS, function(place, member){
        var wakes = [];
        $.each(member["wake"], function(i, wakeId){
            var wake = WAKES_DATA[ wakeId ];
            if( "preSet" in wake ){
                wake["preSet"](  member, place, member['wake_var'][i] );
            }
            wakes.push( wake );
        });
        TEAM_WAKES.push( wakes );
    });
}

function resetMemberActiveSkill(){
    TEAM_ACTIVE_SKILL     = [];
    $.each(TEAM_MEMBERS, function(place, member){
        var actives = [];
        $.each(member['active'], function(i, activeId){
            var active = NewActiveSkill( activeId );
            active['variable'] = active['preSet']( member, place, i );
            actives.push( active );
        });
        TEAM_ACTIVE_SKILL.push( actives );
    });
}
function checkCombineSkill(){
    TEAM_COMBINE_SKILL = [];
    $.each(TEAM_MEMBERS, function(place, member){
        var actives = [];
        TEAM_COMBINE_SKILL.push( actives );
    });
    for( var combineSkillKey in COMBINE_SKILLS_DATA ){
        COMBINE_SKILLS_DATA[combineSkillKey]["mapping"]();
    }
}

function resetTeamLeaderSkill(){
    TEAM_COLORS_CHANGEABLE = true;
    GROUP_SIZE = {'w':3, 'f':3, 'p':3, 'l':3, 'd':3, 'h':3};

    TEAM_LEADER_SKILL = NewLeaderSkill( TEAM_LEADER['leader'] );
    TEAM_FRIEND_SKILL = NewLeaderSkill( TEAM_FRIEND['leader'] );

    TEAM_LEADER_SKILL["variable"] = TEAM_LEADER_SKILL['preSet']( TEAM_LEADER );
    TEAM_FRIEND_SKILL["variable"] = TEAM_FRIEND_SKILL['preSet']( TEAM_FRIEND );
}
function checkTeamSkill(){
    TEAM_SKILL = [];
    for( var teamSkillKey in TEAM_SKILLS_DATA ){
        TEAM_SKILLS_DATA[teamSkillKey]["mapping"]();
    }
}

function resetHealthPoint(){
    TOTAL_HEALTH_POINT = 0;
    HEALTH_POINT = 0;
    $.each(TEAM_MEMBERS, function(place, member){
        HEALTH_POINT += member['health'];
        TOTAL_HEALTH_POINT += member['health'];
    });
}
function resetBattleStack(){
    ADDITIONAL_EFFECT_STACK  = [];
    USING_ACTIVE_SKILL_STACK = {};
    ATTACK_STACK  = [];
    RECOVER_STACK = [];
    INJURE_STACK  = [];
}
//==============================================================
//==============================================================
// Enemy
//==============================================================
//==============================================================

function resetEnemy(){
    ENEMY = [];
    var enemy = NewEnemy("EMPTY");
    ENEMY.push(enemy);
}