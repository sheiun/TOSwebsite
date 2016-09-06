
var TeamManager = function( table, environment ){
    var CharacterInfo = function(characterID){
        var self = this;
        this.id      = characterID;
        this.color   = CHARACTERS_DATA[characterID].color;
        this.type    = CHARACTERS_DATA[characterID].type;
        this.leader  = CHARACTERS_DATA[characterID].leader;
    }
    var LeaderSkillInfo = function(skillID){
        var self = this;
        this.variable = null;
        this.id       = skillID;
        this.init     = LEADER_SKILLS_DATA[skillID].init;
        this.attack   = LEADER_SKILLS_DATA[skillID].attack;
        this.newItem  = LEADER_SKILLS_DATA[skillID].newItem;
    }

	var self = this;

	this.table = table;
    this.environment = environment;

	this.leader  = null;
	this.member1 = null;
	this.member2 = null;
	this.member3 = null;
	this.member4 = null;
	this.friend  = null;

    this.leaderSkill = null;
    this.friendSkill = null;
    this.teamSkill = new Array();

    this.leaderActive  = null;
    this.member1Active = null;
    this.member2Active = null;
    this.member3Active = null;
    this.member4Active = null;
    this.friendActive  = null;

    this.leaderWake  = null;
    this.member1Wake = null;
    this.member2Wake = null;
    this.member3Wake = null;
    this.member4Wake = null;
    this.friendWake  = null;

	this.initialize = function(){
        self.table.find("select").each(function(){
            //清空
            var dropdown = $(this).msDropdown().data("dd");
            dropdown.destroy();
            $(this).children().remove();
            $(this).css("width", BALL_SIZE*1.1+"px");

            //重建
            var tempOptions = { 
                NONE: CHARACTERS_DATA.NONE,
                GREEK_W: CHARACTERS_DATA.GREEK_W };
            for(var id in tempOptions){
                var option = $("<option></option>");
                option.attr("value", CHARACTERS_DATA[id]["id"]);
                option.attr("data-image", CHARACTERS_DATA[id]["img"]);
                $(this).append(option);
            }
            dropdown = $(this).msDropdown( {
                byJson: { selectedIndex: 0, },
                visibleRows: 4,
                rowHeight: BALL_SIZE,
                openDirection: "alwaysDown",
                zIndex: 9999,
            } ).data("dd");
        });		
	};

    this.setTeamAbility = function(){
        self.setTeamMember();
        self.setTeamLeaderSkill();
        /*
        resetMemberWakes();
        checkTeamSkill();

        resetTeamLeaderSkill();
        resetMemberActiveSkill();
        checkCombineSkill();
        checkActiveCoolDownByWake();
        */
    };
    this.setTeamMember = function(){
        self.leader  = new CharacterInfo( $("#LeaderMember").val() );
        self.member1 = new CharacterInfo( $("#TeamMember1").val() );
        self.member2 = new CharacterInfo( $("#TeamMember2").val() );
        self.member3 = new CharacterInfo( $("#TeamMember3").val() );
        self.member4 = new CharacterInfo( $("#TeamMember4").val() );
        self.friend  = new CharacterInfo( $("#FriendMember").val() );
    }
    this.setTeamLeaderSkill = function(){
        self.leaderSkill = new LeaderSkillInfo( self.leader.leader );
        self.leaderSkill.variable = new self.leaderSkill.init( self.leader );
        self.friendSkill = new LeaderSkillInfo( self.friend.leader );
        self.friendSkill.variable = new self.friendSkill.init( self.friend );
    };

    this.checkLeaderSkill = function( key ){
        if( self.leaderSkill && self.leaderSkill[key] ){console.log(key)
            self.leaderSkill[key]( self.leader, "LEADER" );
        }
    }
};
