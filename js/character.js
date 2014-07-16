var level = 0;
var attrPoints = 0;
var attrPointsSpent = 0;
var abilPoints = 0;
var abilPointsSpent = 0;
var talentPoints = 0;
var talentPointsSpent = 0;

var attributes = new Array(attributeNames.length);
var abilities = new Array(abilityNames.length);
var talents = new Array(talentNames.length);

function initCharacter() {
	level = 1;
	attrPoints = 5;
	abilPoints = 5;
	talentPoints = 2;

	for (var i = 0; i < attributes.length; i++) {
		attributes[i] = 5;
	}
	
	for (var i = 0; i < abilities.length; i++) {
		abilities[i] = 0;
	}
	
	for (var i = 0; i < talents.length; i++) {
		talents[i] = false;
	}
}

function canLevelUp() {
	return level < 99;
}

function levelUp() {
	if (level < 1) {
		throw "Cannot level up: character not initialized";
	}
	
	if (!canLevelUp()) {
		throw "Cannot level up: at max level";
	}

	level++;
	if (level <= 20 && level % 2 === 0) {
		attrPoints++;
	}
	
	if (level >= 11) {
		abilPoints += 3;
	} else if (level >= 6) {
		abilPoints += 2;
	} else {
		abilPoints += 1;
	}
	
	if (talents[talentEnum.lone_wolf]) {
		abilPoints++;
	}
	
	if (level <= 20 && (level + 1) % 4 === 0) {
		talentPoints++;
	}
}

function canLevelDown() {
	if (level <= 1) {
		return false;
	}
	
	if (level <= 20 && level % 2 === 0 && attrPointsRemaining() <= 0) {
		return false;
	}
	
	if (level >= 11) {
		return talents[talentEnum.lone_wolf] ? abilPointsRemaining() >= 4 : abilPointsRemaining() >= 3;
	} else if (level >= 6) {
		return talents[talentEnum.lone_wolf] ? abilPointsRemaining() >= 3 : abilPointsRemaining() >= 2;
	} else {
		return talents[talentEnum.lone_wolf] ? abilPointsRemaining() >= 2 : abilPointsRemaining() >= 1;
	}
	
	if (level <= 20 && (level + 1) % 4 === 0 && talentPointsRemaining <= 0) {
		return false;
	}
	
	if (talents[talentEnum.all_skilled_up] && level <= 3) {
		return false;
	}
	
	if (talents[talentEnum.bigger_and_better] && level <= 5) {
		return false;
	}
	
	if (talents[talentEnum.glass_cannon] && level <= 5) {
		return false;
	}
	
	return true;
}

function levelDown() {
	if (!canLevelDown()) {
		throw "Cannot level down"
	}
	
	if (level <= 20 && level % 2 === 0) {	
		attrPoints--;
	}
	
	if (level >= 11) {
		abilPoints -= 3;
	} else if (level >= 6) {
		abilPoints -= 2;
	} else {
		abilPoints -= 1;
	}
	
	if (talents[talentEnum.lone_wolf]) {
		abilPoints--;
	}
	
	if (level <= 20 && (level + 1) % 4 === 0) {
		talentPoints--;
	}
	
	level--;
}

function attrPointsRemaining() {
	return attrPoints - attrPointsSpent;
}

function abilPointsRemaining() {
	return abilPoints - abilPointsSpent;
}

function talentPointsRemaining() {
	return talentPoints - talentPointsSpent;
}


// Adjust attributes
function canIncreaseAttribute() {
	return attrPointsRemaining() > 0;
}

function canDecreaseAttribute(attrIdx) {
	return attributes[attrIdx] > 5;
};

function increaseAttribute(attrIdx) {
	if (!canIncreaseAttribute()) {
		throw "Cannot increase attribute: no attribute points remaining";
	}
	
	attributes[attrIdx]++;
	attrPointsSpent++;
}

function decreaseAttribute(attrIdx) {
	if (!canDecreaseAttribute(attrIdx)) {
		throw "Cannot decrease attribute: minimum value is 5";
	}
	
	attributes[attrIdx]--;
	attrPointsSpent--;
}

// Adjust attributes WLU (with level up)
/*
function canIncreaseAttributeWLU() {
	return canIncreaseAttribute() || level < 20;
}

function increaseAttributeWLU(attrIdx) {
	if (!canIncreaseAttributeWLU()) {
		throw "Cannot increase attribute WLU";
	}
	
	while(attrPointsRemaining() < 1) {
		levelUp();
	}
	
	attributes[attrIdx]++;
	attrPointsSpent++;
}
*/


// Adjust abilities
function canIncreaseAbility(abilIdx) {
	var abilScore = abilities[abilIdx];
	
	return abilScore < 5 && abilPointsRemaining() > abilScore;
}

