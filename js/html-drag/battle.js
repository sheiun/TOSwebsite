
function resetCount(){    
    COUNT_COMBO                = COMBO_TIMES;
    COUNT_COMBO_COEFF          = 0.25;
    COUNT_AMOUNT               = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_AMOUNT_COEFF         = { 'w': 0.25, 'f': 0.25, 'p': 0.25, 'l': 0.25, 'd': 0.25, 'h': 0.25 };
    COUNT_MAX_AMOUNT           = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_STRONG               = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_STRONG_COEFF         = { 'w': 0.15, 'f': 0.15, 'p': 0.15, 'l': 0.15, 'd': 0.15, 'h': 0.15 };
    COUNT_SETS                 = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_SETS_COEFF           = { 'w': 0.25, 'f': 0.25, 'p': 0.25, 'l': 0.25, 'd': 0.25, 'h': 0.25 };
    COUNT_FIRST_SETS           = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_FIRST_AMOUNT         = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };

    COUNT_BELONG_COLOR         = {
        'w': { 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 },
        'f': { 'w': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 },
        'p': { 'w': 0, 'f': 0, 'l': 0, 'd': 0, 'h': 0 },
        'l': { 'w': 0, 'f': 0, 'p': 0, 'd': 0, 'h': 0 },
        'd': { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'h': 0 },
        'h': { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0 } 
    };
    COUNT_BELONG_AMOUNT        = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_BELONG_MAX_AMOUNT    = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_BELONG_STRONG        = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };
    COUNT_BELONG_SETS          = { 'w': 0, 'f': 0, 'p': 0, 'l': 0, 'd': 0, 'h': 0 };

    COUNT_FACTOR               = { 'NORMAL': 
        { 
            factor    : function( member ){ return 1; } ,
            prob      : 1,
            condition : function( member ){ return true; } 
        } 
    };

    COUNT_RECOVER_COMBO_COEFF  = 0.25;
    COUNT_RECOVER_AMOUNT_COEFF = 0.25;
    COUNT_RECOVER_STRONG_COEFF = 0.15;
    COUNT_RECOVER_FACTOR       = { 'NORMAL': 
        { 
            factor    : function( member ){ return 1; } ,
            prob      : 1,
            condition : function( member ){ return true; } 
        } 
    };

    COUNT_COLOR_FACTOR          = { 'w': 1, 'f': 1, 'p': 1, 'l': 1, 'd': 1, '': 1 };
    COUNT_COLOR_TO_COLOR_FACTOR ={
        'w': { 'w': 1,   'f': 1.5, 'p': 0.5, 'l': 1,   'd': 1,   '': 1 },
        'f': { 'w': 0.5, 'f': 1,   'p': 1.5, 'l': 1,   'd': 1,   '': 1 },
        'p': { 'w': 1.5, 'f': 0.5, 'p': 1,   'l': 1,   'd': 1,   '': 1 },
        'l': { 'w': 1,   'f': 1,   'p': 1,   'l': 1,   'd': 1.5, '': 1 },
        'd': { 'w': 1,   'f': 1,   'p': 1,   'l': 1.5, 'd': 1,   '': 1 },
        '' : { 'w': 1,   'f': 1,   'p': 1,   'l': 1,   'd': 1,   '': 1 },
    };

    COUNT_INJURE_REDUCE         = 1;
}
function resetEnemyStatus(){
    $.each(ENEMY, function(e, enemy){
        enemy['variable']['COLOR'] = enemy['color'];
        enemy['variable']['DEFENCE'] = enemy['defence'];
        enemy['variable']['ATTACK'] = enemy['attack'];
        enemy['variable']['HATRED'] = [];
        enemy['variable']['SUFFER'] = 0;
    });
}
function resetShowPersonAtkRec(){
    $("#AttackNumber td").children().remove();
    $("#RecoverNumber td").children().remove();
}

