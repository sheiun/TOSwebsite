//==============================================================
// Skill Database
//==============================================================
var LEADER_SKILLS = [
    {
        id        : 'NONE',
        color     : 'w',
    },
    {
        id        : 'GREEK-w',
        color     : 'w',
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    {
        id        : 'GREEK-f',
        color     : 'f',
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    {
        id        : 'GREEK-p',
        color     : 'p',
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    {
        id        : 'GREEK-l',
        color     : 'l',
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    {
        id        : 'GREEK-d',
        color     : 'd',
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    {
        id        : 'GREEK-h',
        color     : 'h',
        newItem   : GreekSkill,
        preSet    : GreekSetting,
    },
    {
        id        : 'BIBLE-w',
        color     : 'w',
        newItem   : BibleSkill,
    },
    {
        id        : 'BIBLE-f',
        color     : 'f',
        newItem   : BibleSkill,
    },
    {
        id        : 'BIBLE-p',
        color     : 'p',
        newItem   : BibleSkill,
    },
    {
        id        : 'BIBLE-l',
        color     : 'l',
        newItem   : BibleSkill,
    },
    {
        id        : 'BIBLE-d',
        color     : 'd',
        newItem   : BibleSkill,
    },
    {
        id        : 'BIBLE-h',
        color     : 'h',
        newItem   : BibleSkill,
    },
    {
        id        : 'COUPLE-f',
        color     : 'f',
        end       : CoupleEndSkill,
    },
    {
        id        : 'COUPLE-p',
        color     : 'p',
        end       : CoupleEndSkill,
    },
];

var TEAM_LEADER_SKILLS = [
    {
        id        : 'NONE',
        color     : 'w',
    },
    {
        id        : 'GREEK-w',
        color     : 'w',
        newItem   : TeamGreekSkill,
        extraCombo: TeamGreekExtraCombo,
        extraReset: TeamGreekExtraComboReset,
        preSet    : TeamGreekSetting,
    },
    {
        id        : 'GREEK-f',
        color     : 'f',
        newItem   : TeamGreekSkill,
        extraCombo: TeamGreekExtraCombo,
        extraReset: TeamGreekExtraComboReset,
        preSet    : TeamGreekSetting,
    },
    {
        id        : 'GREEK-p',
        color     : 'p',
        newItem   : TeamGreekSkill,
        extraCombo: TeamGreekExtraCombo,
        extraReset: TeamGreekExtraComboReset,
        preSet    : TeamGreekSetting,
    },
    {
        id        : 'GREEK-l',
        color     : 'l',
        newItem   : TeamGreekSkill,
        extraCombo: TeamGreekExtraCombo,
        extraReset: TeamGreekExtraComboReset,
        preSet    : TeamGreekSetting,
    },
    {
        id        : 'GREEK-d',
        color     : 'd',
        newItem   : TeamGreekSkill,
        extraCombo: TeamGreekExtraCombo,
        extraReset: TeamGreekExtraComboReset,
        preSet    : TeamGreekSetting,
    }
];

//==============================================================
// Character Database
//==============================================================
var CHARACTERS = [
    {
        id       : "NONE",
        color    : "w",         type     : "GOD",
        health   : 100,         attack   : 100,         recovery : 100,
        leader   : 0,           active   : 0,
    },
    {
        id       : "GREEK-w",
        color    : "w",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 1,           active   : 0,
    },
    {
        id       : "GREEK-f",
        color    : "f",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 2,           active   : 0,
    },
    {
        id       : "GREEK-p",
        color    : "p",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 3,           active   : 0,
    },
    {
        id       : "GREEK-l",
        color    : "l",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 4,           active   : 0,
    },
    {
        id       : "GREEK-d",
        color    : "d",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 5,           active   : 0,
    },
    {
        id       : "GREEK-h",
        color    : "h",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 6,           active   : 0,
    },
    {
        id       : "BIBLE-w",
        color    : "w",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 7,           active   : 0,
    },
    {
        id       : "BIBLE-f",
        color    : "f",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 8,           active   : 0,
    },
    {
        id       : "BIBLE-p",
        color    : "p",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 9,           active   : 0,
    },
    {
        id       : "BIBLE-l",
        color    : "l",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 10,           active   : 0,
    },
    {
        id       : "BIBLE-d",
        color    : "d",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 11,           active   : 0,
    },
    {
        id       : "BIBLE-h",
        color    : "h",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 12,           active   : 0,
    },
    {
        id       : "COUPLE-f",
        color    : "f",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 13,           active   : 0,
    },
    {
        id       : "COUPLE-p",
        color    : "p",         type     : "GOD",
        health   : 3000,        attack   : 1000,        recovery : 200,
        leader   : 14,           active   : 0,
    },
];