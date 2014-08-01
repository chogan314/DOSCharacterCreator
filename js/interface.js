function StatRow(statType, statIdx, srcCharacter) {
	var instance = this;
	
	this.statType = statType;
	this.statIdx = statIdx;
	this.srcCharacter = srcCharacter;
	
	this.row = document.createElement('div');
	this.row.className = 'stat_row';
	
	this.statLabel = document.createElement('div');
	switch(this.statType) {
		case statTypeEnum.attribute:
			this.statLabel.innerHTML = attributeNames[i];
			break;
		case statTypeEnum.ability:
			this.statLabel.innerHTML = abilityNames[i];
			break;
		case statTypeEnum.talent:
			this.statLabel.innerHTML = talentNames[i];
			break;
		default:
			throw "Stat row with invalid stat type";
	}
	this.statLabel.onmouseover = function() { instance.mouseOverStatLabel() };
	this.statLabel.onmouseout = function() { instance.mouseOutStatLabel() };
	this.statLabel.className = 'stat_label';
	
	this.statValue = document.createElement('div');
	this.statValue.innerHTML = '0';
	this.statValue.className = 'stat_value';
	
	this.levelUpButton = document.createElement('img');
	this.levelUpButton.src = 'res/levelUpInactive.png';
	this.levelUpButton.onclick = function() { instance.levelUp() };
	this.levelUpButton.onmouseover = function() { instance.mouseOverLevelUp() };
	this.levelUpButton.onmouseout = function() { instance.mouseOutLevelUp() };
	this.levelUpButton.className = 'stat_level_up';
	
	this.levelDownButton = document.createElement('img');
	this.levelDownButton.src = 'res/levelDownInactive.png';
	this.levelDownButton.onclick = function() { instance.levelDown() };
	this.levelDownButton.onmouseover = function() { instance.mouseOverLevelDown() };
	this.levelDownButton.onmouseout = function() { instance.mouseOutLevelDown() };
	this.levelDownButton.className = 'stat_level_down';
	
	this.row.appendChild(this.statLabel);
	this.row.appendChild(this.levelUpButton);
	this.row.appendChild(this.levelDownButton);
	this.row.appendChild(this.statValue);
	
	this.levelUpIsActive = false;
	this.levelDownIsActive = false;
	
	this.levelUpMouseover = false;
	this.levelDownMouseover = false;
}

StatRow.prototype.update = function() {
	switch(this.statType) {
		case statTypeEnum.attribute:
			this.levelUpIsActive = this.srcCharacter.canIncreaseAttribute(this.statIdx);
			this.levelDownIsActive = this.srcCharacter.canDecreaseAttribute(this.statIdx);
			this.statValue.innerHTML = this.srcCharacter.effectiveAttrLevel(this.statIdx);
			break;
		case statTypeEnum.ability:
			this.levelUpIsActive = this.srcCharacter.canIncreaseAbility(this.statIdx);
			this.levelDownIsActive = this.srcCharacter.canDecreaseAbility(this.statIdx);
			this.statValue.innerHTML = this.srcCharacter.effectiveAbilLevel(this.statIdx);
			break;
		case statTypeEnum.talent:
			this.levelUpIsActive = this.srcCharacter.canAddTalent(this.statIdx);
			this.levelDownIsActive = this.srcCharacter.canRemoveTalent(this.statIdx);
			this.statValue.innerHTML = this.srcCharacter.talents[this.statIdx] === true ? 1 : 0;
			break;
		default:
			throw "Stat row with invalid stat type";
	}
	
	if (this.levelUpIsActive && this.levelUpMouseover) {
		this.levelUpButton.src = 'res/levelUpMouseover.png';
	} else if (this.levelUpIsActive) {
		this.levelUpButton.src = 'res/levelUpActive.png';
	} else {
		this.levelUpButton.src = 'res/levelUpInactive.png';
	}
	
	if (this.levelDownIsActive && this.levelDownMouseover) {
		this.levelDownButton.src = 'res/levelDownMouseover.png';
	} else if (this.levelDownIsActive) {
		this.levelDownButton.src = 'res/levelDownActive.png';
	} else {
		this.levelDownButton.src = 'res/levelDownInactive.png';
	}
}

StatRow.prototype.mouseOverStatLabel = function() {
	
}

StatRow.prototype.mouseOutStatLabel = function() {

}

StatRow.prototype.mouseOverLevelUp = function() {
	if (this.levelUpIsActive) {
		this.levelUpButton.src = 'res/levelUpMouseover.png';
	}
	
	this.levelUpMouseover = true;
}

StatRow.prototype.mouseOutLevelUp = function() {
	if (this.levelUpIsActive) {
		this.levelUpButton.src = 'res/levelUpActive.png';
	}
	
	this.levelUpMouseover = false;
}

StatRow.prototype.mouseOverLevelDown = function() {
	if (this.levelDownIsActive) {
		this.levelDownButton.src = 'res/levelDownMouseover.png';
	}
	
	this.levelDownMouseover = true;
}