//==============================================================
//  Count Attack/ EnemyAction
//==============================================================
function countAttack(){
    resetShowPersonAtkRec();
    resetCount();
    resetEnemyStatus();

    countComboStacks();    
    checkAttackRecoverBeforeBattle();

    $.each(TEAM_MEMBERS, function(membe_place, member){
        makeMemberAttack(membe_place, member);
        makeMemberRecover(membe_place, member);
    });
    checkAttackRecoverMapping();

    $.each(ATTACK_STACK, function(i, attack){
        mapAttackToEnemy(i, attack);
    });
    checkAttackRecoverDamage();

    $.each(ENEMY, function(i, enemy){
        enemyStatusUpdate(i, enemy);        
    });

    countHealthRecover();
}
function countEnemyAction(){
    checkInjureReduce();
    $.each(ENEMY, function(i, enemy){
        enemyActionUpdate(i, enemy);
    });
    healthStatusUpdate();
}


function checkAttackRecoverBeforeBattle(){
    checkLeaderSkillByKey( "attack" );
    checkLeaderSkillByKey( "recover" );
    checkTeamSkillByKey( "attack" );
    checkTeamSkillByKey( "recover" );
    checkWakeByKey( "attack" );
    checkWakeByKey( "recover" );
    checkActiveSkillByKey( "attack" );
    checkActiveSkillByKey( "recover" );
    checkAdditionEffectByKey( "attack" );
    checkAdditionEffectByKey( "recover" );
    checkEnemyEffectByKey("attack");  
}
function checkAttackRecoverMapping(){
    // 共鳴
    checkAdditionEffectByKey( "resonance" );
    // 連擊
    checkAdditionEffectByKey( "extraAttack" );
}
function checkAttackRecoverDamage(){
    // 吸血
    checkLeaderSkillByKey( "damage" );
}
function checkInjureReduce(){
    // 減傷
    checkLeaderSkillByKey( "injure" );
    checkAdditionEffectByKey( "injure" );
}
function checkWillAfterBattle(){
    // 根性意志
    checkLeaderSkillByKey( "will" );
}

function countComboStacks(){
    for(var obj of COMBO_STACK){
        var c = obj['color'];
        COUNT_AMOUNT[c] += obj['amount'];
        COUNT_MAX_AMOUNT[c] = Math.max( COUNT_MAX_AMOUNT[c], obj['amount'] );
        COUNT_STRONG[c] += obj['strong_amount'];
        COUNT_SETS[c] += 1;

        for(var belong_color in COUNT_BELONG_COLOR[c]){
            if( COUNT_BELONG_COLOR[c][belong_color] > 0 ){
                COUNT_BELONG_AMOUNT[belong_color] += obj['amount'] * COUNT_BELONG_COLOR[c][belong_color];
                COUNT_BELONG_MAX_AMOUNT[c] = Math.max( COUNT_BELONG_MAX_AMOUNT[c], obj['amount'] );
                COUNT_BELONG_STRONG[belong_color] += obj['strong_amount'] * COUNT_BELONG_COLOR[c][belong_color];
                COUNT_BELONG_SETS[belong_color] += 1;
            }
        }

        if( obj['drop_wave'] == 0 ){
            COUNT_FIRST_SETS[c] += 1;
            COUNT_FIRST_AMOUNT[c] += obj['amount'];
        }
    }
}

