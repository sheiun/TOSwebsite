//==============================================================
// Character Database
//==============================================================
var CHARACTERS_DATA = {
    NONE : {
        id           : "NONE",
        label        : "瘋頭",
        img          : "img/Material/00/w1-1.png",
        color        : "w",
        type         : "MATERIAL",
        health       : 2600,
        attack       : 100,
        recovery     : 100,
        wake         : [ "NONE", "NONE", "NONE", "NONE" ],
        wake_var     : [ 0, 0, 0, 0 ],
        wake_info    : [ "無", "無", "無", "無" ],
        leader       : "NONE",
        active       : [ "NONE" ],
    },
    GREEK_W : {
        id           : "GREEK_W",
        label        : "大海之神 ‧ 波塞頓",
        img          : "img/Special/2/w3.png",
        color        : "w",
        type         : "GOD",
        health       : 2927,
        attack       : 1646,
        recovery     : 403,
        wake         : [ "H_A_R_INCREASE", "STRAIGHT_ATTACK", "H_A_R_INCREASE", "DROP_INCREASE" ],
        wake_var     : [ [0,90,0], [1.1,4], [340,0,0], ['w',0.4] ],
        wake_info    : [ "攻擊力+90", "4顆直排劍10%", "生命力+340", "直排水符石掉落提升至40%" ],
        leader       : "GREEK_W",
        active       : [ "TRACE_OF_NOTION_W" ],
    },
    GREEK_F : {
        id           : "GREEK_F",
        label        : "煉火之神 ‧ 赫淮斯托斯",
        img          : "img/Special/2/f3.png",
        color        : "f",
        type         : "GOD",
        health       : 3080,
        attack       : 1760,
        recovery     : 358,
        wake         : [ "H_A_R_INCREASE", "STRAIGHT_ATTACK", "H_A_R_INCREASE", "DROP_INCREASE" ],
        wake_var     : [ [0,90,0], [1.1,4], [340,0,0], ['f',0.4] ],
        wake_info    : [ "攻擊力+90", "4顆直排劍10%", "生命力+340", "直排火符石掉落提升至40%" ],
        leader       : "GREEK_F",
        active       : [ "TRACE_OF_NOTION_F" ],
    },
    GREEK_P : {
        id           : "GREEK_P",
        label        : "戰爭女神 ‧ 雅典娜",
        img          : "img/Special/2/p3.png",
        color        : "p",
        type         : "GOD",
        health       : 3385,
        attack       : 1516,
        recovery     : 376,
        wake         : [ "H_A_R_INCREASE", "STRAIGHT_ATTACK", "H_A_R_INCREASE", "DROP_INCREASE" ],
        wake_var     : [ [0,90,0], [1.1,4], [340,0,0], ['p',0.4] ],
        wake_info    : [ "攻擊力+90", "4顆直排劍10%", "生命力+340", "直排木符石掉落提升至40%" ],
        leader       : "GREEK_P",
        active       : [ "TRACE_OF_NOTION_P" ],
    },
    GREEK_L : {
        id           : "GREEK_L",
        label        : "聖光之神 ‧ 阿波羅",
        img          : "img/Special/2/l3.png",
        color        : "l",
        type         : "GOD",
        health       : 3049,
        attack       : 1634,
        recovery     : 414,
        wake         : [ "H_A_R_INCREASE", "STRAIGHT_ATTACK", "H_A_R_INCREASE", "DROP_INCREASE" ],
        wake_var     : [ [0,90,0], [1.1,4], [340,0,0], ['l',0.4] ],
        wake_info    : [ "攻擊力+90", "4顆直排劍10%", "生命力+340", "直排光符石掉落提升至40%" ],
        leader       : "GREEK_L",
        active       : [ "TRACE_OF_NOTION_L" ],
    },
    GREEK_D : {
        id           : "GREEK_D",
        label        : "月夜之神 ‧ 阿提密斯",
        img          : "img/Special/2/d3.png",
        color        : "d",
        type         : "GOD",
        health       : 2866,
        attack       : 1810,
        recovery     : 373,
        wake         : [ "H_A_R_INCREASE", "STRAIGHT_ATTACK", "H_A_R_INCREASE", "DROP_INCREASE" ],
        wake_var     : [ [0,90,0], [1.1,4], [340,0,0], ['d',0.4] ],
        wake_info    : [ "攻擊力+90", "4顆直排劍10%", "生命力+340", "直排暗符石掉落提升至40%" ],
        leader       : "GREEK_D",
        active       : [ "TRACE_OF_NOTION_D" ],
    },
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
};

//==============================================================
// Color Letter Mapping
//==============================================================

var COLOR_LETTERS = [
    { 'w': '水', 'f': '火', 'p': '木', 'l': '光', 'd': '暗', 'h': '心', '_': '無' },
    { 'w': '浪濤', 'f': '熾燄', 'p': '藤木', 'l': '流螢', 'd': '幽冥', 'h': '心', '_': '無' },
    { 'w': '水', 'f': '焰', 'p': '森', 'l': '光', 'd': '魅', 'h': '心', '_': '無' },
    { 'w': '浪濤', 'f': '熾燄', 'p': '藤木', 'l': '玄光', 'd': '幽冥', 'h': '護心', '_': '無' },
    { 'w': '海', 'f': '炎', 'p': '森', 'l': '聖', 'd': '邪', 'h': '心', '_': '無' },
    { 'w': '波濤', 'f': '火烈', 'p': '枯朽', 'l': '天雷', 'd': '背叛', 'h': '心', '_': '無'},
    { 'w': '漩渦', 'f': '焰芒', 'p': '呼嘯', 'l': '聖焰', 'd': '吞噬', 'h': '心', '_': '無'},
];

var COLOR_EXCLUSIVE = {
    'w': 'f', 'f': 'p', 'p': 'w', 'l': 'd', 'd': 'l', 'h': 'w', '_': 'w'
};
var COLOR_ANTI_EXCLUSIVE = {
    'w': 'p', 'f': 'w', 'p': 'f', 'l': 'd', 'd': 'l', 'h': 'w', '_': 'w'
};

var MAIN_STATE_ENUM = {
    READY          : 0,
    MOVING         : 1,
    COUNT_GROUP    : 2,
    COUNT_ATK      : 3,
    BATTLE_INFO    : 4,
    TIME_TO_MOVE   : 5,
    REVIEW         : 6,
    CREATE         : 7,
}
var PLAY_TYPE_ENUM = {
    DRAG  : 0,
    FREE  : 1,
};
var GAME_MODE_ENUM = {
    NORMAL : 0,
    REPEAT : 1,
};


//==============================================================
// Attack Recover 
//==============================================================

var BASIC_ATTACK = {
    base   : 0,
    color  : "_",
    damage : 0,
    factor : 0,
    goal   : "single",
    place  : -1,
    strong : false,
    style  : "NONE",
    type   : "NONE",
    target : [],
    log    : "",
    work   : "init",
};
var BASIC_RECOVER = {
    base   : 0,
    color  : "_",
    factor : 0,
    place  : -1,
    style  : "NONE",
    type   : "NONE",
    log    : "",
    work   : "init",
};
var BASIC_INJURE = {
    enemy  : 0,
    label  : "",
    damage : 0,
    color  : "_",
    work   : "init",
};

function makeNewAttack(){
    var attack = $.extend(true, {}, BASIC_ATTACK);
    return attack;
}
function makeNewRecover(){    
    var recover = $.extend(true, {}, BASIC_RECOVER);
    return recover;
}
function makeNewInjure(){    
    var injure = $.extend(true, {}, BASIC_INJURE);
    return injure;
}