StatRow.prototype.mouseOutLevelDown = function() {
	if (this.levelDownIsActive) {
		this.levelDownButton.src = 'res/levelDownActive.png';
	}
	
	this.levelDownMouseover = false;
}

StatRow.prototype.levelUp = function() {
	if (!this.levelUpIsActive) {
		return;
	}
	
	switch(this.statType) {
		case statTypeEnum.attribute:
			this.srcCharacter.increaseAttribute(this.statIdx);
			break;
		case statTypeEnum.ability:
			this.srcCharacter.increaseAbility(this.statIdx);
			break;
		case statTypeEnum.talent:
			this.srcCharacter.addTalent(this.statIdx);
			break;
	}
	
	updateInterface();
}

StatRow.prototype.levelDown = function() {
	if (!this.levelDownIsActive) {
		return;
	}
	
	switch(this.statType) {
		case statTypeEnum.attribute:
			this.srcCharacter.decreaseAttribute(this.statIdx);
			break;
		case statTypeEnum.ability:
			this.srcCharacter.decreaseAbility(this.statIdx);
			break;
		case statTypeEnum.talent:
			this.srcCharacter.removeTalent(this.statIdx);
			break;
	}
	
	updateInterface();
}


var dude = new Character();
dude.init();

var levelUpButton = document.getElementById('level_up_button');
var levelDownButton = document.getElementById('level_down_button');

var levelUpButtonActive = false;
var levelDownButtonActive = false;

var levelUpMouseover = false;
var levelDownMouseover = false;

levelUpButton.onclick = function() {
	if (!levelUpButtonActive) {
		return;
	}
	
	dude.levelUp();
	updateInterface();
}

levelUpButton.onmouseover = function() {
	if(levelUpButtonActive) {
		levelUpButton.src = 'res/levelUpMouseover.png';
	}
	
	levelUpMouseover = true;
}

levelUpButton.onmouseout = function() {
	if(levelUpButtonActive) {
		levelUpButton.src = 'res/levelUpActive.png';
	} else {
		levelUpButton.src = 'res/levelUpInactive.png';
	}
	
	levelUpMouseover = false;
}

levelDownButton.onclick = function() {
	if (!levelDownButtonActive) {
		return;
	}
	
	dude.levelDown();
	updateInterface();
}

levelDownButton.onmouseover = function() {
	if(levelDownButtonActive) {
		levelDownButton.src = 'res/levelDownMouseover.png';
	}
	
	levelDownMouseover = true;
}

levelDownButton.onmouseout = function() {
	if(levelDownButtonActive) {
		levelDownButton.src = 'res/levelDownActive.png';
	} else {
		levelDownButton.src = 'res/levelDownInactive.png';
	}
	
	levelDownMouseover = false;
}


var statRows = [];

for (var i = 0; i < attributeNames.length; i++) {
	//var div = document.createElement('div');
	//div.className = 'stat_row';
	//div.innerHTML = attributeNames[i];
	//document.getElementById('attributes').appendChild(div);
	
	var statRow = new StatRow(statTypeEnum.attribute, i, dude);
	document.getElementById('attributes').appendChild(statRow.row);
	statRows.push(statRow);
}

for (var i = 0; i < abilityNames.length; i++) {
	//var div = document.createElement('div');
	//div.innerHTML = abilityNames[i];
	//document.getElementById('abilities').appendChild(div);
	
	var statRow = new StatRow(statTypeEnum.ability, i, dude);
	document.getElementById('abilities').appendChild(statRow.row);
	statRows.push(statRow);
}

for (var i = 0; i < talentNames.length; i++) {
	//var div = document.createElement('div');
	//div.innerHTML = talentNames[i];
	//document.getElementById('talents').appendChild(div);
	
	var statRow = new StatRow(statTypeEnum.talent, i, dude);
	document.getElementById('talents').appendChild(statRow.row);
	statRows.push(statRow);
}

function updateInterface() {
	for (var i = 0; i < statRows.length; i++) {
		statRows[i].update();
	}
	
	document.getElementById('attr_points').innerHTML = dude.attrPointsRemaining();
	document.getElementById('abil_points').innerHTML = dude.abilPointsRemaining();
	document.getElementById('talent_points').innerHTML = dude.talentPointsRemaining();
	document.getElementById('level').innerHTML = dude.level;
	
	levelUpButtonActive = dude.canLevelUp();
	levelDownButtonActive = dude.canLevelDown();
	
	if (levelUpButtonActive && levelUpMouseover) {
		levelUpButton.src = 'res/levelUpMouseover.png';
	} else if (levelUpButtonActive) {
		levelUpButton.src = 'res/levelUpActive.png';
	} else {
		levelUpButton.src = 'res/levelUpInactive.png';
	}
	
	if (levelDownButtonActive && levelDownMouseover) {
		levelDownButton.src = 'res/levelDownMouseover.png';
	} else if (levelDownButtonActive) {
		levelDownButton.src = 'res/levelDownActive.png';
	} else {
		levelDownButton.src = 'res/levelDownInactive.png';
	}
}

updateInterface();

























