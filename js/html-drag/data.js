//==============================================================
// Skill Database
//==============================================================
var LEADER_SKILLS = {
    NONE : {
        id        : 'NONE',
    },
    GREEK : {
        id        : 'GREEK',
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    HEART_QUEEN : {
        id        : 'HEART_QUEEN',
        newItem   : GreekSkill,
        preSet    : HeartQueenSetting,
    },
    BABYLON : {
        id        : 'BABYLON',
        newItem   : BabylonSkill,
        attack    : BabylonAttack,
        preSet    : BabylonSetting,
    },
    DARK_LUCIFER : {
        id        : 'DARK_LUCIFER',
        newItem   : BabylonSkill,
        attack    : DarkLuciferAttack,
        preSet    : DarkLuciferSetting,        
    },
    COUPLE_F : {
        id        : 'COUPLE_F',
        end       : CoupleEndSkill,
        preSet    : CoupleSetting,
    },
    COUPLE_P : {
        id        : 'COUPLE_P',
        end       : CoupleEndSkill,
        preSet    : CoupleSetting,
    },
};

var TEAM_LEADER_SKILLS = {
    NONE : {
        id        : 'NONE',
    },
    GREEK : {
        id        : 'GREEK',
        newItem   : TeamGreekSkill,
        extraCombo: TeamGreekExtraCombo,
        extraReset: TeamGreekExtraComboReset,
        attack    : TeamGreekAttack,
        preSet    : TeamGreekSetting,
    },
    BABYLON : {
        id        : 'BABYLON',
        attack    : TeamBabylonAttack,
    },
    DARK_LUCIFER : {
        id        : 'DARK_LUCIFER',
        attack    : TeamDarkLuciferAttack,
    },
    COUPLE_FF : {
        id        : 'COUPLE_FF',
        attack    : TeamCoupleAttackFF,
    },
    COUPLE_PP : {
        id        : 'COUPLE_PP',
        attack    : TeamCoupleAttackPP,
    },
    COUPLE_FP : {
        id        : 'COUPLE_FP',
        attack    : TeamCoupleAttackFP,
    },
};

//==============================================================
// Character Database
//==============================================================
var CHARACTERS = [
    {
        id       : "NONE",
        color    : "w",         type     : "GOD",
        health   : 1,           attack   : 1,           recovery : 1,
        leader   : "NONE",      active   : 0,
    },
    {
        id       : "GREEK_W",
        color    : "w",         type     : "GOD",
        health   : 2927,        attack   : 1646,        recovery : 403,
        leader   : "GREEK",     active   : 0,
    },
    {
        id       : "GREEK_F",
        color    : "f",         type     : "GOD",
        health   : 3080,        attack   : 1760,        recovery : 358,
        leader   : "GREEK",     active   : 0,
    },
    {
        id       : "GREEK_P",
        color    : "p",         type     : "GOD",
        health   : 3385,        attack   : 1516,        recovery : 376,
        leader   : "GREEK",     active   : 0,
    },
    {
        id       : "GREEK_L",
        color    : "l",         type     : "GOD",
        health   : 3049,        attack   : 1634,        recovery : 414,
        leader   : "GREEK",     active   : 0,
    },
    {
        id       : "GREEK_D",
        color    : "d",         type     : "GOD",
        health   : 2866,        attack   : 1810,        recovery : 373,
        leader   : "GREEK",     active   : 0,
    },
    {
        id       : "HEART_QUEEN",
        color    : "f",         type     : "HUMAN",
        health   : 1954,        attack   : 1392,        recovery : 431,
        leader   : "HEART_QUEEN", active   : 0,
    },
    {
        id       : "BABYLON_W",
        color    : "w",         type     : "GOD",
        health   : 3011,        attack   : 1399,        recovery : 421,
        leader   : "BABYLON",   active   : 0,
    },
    {
        id       : "BABYLON_F",
        color    : "f",         type     : "GOD",
        health   : 3167,        attack   : 1496,        recovery : 375,
        leader   : "BABYLON",   active   : 0,
    },
    {
        id       : "BABYLON_P",
        color    : "p",         type     : "GOD",
        health   : 3481,        attack   : 1288,        recovery : 394,
        leader   : "BABYLON",   active   : 0,
    },
    {
        id       : "BABYLON_L",
        color    : "l",         type     : "GOD",
        health   : 3136,        attack   : 1302,        recovery : 433,
        leader   : "BABYLON",   active   : 0,
    },
    {
        id       : "BABYLON_D",
        color    : "d",         type     : "GOD",
        health   : 2948,        attack   : 1537,        recovery : 390,
        leader   : "BABYLON",     active   : 0,
    },
    {
        id       : "DARK_LUCIFER",
        color    : "d",         type     : "SPIRIT",
        health   : 2416,        attack   : 1485,        recovery : 601,
        leader   : "DARK_LUCIFER", active   : 0,
    },
    {
        id       : "COUPLE_F",
        color    : "f",         type     : "GOD",
        health   : 3102,        attack   : 1604,        recovery : 376,
        leader   : "COUPLE_F",  active   : 0,
    },
    {
        id       : "COUPLE_P",
        color    : "p",         type     : "HUMAN",
        health   : 3132,        attack   : 1372,        recovery : 384,
        leader   : "COUPLE_P",  active   : 0,
    },
];