function canDecreaseAbility(abilIdx) {
	var canDecrease = abilities[abilIdx] > 0;
	var failCondition;
	
	switch(abilIdx) {
		case abilityEnum.single_handed:
			failCondition = talents[talentEnum.anaconda] && abilities[abilityEnum.single_handed] <= 1;
			break;
		case abilityEnum.scoundrel:
			failCondition = 
				(talents[talentEnum.back_stabber] && abilities[abilityEnum.scoundrel] <= 1) ||
				(talents[talentEnum.headstrong] && abilities[abilityEnum.scoundrel] <= 5) ||
				(talents[talentEnum.swift_footed] && abilities[abilityEnum.scoundrel] <= 2);
			break;
		case abilityEnum.willpower:
			failCondition = 
				(talents[talentEnum.comeback_kid] && abilities[abilityEnum.willpower] <= 5) ||
				(talents[talentEnum.voluble_mage] && abilities[abilityEnum.willpower] <= 5);
			break;
		case abilityEnum.pyrotechnic:
			failCondition = talents[talentEnum.demon] && abilities[abilityEnum.pyrotechnic] <= 5;
			break;
		case abilityEnum.expert_marksman:
			failCondition = 
				(talents[talentEnum.expert_ranger] && abilities[abilityEnum.expert_marksman] <= 5) ||
				(talents[talentEnum.quickdraw] && abilities[abilityEnum.expert_marksman] <= 5) ||
				(talents[talentEnum.sidestep] && abilities[abilityEnum.expert_marksman] <= 2);
			break;
		case abilityEnum.sneaking:
			failCondition =
				(talents[talentEnum.guerilla] && abilities[abilityEnum.sneaking] <= 1) ||
				(talents[talentEnum.speedcreeper] && abilities[abilityEnum.sneaking] <= 1);
			break;
		case abilityEnum.hydrosophist:
			failCondition = talents[talentEnum.ice_king] && abilities[abilityEnum.hydrosophist] <= 5;
			break;
		case abilityEnum.aerotheurge:
			failCondition = talents[talentEnum.lightning_rod] && abilities[abilityEnum.aerotheurge] <= 5;
			break;
		case abilityEnum.body_building:
			failCondition =
				(talents[talentEnum.morning_person] && abilities[abilityEnum.body_building] <= 1) ||
				(talents[talentEnum.stand_your_ground] && abilities[abilityEnum.body_building] <= 5);
			break;
		case abilityEnum.man_at_arms:
			failCondition =
				(talents[talentEnum.opportunist] && abilities[abilityEnum.man_at_arms] <= 1) ||
				(talents[talentEnum.picture_of_health] && abilities[abilityEnum.man_at_arms] <= 2) ||
				(talents[talentEnum.sidewinder] && abilities[abilityEnum.man_at_arms] <= 5) ||
				(talents[talentEnum.thick_skin] && abilities[abilityEnum.man_at_arms] <= 1) ||
				(talents[talentEnum.weather_the_storm] && abilities[abilityEnum.man_at_arms] <= 5);
			break;
		case abilityEnum.geomancer:
			failCondition = talents[talentEnum.weatherproof] && abilities[abilityEnum.geomancer] <= 5;
			break;
		default:
			failCondition = false;
	}
	
	return canDecrease && !failCondition;
}

function increaseAbility(abilIdx) {
	if (!canIncreaseAbility(abilIdx)) {
		throw "Cannot increase ability";
	}
	
	abilities[abilIdx]++;
	abilPointsSpent += abilities[abilIdx];
}

function canDecreaseAbility(abilIdx) {
	if (!canDecreaseAbility(abilIdx)) {
		throw "Cannot decrease ability";
	}
	
	abilPointsSpent -= abilities[abilIdx];
	abilities[abilIdx]--;
}

// Adjust abilities WLU
/*
function canIncreaseAbilityWLU(abilIdx) {
	return abilities[abilIdx] < 5;
}

function increaseAbilityWLU(abilIdx) {
	if (!canIncreaseAbilityWLU(abilIdx)) {
		throw "Cannot increase ability WLU";
	}
	
	while(abilPointsRemaining() < abilities[abilIdx] + 1) {
		levelUp();
	}
	
	abilities[abilIdx]++;
	abilPointsSpent += abilities[abilIdx];
}
*/


