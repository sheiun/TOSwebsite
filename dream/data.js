//==============================================================
// Character Database
//==============================================================
var CHARACTERS_DATA = {
    NOBITA : {
        id           : "NOBITA",
        label        : "大雄",
        img          : "img/Create/nobita.jpg",
        color        : "w",
        type         : "MATERIAL",
        health       : 2600,
        attack       : 100,
        recovery     : 100,
        wake         : [ "NONE", "NONE", "NONE", "NONE" ],
        wake_var     : [ 0, 0, 0, 0 ],
        wake_info    : [ "無", "無", "無", "無" ],
        leader       : "NOBITA",
        active       : [ "NONE" ],
    },
    DOREAMON : {
        id           : "DOREAMON",
        label        : "多啦A夢",
        img          : "img/Create/doreamon.jpg",
        color        : "w",
        type         : "MATERIAL",
        health       : 2600,
        attack       : 100,
        recovery     : 100,
        wake         : [ "NONE", "NONE", "NONE", "NONE" ],
        wake_var     : [ 0, 0, 0, 0 ],
        wake_info    : [ "無", "無", "無", "無" ],
        leader       : "DOREAMON",
        active       : [ "NONE" ],
    },
    SHIZUKA : {
        id           : "SHIZUKA",
        label        : "靜香",
        img          : "img/Create/shizuka.jpg",
        color        : "f",
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
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
};

//==============================================================
// Color Letter Mapping
//==============================================================

var COLOR_EXCLUSIVE = {
    'w': 'f', 'f': 'p', 'p': 'w', 'l': 'd', 'd': 'l', 'h': 'w', '_': 'w'
};
var COLOR_ANTI_EXCLUSIVE = {
    'w': 'p', 'f': 'w', 'p': 'f', 'l': 'd', 'd': 'l', 'h': 'w', '_': 'w'
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