function makeMemberAttack(membe_place, member){
    var color = member["color"];
    var attack = {
        base   : member["attack"],
        color  : member["color"],
        type   : member['type'],
        goal   : "single",
        strong : false,
        style  : "person",
        place  : membe_place,
        target : [],
        factor : 1,
        damage : 0,
        log    : "",
    };

    if( COUNT_MAX_AMOUNT[color] >= 5 || COUNT_BELONG_MAX_AMOUNT[color] >= 5 ){
        attack['goal'] = "all";
    }
    if( (COUNT_STRONG[color]+COUNT_BELONG_STRONG[color]) > 0 ){
        attack['strong'] = true;
    }

    var atk       = ( 1+ ( COUNT_COMBO-1 ) * COUNT_COMBO_COEFF ) * 
                    ( ( COUNT_AMOUNT[color] + COUNT_BELONG_AMOUNT[color] ) * COUNT_AMOUNT_COEFF[color] +
                      ( COUNT_SETS[color]   + COUNT_BELONG_SETS[color]   ) * COUNT_SETS_COEFF[color] +
                      ( COUNT_STRONG[color] + COUNT_BELONG_STRONG[color] ) * COUNT_STRONG_COEFF[color] );
    attack['log'] = "(1+("+(COUNT_COMBO-1)+")*"+COUNT_COMBO_COEFF+")*"+
                    "(("+COUNT_AMOUNT[color]+"+"+COUNT_BELONG_AMOUNT[color]+")*"+COUNT_AMOUNT_COEFF[color]+"+"+
                     "("+COUNT_SETS[color]  +"+"+COUNT_BELONG_SETS[color]  +")*"+COUNT_SETS_COEFF[color]+"+"+
                     "("+COUNT_STRONG[color]+"+"+COUNT_BELONG_STRONG[color]+")*"+COUNT_STRONG_COEFF[color]+")";

    for(var key in COUNT_FACTOR){
        if( COUNT_FACTOR[key]["condition"]( member, membe_place ) ){
            if( randomBySeed() < COUNT_FACTOR[key]["prob"] ){
                var factor = COUNT_FACTOR[key]["factor"]( member, membe_place ).toFixed(5);
                atk *= factor;
                attack['log'] += "*"+factor+'('+key+')';
            }
        }
    }

    attack["factor"]  = atk;
    ATTACK_STACK.push( attack );
}
function makeMemberRecover(membe_place, member){
    var color = member["color"];
    var recover = {
        style  : "person",
        place  : membe_place,
        base   : member["recovery"],
        color  : member["color"],
        type   : member['type'],
        factor : 1,
        log    : "",
    };

    var rec        = ( 1+ ( COUNT_COMBO-1 ) * COUNT_RECOVER_COMBO_COEFF ) *
                     ( ( COUNT_AMOUNT['h'] + COUNT_BELONG_AMOUNT['h'] +
                        COUNT_SETS['h']   + COUNT_BELONG_SETS['h']     ) * COUNT_RECOVER_AMOUNT_COEFF +
                       ( COUNT_STRONG['h'] + COUNT_BELONG_STRONG['h']   ) * COUNT_RECOVER_STRONG_COEFF );
    recover['log'] = "(1+("+(COUNT_COMBO-1)+")*"+COUNT_RECOVER_COMBO_COEFF+")"+"*"+
                     "(("+COUNT_AMOUNT['h']+"+"+COUNT_BELONG_AMOUNT['h']+"+"+
                          COUNT_SETS['h']  +"+"+COUNT_BELONG_SETS['h']  +")*"+COUNT_RECOVER_AMOUNT_COEFF+"+"+
                      "("+COUNT_STRONG['h']+"+"+COUNT_BELONG_STRONG['h']+")*"+COUNT_RECOVER_STRONG_COEFF+")";
    for(var key in COUNT_RECOVER_FACTOR){
        if( COUNT_RECOVER_FACTOR[key]["condition"]( member, membe_place ) ){
            if( randomBySeed() < COUNT_RECOVER_FACTOR[key]["prob"] ){
                var factor = COUNT_RECOVER_FACTOR[key]["factor"]( member, membe_place ).toFixed(5);
                rec *= factor;
                recover['log'] += "*"+factor+'('+key+')';
            }
        }
    }

    recover["factor"] = rec;
    RECOVER_STACK.push( recover );    
}

function mapAttackToEnemy( i, attack ){
    showPersonAttack( attack );
    if( attack['goal'] == "single" ){
        // TODO : enemy priority select
        var target = 0;
        $.each(ENEMY, function(i, enemy){
            if( enemy['variable']['SUFFER'] < enemy['variable']['HEALTH'] ){
                target = i;
                return false;
            }
        });
        attack['target'].push(target);
        countEnemySufferAttack( ENEMY[target], attack );

    }else if( attack['goal'] == "all" ){
        $.each(ENEMY, function(i, enemy){
            attack['target'].push(i);
            countEnemySufferAttack( enemy, attack );
        });
    }
}

