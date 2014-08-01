function Character() {
	this.level = 0;
	this.attrPoints = 0;
	this.attrPointsSpent = 0;
	this.abilPoints = 0;
	this.abilPointsSpent = 0;
	this.talentPoints = 0;
	this.talentPointsSpent = 0;
	
	this.attributes = new Array(attributeNames.length);
	this.attributeBonuses = new Array(attributeNames.length);
	this.abilities = new Array(abilityNames.length);
	this.abilityBonuses = new Array(abilityNames.length);
	this.talents = new Array(talentNames.length);
	
	this.levelUpReqs = [];
	this.levelDownReqs = [];
	this.incAttrReqs = new Array(attributeNames.length);
	this.decAttrReqs = new Array(attributeNames.length);
	this.incAbilReqs = new Array(abilityNames.length);
	this.decAbilReqs = new Array(abilityNames.length);
	this.incTalentReqs = new Array(talentNames.length);
	this.decTalentReqs = new Array(talentNames.length);
}


// Second-order values
Character.prototype.attrPointsRemaining = function() {
	var remaining = this.attrPoints - this.attrPointsSpent;
	
	if (remaining < 0) {
		throw "Error - more attribute points spent than gained";
	}
	
	return remaining;
}

Character.prototype.abilPointsRemaining = function() {
	var remaining = this.abilPoints - this.abilPointsSpent;
	
	if (remaining < 0) {
		throw "Error - more ability points spent than gained";
	}
	
	return remaining;
}

Character.prototype.talentPointsRemaining = function() {
	var remaining = this.talentPoints - this.talentPointsSpent;
	
	if (remaining < 0) {
		throw "Error - more talent points spent than gained";
	}
	
	return remaining;
}

Character.prototype.effectiveAttrLevel = function(attrIdx) {
	return this.attributes[attrIdx] + this.attributeBonuses[attrIdx];
}

Character.prototype.effectiveAbilLevel = function(abilIdx) {
	return this.abilities[abilIdx] + this.abilityBonuses[abilIdx];
}


// Fresh init
Character.prototype.init = function() {
	this.level = 1;
	this.attrPoints = 5;
	this.abilPoints = 5;
	this.talentPoints = 2;

	for (var i = 0; i < this.attributes.length; i++) {
		this.attributes[i] = 5;
		this.attributeBonuses[i] = 0;
		this.incAttrReqs[i] = [];
		this.decAttrReqs[i] = [];
	}
	
	for (var i = 0; i < this.abilities.length; i++) {
		this.abilities[i] = 0;
		this.abilityBonuses[i] = 0;
		this.incAbilReqs[i] = [];
		this.decAbilReqs[i] = [];
	}
	
	for (var i = 0; i < this.talents.length; i++) {
		this.talents[i] = false;
		this.incTalentReqs[i] = [];
		this.decTalentReqs[i] = [];
	}
}


// Leveling
Character.prototype.canLevelUp = function() {
	var canLevel = true;
	var reqs = [];
	
	if (this.level >= 99) {
		canLevel = false;
		reqs.push("Max level is 99.");	
	}
	
	this.levelUpReqs = reqs;
	return canLevel;
}

Character.prototype.canLevelDown = function() {
	var canLevel = true;
	var reqs = [];

	if (this.level <= 1) {
		canLevel = false;
		reqs.push("Cannot level below 1.");
	} else {	
		if (this.level <= 20 && this.level % 2 === 0 && this.attrPointsRemaining() <= 0) {
			canLevel = false;
			reqs.push("Not enough free attribute points.");
		}
	
		if (this.level >= 11) {
			if ((this.talents[talentEnum.lone_wolf] && this.abilPointsRemaining() < 4) || this.abilPointsRemaining() < 3) {
				canLevel = false;
				reqs.push("Not enough free ability points.");
			}
		} else if (this.level >= 6) {
			if ((this.talents[talentEnum.lone_wolf] && this.abilPointsRemaining() < 3) || this.abilPointsRemaining() < 2) {
				canLevel = false;
				reqs.push("Not enough free ability points.");
			}
		} else {
			if ((this.talents[talentEnum.lone_wolf] && this.abilPointsRemaining() < 2) || this.abilPointsRemaining() < 1) {
				canLevel = false;
				reqs.push("Not enough free ability points.");
			}
		}
		
		if (this.level <= 20 && (this.level + 1) % 4 === 0 && this.talentPointsRemaining() <= 0) {
			canLevel = false;
			reqs.push("Not enough free talent points.");
		}
		
		if (this.talents[talentEnum.all_skilled_up] && this.level <= 3) {
			canLevel = false;
			reqs.push("Talent \"All Skilled Up\" requires level 3.");
		}
		
		if (this.talents[talentEnum.bigger_and_better] && this.level <= 5) {
			canLevel = false;
			reqs.push("Talent \"Bigger and Better\" requires level 5.");
		}
		
		if (this.talents[talentEnum.glass_cannon] && this.level <= 5) {
			canLevel = false;
			reqs.push("Talent \"Glass Cannon\" requires level 5.");
		}
	}
	
	this.levelDownReqs = reqs;
	return canLevel;
}

