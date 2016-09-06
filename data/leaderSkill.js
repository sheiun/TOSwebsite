//==============================================================
//==============================================================
// Skill Function
//==============================================================
//==============================================================

var BasicLeaderSetting = function(){}

//==============================================================
// Greek
//==============================================================
var GreekSetting = function(){
    this.count = 0;
}
var GreekSkill = function( VAR, member, direct ){
    console.log(this, this.variable);

    var deletedWave = historyManager.deletedInfo.getCurrentWave();

    var num = this.variable.count;
    for(var i = 0; i < deletedWave.orderDeletePairs.length; i++){
        num += deletedWave.orderDeletePairs[i].balls.length;
    }

    while( num >= 3 ){
        num -= 3;
        var rand_i;
        if( COMBO_TIMES == 1 && check_straight == 1 ||
            COMBO_TIMES == 1 && check_horizontal == 1 ){
            console.log(REMOVE_STACK);
            rand_i = Math.floor( randomBySeed() * ( REMOVE_STACK.length-1 ) );
        }else{
            rand_i = Math.floor( randomBySeed() *REMOVE_STACK.length );
        }
        var id = REMOVE_STACK[rand_i];
        REMOVE_STACK.splice(rand_i,1);
        STRONG_STACK[id] = color+'+';
    }

    this.variable.count = num;
}

//==============================================================
//==============================================================
// Skill Database
//==============================================================
//==============================================================

var LEADER_SKILLS_DATA = {
    NONE : {
        id        : "NONE",
        label     : "靈魂收割 ‧ 結",
        info      : "當敵方生命力 40% 以下，無視防禦力和屬性，每回合以自身攻擊力 6 倍追打 1 次",
        init      : BasicLeaderSetting,
    },
    GREEK_W : {
        id        : "GREEK_W",
        label     : "水之連動",
        info      : "每累計消除 3 粒水符石 ，將產生 1 粒水強化符石",
        newItem   : GreekSkill,
        init      : GreekSetting,
    },
    GREEK_F : {
        id        : "GREEK_F",
        label     : "火之連動",
        info      : "每累計消除 3 粒火符石 ，將產生 1 粒火強化符石",
        newItem   : GreekSkill,
        init      : GreekSetting,
    },
    GREEK_P : {
        id        : "GREEK_P",
        label     : "木之連動",
        info      : "每累計消除 3 粒木符石 ，將產生 1 粒木強化符石",
        newItem   : GreekSkill,
        init      : GreekSetting,
    },
    GREEK_L : {
        id        : "GREEK_L",
        label     : "光之連動",
        info      : "每累計消除 3 粒光符石 ，將產生 1 粒光強化符石",
        newItem   : GreekSkill,
        init      : GreekSetting,
    },
    GREEK_D : {
        id        : "GREEK_D",
        label     : "暗之連動",
        info      : "每累計消除 3 粒暗符石 ，將產生 1 粒暗強化符石",
        newItem   : GreekSkill,
        init      : GreekSetting,
    },
};