function countEnemySufferAttack( enemy, attack ){
    var color = attack['color'];
    var e_color = enemy['variable']['COLOR'];
    attack['factor'] *= COUNT_COLOR_FACTOR[color] * COUNT_COLOR_TO_COLOR_FACTOR[color][e_color];
    attack['log']    += '*'+COUNT_COLOR_FACTOR[color]+'*'+COUNT_COLOR_TO_COLOR_FACTOR[color][e_color];

    var atk = Math.round( attack["base"] * attack["factor"] );
    if( atk > 0 ){
        atk -= enemy['variable']['DEFENCE'];
        atk = Math.max( 1, atk-enemy['variable']['DEFENCE'] );
        attack['damage'] = atk;
        enemy['variable']['SUFFER'] += atk;
        if( atk > 1 ){
            enemy['variable']['HATRED'].push( attack );
        }
    }
}

function enemyStatusUpdate( i, enemy ){
    showEnemySuffer( i, enemy );

    if( enemy['variable']['SUFFER'] >= enemy['variable']['HEALTH'] ){
        enemy['variable']['HEALTH'] = 0;
    }else{
        enemy['variable']['HEALTH'] -= enemy['variable']['SUFFER'];
    }
}

function countHealthRecover(){
    var total_recover = 0;
    $.each(RECOVER_STACK, function(i, recover){
        var rec = Math.round( recover["base"] * recover["factor"] );
        total_recover += rec;
        showPersonRecover( recover );
    });
    showTotalRecover( total_recover );

    HEALTH_POINT = Math.min( TOTAL_HEALTH_POINT, Math.round( HEALTH_POINT+total_recover ) );
}

//==============================================================
// Enemy Action
//==============================================================
function enemyActionUpdate(i, enemy){
console.log("enemy:"+i);
    if( enemy['variable']['HEALTH'] <= 0 ){ return false; }

    enemy['variable']['COOLDOWN'] -= 1;
    if( enemy['variable']['COOLDOWN'] == 0 ){
        enemy['variable']['COOLDOWN'] = enemy['coolDown'];

        var injure = {
            enemyOrder   : i,
            label        : enemy['label'],
            damage       : enemy['variable']['ATTACK'],
            color        : enemy['variable']['COLOR'],
        };
        if( !("INJURE_REDUCEABLE" in enemy['variable']) || enemy['variable']["INJURE_REDUCEABLE"] ){
            injure['damage'] *= COUNT_INJURE_REDUCE;
        }
console.log("injure:"+injure['damage']);
        INJURE_STACK.push(injure);
    }
}
function healthStatusUpdate(){
    $.each(INJURE_STACK, function(i, injure){
        UNDEAD_WILL = false;
        checkWillAfterBattle();

        HEALTH_POINT -= injure['damage'];
        if( UNDEAD_WILL && HEALTH_POINT < 0 ){
            HEALTH_POINT = 1;
        }
        HEALTH_POINT = Math.max( 0, HEALTH_POINT );
    });
}


//==============================================================
//  Check Status after Battle
//==============================================================
function checkEnemyStatus(){
    ENEMY = $.map(ENEMY, function(enemy, i){
        if( enemy['variable']['HEALTH'] > 0 ){
            return enemy;
        }else{
            showEnemyDead( enemy, i );
        }
    });

    if( ENEMY.length == 0 ){ 
        return gotoNextLevelEnemy();
    }
    return true;
}
function checkTeamStatus(){
    if( HEALTH_POINT == 0 ){ return false; }
    return true;
}


//==============================================================
// Game Start/End
//==============================================================
function startGame(){
    PLAY_TURN  = 0;
    HEALTH_POINT = TOTAL_HEALTH_POINT;
    gotoNextLevelEnemy();
    nextMoveWave();
}
function endGame(){
    showEndGame();
    if( GAME_MODE == GAME_MODE_ENUM.REPEAT ){
        restartGame();
    }
}
function restartGame(){
    resetGameWaves();
    startGame();
}
function gotoNextLevelEnemy(){
    GAME_PROGRESS += 1;
    if( GAME_PROGRESS < GAME_WAVES.length ){
        showNextLevel();
        ENEMY = [];
        game_wave = GAME_WAVES[GAME_PROGRESS];
        $.each(game_wave, function(i, enemyID){
            ENEMY.push( NewEnemy(enemyID) );
        });
    }else{
        return false;
    }
    return true;
}