Character.prototype.levelUp = function() {
	this.level++;
	
	if (this.level <= 20 && this.level % 2 === 0) {
		this.attrPoints++;
	}
	
	if (this.level >= 11) {
		this.abilPoints += 3;
	} else if (this.level >= 6) {
		this.abilPoints += 2;
	} else {
		this.abilPoints += 1;
	}
	
	if (this.talents[talentEnum.lone_wolf]) {
		this.abilPoints++;
	}
	
	if (this.level <= 20 && (this.level + 1) % 4 === 0) {
		this.talentPoints++;
	}
}

Character.prototype.levelDown = function() {	
	if (this.level <= 20 && this.level % 2 === 0) {	
		this.attrPoints--;
	}
	
	if (this.level >= 11) {
		this.abilPoints -= 3;
	} else if (this.level >= 6) {
		this.abilPoints -= 2;
	} else {
		this.abilPoints -= 1;
	}
	
	if (this.talents[talentEnum.lone_wolf]) {
		this.abilPoints--;
	}
	
	if (this.level <= 20 && (this.level + 1) % 4 === 0) {
		this.talentPoints--;
	}
	
	this.level--;
}


// Adjust attributes
Character.prototype.canIncreaseAttribute = function(attrIdx) {
	var canIncrease = true;
	var reqs = [];
	
	if (this.attributes[attrIdx] >= 99) {
		canIncrease = false;
		reqs.push(attributeNames[attrIdx] + " is at max level.");
	} else if (this.attrPointsRemaining() <= 0) {
		canIncrease = false;
		reqs.push("Not enough attribute points available.");
	}
	
	this.incAttrReqs[attrIdx] = reqs;
	return canIncrease;
}

Character.prototype.canDecreaseAttribute = function(attrIdx) {
	var canDecrease = true;
	var reqs = [];
	
	if (this.attributes[attrIdx] <= 5) {
		canDecrease = false;
		reqs.push(attributeNames[attrIdx] + " is at min level.");
	}
	
	this.decAttrReqs[attrIdx] = reqs;
	return canDecrease;
}

Character.prototype.increaseAttribute = function(attrIdx) {	
	this.attributes[attrIdx]++;
	this.attrPointsSpent++;
}

Character.prototype.decreaseAttribute = function(attrIdx) {
	this.attributes[attrIdx]--;
	this.attrPointsSpent--;
}


// Adjust abilities
Character.prototype.canIncreaseAbility = function(abilIdx) {
	var canIncrease = true;
	var reqs = [];
	var abilLevel = this.abilities[abilIdx];
	
	if (abilLevel >= 5) {
		canIncrease = false;
		reqs.push(abilityNames[abilIdx] + " is at max level.");
	} else if (this.abilPointsRemaining() <= abilLevel) {
		canIncrease = false;
		reqs.push("Not enough ability points available. Required: " + (abilLevel + 1));
	}
	
	this.incAbilReqs[abilIdx] = reqs;
	return canIncrease;
}

