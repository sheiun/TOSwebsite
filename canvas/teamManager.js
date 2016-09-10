
var TeamManager = function( table, environment ){
    var CharacterInfo = function(characterID, xIndex){
        var self = this;
        this.id      = characterID;
        this.color   = CHARACTERS_DATA[characterID].color;
        this.type    = CHARACTERS_DATA[characterID].type;
        this.leader  = CHARACTERS_DATA[characterID].leader;
        this.wake    = CHARACTERS_DATA[characterID].wake;
        this.wakeVar = CHARACTERS_DATA[characterID].wake_var;

        this.xIndex  = xIndex;
    }
    var LeaderSkillInfo = function(skillID){
        var self = this;
        this.variable = null;
        this.id       = skillID;
        this.init     = LEADER_SKILLS_DATA[skillID].init;
        this.attack   = LEADER_SKILLS_DATA[skillID].attack;
        this.newItem  = LEADER_SKILLS_DATA[skillID].newItem;
    }
    var WakeSkillInfo = function(wakeID){
        var self = this;
        this.id       = wakeID;
        this.init     = WAKES_DATA[wakeID].init;
        this.attack   = WAKES_DATA[wakeID].attack;
    }

	var self = this;

	this.table = table;
    this.environment = environment;

    this.team    = null;
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
            for(var id in CHARACTERS_DATA){
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
    this.toText = function(){
        var text = new Array();
        text.push( $("#LeaderMember").val() );
        text.push( $("#TeamMember1").val() );
        text.push( $("#TeamMember2").val() );
        text.push( $("#TeamMember3").val() );
        text.push( $("#TeamMember4").val() );
        text.push( $("#FriendMember").val() );
        return text.join(",");
    }
    this.setTeamFromText = function( text ){
        var teamIDs = text.split(",");
        for(var i = 0; i < teamIDs.length; i++){
            var dd = self.table.find("select").eq(i).msDropdown().data("dd");
            dd.setIndexByValue( teamIDs[i] );
        }
    }

    this.setTeamAbility = function(){
        self.setTeamMember();
        
        self.setMemberWakeSkill();
        self.setTeamSkill();

        self.setMemberLeaderSkill();
        /*
        resetTeamLeaderSkill();
        resetMemberActiveSkill();
        checkCombineSkill();
        checkActiveCoolDownByWake();
        */
    };
    // 設定隊伍 初始技能
    this.setTeamMember = function(){
        self.leader  = new CharacterInfo( $("#LeaderMember").val(), 0 );
        self.member1 = new CharacterInfo( $("#TeamMember1").val() , 1 );
        self.member2 = new CharacterInfo( $("#TeamMember2").val() , 2 );
        self.member3 = new CharacterInfo( $("#TeamMember3").val() , 3 );
        self.member4 = new CharacterInfo( $("#TeamMember4").val() , 4 );
        self.friend  = new CharacterInfo( $("#FriendMember").val(), 5 );
        self.team    = [ self.leader, self.member1, self.member2,
                         self.member3, self.member4, self.friend ];
    }
    this.setMemberLeaderSkill = function(){
        self.leaderSkill = new LeaderSkillInfo( self.leader.leader );
        self.leaderSkill.variable = new self.leaderSkill.init( self.leader );
        self.friendSkill = new LeaderSkillInfo( self.friend.leader );
        self.friendSkill.variable = new self.friendSkill.init( self.friend );
    };
    this.setMemberWakeSkill = function(){
        self.leaderWake  = new Array();
        for(var i = 0; i < self.leader.wake.length; i++){
            var wake = new WakeSkillInfo( self.leader.wake[i] );
            wake.init( self.leader, self.leader.wakeVar[i] );
            self.leaderWake.push( wake );
        }
        self.member1Wake  = new Array();
        for(var i = 0; i < self.member1.wake.length; i++){
            var wake = new WakeSkillInfo( self.member1.wake[i] );
            wake.init( self.member1, self.member1.wakeVar[i] );
            self.member1Wake.push( wake );
        }
        self.member2Wake  = new Array();
        for(var i = 0; i < self.member2.wake.length; i++){
            var wake = new WakeSkillInfo( self.member2.wake[i] );
            wake.init( self.member2, self.member2.wakeVar[i] );
            self.member2Wake.push( wake );
        }
        self.member3Wake  = new Array();
        for(var i = 0; i < self.member3.wake.length; i++){
            var wake = new WakeSkillInfo( self.member3.wake[i] );
            wake.init( self.member3, self.member3.wakeVar[i] );
            self.member3Wake.push( wake );
        }
        self.member4Wake  = new Array();
        for(var i = 0; i < self.member4.wake.length; i++){
            var wake = new WakeSkillInfo( self.member4.wake[i] );
            wake.init( self.member4, self.member4.wakeVar[i] );
            self.member4Wake.push( wake );
        }
        self.friendWake  = new Array();
        for(var i = 0; i < self.friend.wake.length; i++){
            var wake = new WakeSkillInfo( self.friend.wake[i] );
            wake.init( self.friend, self.friend.wakeVar[i] );
            self.friendWake.push( wake );
        }
    }
    this.setTeamSkill = function(){};

    this.checkLeaderSkill = function( key ){
        if( self.leaderSkill[key] ){
            self.leaderSkill[key]( self.leader, "LEADER" );
        }
        if( self.friendSkill[key] ){
            self.friendSkill[key]( self.friend, "FRIEND" );
        }
    }
};