// Adjust talents
function canAddTalent(talentIdx) {
	var canAdd = talents[talentIdx] && talentPointsRemaining() > 0;
	var specialCondition;
	
	switch(talentIdx) {
		case talentEnum.all_skilled_up:
			specialCondition = level >= 3;
			break;
		case talentEnum.anaconda:
			specialCondition = abilities[abilityEnum.single_handed] >= 1;
			break;
		case talentEnum.back_stabber:
			specialCondition = abilities[abilityEnum.scoundrel] >= 1;
			break;
		case talentEnum.bigger_and_better:
			specialCondition = level >= 5;
			break;
		case talentEnum.comeback_kid:
			specialCondition = abilities[abilityEnum.willpower] >= 5;
			break;
		case talentEnum.courageous:
			specialCondition = !talents[talentEnum.escapist];
			break;
		case talentEnum.demon:
			specialCondition = abilities[abilityEnum.pyrotechnic] >= 5;
			break;
		case talentEnum.elemental_ranger:
			specialCondition = abilities[abilityEnum.expert_marksman] >= 5;
			break;
		case talentEnum.escapist:
			specialCondition = !talents[talentEnum.courageous];
			break;
		case talentEnum.glass_cannon:
			specialCondition = level >= 5;
			break;
		case talentEnum.guerilla:
			specialCondition = abilities[abilityEnum.sneaking] >= 1;
			break;
		case talentEnum.headstrong:
			specialCondition = abilities[abilityEnum.scoundrel] >= 5;
			break;
		case talentEnum.ice_king:
			specialCondition = abilities[abilityEnum.hydrosophist] >= 5;
			break;
		case talentEnum.lightning_rod:
			specialCondition = abilities[abilityEnum.aerotheurge] >= 5;
			break;
		case talentEnum.morning_person:
			specialCondition = abilities[abilityEnum.body_building] >= 1;
			break;
		case talentEnum.opportunist:
			specialCondition = abilities[abilityEnum.man_at_arms] >= 1;
			break;
		case talentEnum.picture_of_health:
			specialCondition = abilities[abilityEnum.man_at_arms] >= 2;
			break;
		case talentEnum.quickdraw:
			specialCondition = abilities[abilityEnum.expert_marksman] >= 5;
			break;
		case talentEnum.sidestep:
			specialCondition = abilities[abilityEnum.expert_marksman] >= 2;
			break;
		case talentEnum.sidewinder:
			specialCondition = abilities[abilityEnum.man_at_arms] >= 5;
			break;
		case talentEnum.speedcreeper:
			specialCondition = abilities[abilityEnum.expert_marksman] >= 2;
			break;
		case talentEnum.stand_your_ground:
			specialCondition = abilities[abilityEnum.body_building] >= 5;
			break;
		case talentEnum.swift_footed:
			specialCondition = abilities[abilityEnum.scoundrel] >= 2;
			break;
		case talentEnum.thick_skin:
			specialCondition = abilities[abilityEnum.man_at_arms] >= 1;
			break;
		case talentEnum.voluble_mage:
			specialCondition = abilities[abilityEnum.willpower] >= 5;
			break;
		case talentEnum.weather_the_storm:
			specialCondition = abilities[abilityEnum.man_at_arms] >= 5;
			break;
		case talentNum.weatherproof:
			specialCondition = abilities[abilityEnum.geomancer] >= 5;
			break;
		default:
			specialCondition = true;
	}
	
	return canAdd && specialCondition;
}

function canRemoveTalent(talentIdx) {
	var canRemove = talents[talentIdx];
	var specialCondition;

	switch(talentIdx) {
		case talentEnum.all_skilled_up:
			specialCondition = abilityPointsRemaining() >= 2;
			break;
		case talentEnum.bigger_and_better:
			specialConditoin = attributePointsRemaining() >= 1;
			break;
		case talentEnum.lone_wolf:
			specialCondition = abilityPointsRemaining() >= level - 1;
			break;
		default:
			specialCondition = true;
	}
	
	return canRemove && specialCondition;
}

function addTalent(talentIdx) {
	if (!canAddTalent) {
		throw "Cannot add talent";
	}
	
	switch(talentIdx) {
		case talentEnum.all_skilled_up:
			abilityPoints += 2;
			break;
		case talentEnum.bigger_and_better:
			attributePoints++;
			break;
		case talentEnum.lone_wolf:
			abilityPoints += level - 1;
			break;
		case talentEnum.know_it_all:
			attributes[attributeEnum.intelligence]++;
			break;
		case talentEnum.politician:
			attributes[attributeEnum.intelligence]--;
			abilities[abilityEnum.charisma] += 2;
			break;
		case talentEnum.scientist:
			abilities[abilityEnum.blacksmithing]++;
			abilities[abilityEnum.crafting]++;
			break;
		default:
	}
	
	talents[talentIdx] = true;
	talentPointsSpent++;
}

function removeTalent(talentIdx) {
	if (!canRemoveTalent) {
		throw "Cannot remove talent";
	}
	
	switch(talentIdx) {
		case talentEnum.all_skilled_up:
			abilityPoints -= 2;
			break;
		case talentEnum.bigger_and_better:
			attributePoints--;
			break;
		case talentEnum.lone_wolf:
			abilityPoints -= level - 1;
			break;
		case talentEnum.know_it_all:
			attributes[attributeEnum.intelligence]--;
			break;
		case talentEnum.politician:
			attributes[attributeEnum.intelligence]++;
			abilities[abilityEnum.charisma] -= 2;
			break;
		case talentEnum.scientist:
			abilities[abilityEnum.blacksmithing]--;
			abilities[abilityEnum.crafting]--;
			break;
		default:
	}
	
	talents[talentIdx] = false;
	talentPointsSpent--;
}








