Character.prototype.canDecreaseAbility = function(abilIdx) {
	var canDecrease = true;
	var reqs = [];
	var failCondition = false;
	
	// Utility	
	function checkReqsForTalent(source, talentIdx, lvl) {
		if (source.talents[talentIdx] && source.effectiveAbilLevel(abilIdx) <= lvl) {
			failCondition = true;
			reqs.push("Talent \"" + talentNames[talentIdx] + "\" requires " + abilityNames[abilIdx] + " of at least " + lvl + ".");
		}
	}
	
	if (this.abilities[abilIdx] <= 0) {
		canDecrease = false;
		reqs.push(abilityNames[abilIdx] + " is at min level.");
	} else {
		switch(abilIdx) {
			case abilityEnum.single_handed:
				checkReqsForTalent(this, talentEnum.anaconda, 1);
				break;
			case abilityEnum.scoundrel:
				checkReqsForTalent(this, talentEnum.headstrong, 5);
				checkReqsForTalent(this, talentEnum.swift_footed, 2);
				checkReqsForTalent(this, talentEnum.back_stabber, 1);
				break;
			case abilityEnum.willpower:
				checkReqsForTalent(this, talentEnum.comeback_kid, 5);
				checkReqsForTalent(this, talentEnum.voluble_mage, 5);
				break;
			case abilityEnum.pyrotechnic:
				checkReqsForTalent(this, talentEnum.demon, 5);
				break;
			case abilityEnum.expert_marksman:
				checkReqsForTalent(this, talentEnum.expert_ranger, 5);
				checkReqsForTalent(this, talentEnum.quickdraw, 5);
				checkReqsForTalent(this, talentEnum.sidestep, 2);
				break;
			case abilityEnum.sneaking:
				checkReqsForTalent(this, talentEnum.guerilla, 1);
				checkReqsForTalent(this, talentEnum.speedcreeper, 1);
				break;
			case abilityEnum.hydrosophist:
				checkReqsForTalent(this, talentEnum.ice_king, 5);
				break;
			case abilityEnum.aerotheurge:
				checkReqsForTalent(this, talentEnum.lightning_rod, 5);
				break;
			case abilityEnum.body_building:
				checkReqsForTalent(this, talentEnum.stand_your_ground, 5);
				checkReqsForTalent(this, talentEnum.morning_person, 1);
				break;
			case abilityEnum.man_at_arms:
				checkReqsForTalent(this, talentEnum.sidewinder, 5);
				checkReqsForTalent(this, talentEnum.weather_the_storm, 5);
				checkReqsForTalent(this, talentEnum.picture_of_health, 2);
				checkReqsForTalent(this, talentEnum.opportunist, 1);
				checkReqsForTalent(this, talentEnum.thick_skin, 1);
				break;
			case abilityEnum.geomancer:
				checkReqsForTalent(this, talentEnum.weatherproof, 5);
				break;
			default:
				failCondition = false;
		}
	}
	
	this.decAbilReqs[abilIdx] = reqs;
	return canDecrease && !failCondition;
}

Character.prototype.increaseAbility = function(abilIdx) {
	this.abilities[abilIdx]++;
	this.abilPointsSpent += this.abilities[abilIdx];
}

Character.prototype.decreaseAbility = function(abilIdx) {
	this.abilPointsSpent -= this.abilities[abilIdx];
	this.abilities[abilIdx]--;
}


// Adjust talents
Character.prototype.canAddTalent = function(talentIdx) {
	var canAdd = true;
	var reqs = [];
	var failCondition = false;
	
	if (this.talents[talentIdx]) {
		canAdd = false;
		reqs.push(talentNames[talentIdx] + " already obtained.");
	} else if (this.talentPointsRemaining() <= 0) {
		canAdd = false;
		reqs.push("Not enough talent points remaining.");
	}
	
	// Utility
	function checkReqAbility(source, abilIdx, reqLvl) {
		if (source.effectiveAbilLevel(abilIdx) < reqLvl) {
			failCondition = true;
			reqs.push("Requires " + abilityNames[abilIdx] + " of at least level " + reqLvl);
		}
	}
	
	function checkReqLevel(level, reqLvl) {
		if (level < reqLvl) {
			failCondition = true;
			reqs.push("Requires level " + reqLvl);
		}
	}

	switch(talentIdx) {
		case talentEnum.all_skilled_up:
			checkReqLevel(this.level, 3);
			break;
		case talentEnum.anaconda:
			checkReqAbility(this, abilityEnum.single_handed, 1);
			break;
		case talentEnum.back_stabber:
			checkReqAbility(this, abilityEnum.scoundrel, 1);
			break;
		case talentEnum.bigger_and_better:
			checkReqLevel(this.level, 5);
			break;
		case talentEnum.comeback_kid:
			checkReqAbility(this, abilityEnum.willpower, 5);
			break;
		case talentEnum.courageous:
			if (this.talents[talentEnum.escapist]) {
				failCondition = true;
				reqs.push("Incompatible with talent " + talentNames[talentEnum.escapist]);
			}
			break;
		case talentEnum.demon:
			checkReqAbility(this, abilityEnum.pyrotechnic, 5);
			break;
		case talentEnum.elemental_ranger:
			checkReqAbility(this, abilityEnum.expert_marksman, 5);
			break;
		case talentEnum.escapist:
			if (this.talents[talentEnum.courageous]) {
				failCondition = true;
				reqs.push("Incompatible with talent " + talentNames[talentEnum.courageous]);
			}
			break;
		case talentEnum.glass_cannon:
			checkReqLevel(this.level, 5);
			break;
		case talentEnum.guerilla:
			checkReqAbility(this, abilityEnum.sneaking, 1);
			break;
		case talentEnum.headstrong:
			checkReqAbility(this, abilityEnum.scoundrel, 5);
			break;
		case talentEnum.ice_king:
			checkReqAbility(this, abilityEnum.hydrosophist, 5);
			break;
		case talentEnum.lightning_rod:
			checkReqAbility(this, abilityEnum.aerotheurge, 5);
			break;
		case talentEnum.morning_person:
			checkReqAbility(this, abilityEnum.body_building, 1);
			break;
		case talentEnum.opportunist:
			checkReqAbility(this, abilityEnum.man_at_arms, 1);
			break;
		case talentEnum.picture_of_health:
			checkReqAbility(this, abilityEnum.man_at_arms, 2);
			break;
		case talentEnum.quickdraw:
			checkReqAbility(this, abilityEnum.expert_marksman, 5);
			break;
		case talentEnum.sidestep:
			checkReqAbility(this, abilityEnum.expert_marksman, 2);
			break;
		case talentEnum.sidewinder:
			checkReqAbility(this, abilityEnum.man_at_arms, 5);
			break;
		case talentEnum.speedcreeper:
			checkReqAbility(this, abilityEnum.sneaking, 1);
			break;
		case talentEnum.stand_your_ground:
			checkReqAbility(this, abilityEnum.body_building, 5);
			break;
		case talentEnum.swift_footed:
			checkReqAbility(this, abilityEnum.scoundrel, 2);
			break;
		case talentEnum.thick_skin:
			checkReqAbility(this, abilityEnum.man_at_arms, 1);
			break;
		case talentEnum.voluble_mage:
			checkReqAbility(this, abilityEnum.willpower, 5);
			break;
		case talentEnum.weather_the_storm:
			checkReqAbility(this, abilityEnum.man_at_arms, 5);
			break;
		case talentEnum.weatherproof:
			checkReqAbility(this, abilityEnum.geomancer, 5);
			break;
		default:
			failCondition = false;
	}

	this.incTalentReqs[talentIdx] = reqs;
	return canAdd && !failCondition;
}

Character.prototype.canRemoveTalent = function(talentIdx) {
	var canRemove = true;
	var reqs = [];
	var failCondition = false;
	
	if (!this.talents[talentIdx]) {
		canRemove = false;
		reqs.push(talentNames[talentIdx] + " not yet obtained.");
	} else {
		switch (talentIdx) {
			case talentEnum.all_skilled_up:
				if (this.abilPointsRemaining() < 2) {
					failCondition = true;
					reqs.push("Requires at least 2 unallocated ability points to remove.");
				}
				break;
			case talentEnum.bigger_and_better:
				if (this.attributePointsRemaining() < 1) {
					failCondition = true;
					reqs.push("Requires at least 1 unallocated attribute point to remove.");
				}
				break;
			case talentEnum.lone_wolf:
				if (this.abilPointsRemaining() < level - 1) {
					failCondition = true;
					reqs.push("Requires at least " + (level - 1) + " (level - 1) unallocated ability points to remove.");
				}
				break;
			default:
				failCondition = false;
		}
	}
	
	this.decTalentReqs[talentIdx] = reqs;
	return canRemove && !failCondition;
}

Character.prototype.addTalent = function(talentIdx) {
	switch(talentIdx) {
		case talentEnum.all_skilled_up:
			this.abilPoints += 2;
			break;
		case talentEnum.bigger_and_better:
			this.attrPoints++;
			break;
		case talentEnum.lone_wolf:
			this.abilPoints += level - 1;
			break;
		case talentEnum.know_it_all:
			this.attributeBonuses[attributeEnum.intelligence]++;
			break;
		case talentEnum.politician:
			this.attributeBonuses[attributeEnum.intelligence]--;
			this.abilityBonuses[abilityEnum.charisma] += 2;
			break;
		case talentEnum.scientist:
			this.abilityBonuses[abilityEnum.blacksmithing]++;
			this.abilityBonuses[abilityEnum.crafting]++;
			break;
		default:
	}
	
	this.talents[talentIdx] = true;
	this.talentPointsSpent++;
}

Character.prototype.removeTalent = function(talentIdx) {
	switch(talentIdx) {
		case talentEnum.all_skilled_up:
			this.abilPoints -= 2;
			break;
		case talentEnum.bigger_and_better:
			this.attrPoints--;
			break;
		case talentEnum.lone_wolf:
			this.abilPoints -= level - 1;
			break;
		case talentEnum.know_it_all:
			this.attributeBonuses[attributeEnum.intelligence]--;
			break;
		case talentEnum.politician:
			this.attributeBonuses[attributeEnum.intelligence]++;
			this.abilityBonuses[abilityEnum.charisma] -= 2;
			break;
		case talentEnum.scientist:
			this.abilityBonuses[abilityEnum.blacksmithing]--;
			this.abilityBonuses[abilityEnum.crafting]--;
			break;
		default:
	}

	this.talents[talentIdx] = false;
	this.talentPointsSpent--;
}

Character.prototype.toString = function() {
	var toStr = "Level: " + this.level + "\n" +
				 "Attribute Points: " + this.attrPointsRemaining() + "\n" +
				 "Ability Points: " + this.abilPointsRemaining() + "\n" +
				 "Talent Points: " + this.talentPointsRemaining() + "\n";
				 
	for (var i = 0; i < this.attributes.length; i++) {
		toStr = toStr.concat(attributeNames[i] + ": " + this.attributes[i] + "\n");
	}
	
	for (var i = 0; i < this.abilities.length; i++) {
		toStr = toStr.concat(abilityNames[i] + ": " + this.abilities[i] + "\n");
	}
	
	for (var i = 0; i < this.talents.length; i++) {
		toStr = toStr.concat(talentNames[i] + ": " + this.talents[i] + "\n");
	}
	
	return toStr;
}

Character.prototype.printReqs = function() {
	this.canLevelUp();
	console.log(this.levelUpReqs);
	this.canLevelDown();
	console.log(this.levelDownReqs);	

	for (var i = 0; i < this.attributes.length; i++) {
		console.log("====" + attributeNames[i] + "====");
		this.canIncreaseAttribute(i);
		console.log(this.incAttrReqs[i]);
		this.canDecreaseAttribute(i);
		console.log(this.decAttrReqs[i]);
	}
	
	for (var i = 0; i < this.abilities.length; i++) {
		console.log("====" + abilityNames[i] + "====");
		this.canIncreaseAbility(i);
		console.log(this.incAbilReqs[i]);
		this.canDecreaseAbility(i);
		console.log(this.decAbilReqs[i]);
	}
	
	for (var i = 0; i < this.talents.length; i++) {
		console.log("====" + talentNames[i] + "====");
		this.canAddTalent(i);
		console.log(this.incTalentReqs[i]);
		this.canRemoveTalent(i);
		console.log(this.decTalentReqs[i]);
	}
}



//var dude = new Character();
//dude.init();
//console.log(dude.toString());
//dude.printReqs();





























