var attributeNames = ["Strength", "Dexterity", "Intelligence", "Constitution", "Speed", "Perception"];

var abilityNames = ["Bow", "Crossbow", "Single-handed", "Two-handed", "Armour Specialist", "Body Building", "Shield Specialist", "Willpower", "Aerotheurge", "Expert Marksman", "Geomancer", "Hydrosophist", "Man-at-Arms", "Pyrokinetic", "Scoundrel", "Witchcraft", "Bartering", "Charisma", "Leadership", "Lucky Charm", "Blacksmithing", "Crafting", "Loremaster", "Telekinesis", "Lockpicking", "Pickpocketing", "Sneaking"];

var talentNames = ["All Skilled Up", "Anaconda", "Arrow Recovery", "Back-Stabber", "Bigger and Better", "Bully", "Comeback Kid", "Courageous", "Demon", "Elemental Affinity", "Elemental Ranger", "Escapist", "Far Out Man", "Five-Star Diner", "Glass Cannon", "Guerilla", "Headstrong", "Ice King", "Know-it-All", "Leech", "Light Stepper", "Lightning Rod", "Lone Wolf", "Morning Person", "My Precious", "Opportunist", "Packmule", "Pet Pal", "Picture of Health", "Politician", "Quickdraw", "Scientist", "Sidestep", "Sidewinder", "Speedcreeper", "Stand your Ground", "Stench", "Swift Footed", "Thick Skin", "Voluble Mage", "Walk it Off", "Weather the Storm", "Weatherproof", "What a Rush", "Zombie"];

var statTypeEnum = {
	attribute: 0,
	ability: 1,
	talent: 2
}

var attributeEnum = {
	strength: 0,
	dexterity: 1,
	intelligence: 2,
	constitution: 3,
	speed: 4,
	perception: 5
}

var abilityEnum = {
	bow: 0,
	crossbow: 1,
	single_handed: 2,
	two_handed: 3,
	armour_specialist: 4,
	body_building: 5,
	shield_specialist: 6,
	willpower: 7,
	aerotheurge: 8,
	expert_marksman: 9,
	geomancer: 10,
	hydrosophist: 11,
	man_at_arms: 12,
	pyrokinetic: 13,
	scoundrel: 14,
	witchcraft: 15,
	bartering: 16,
	charisma: 17,
	leadership: 18,
	lucky_charm: 19,
	blacksmithing: 20,
	crafting: 21,
	loremaster: 22,
	telekinesis: 23,
	lockpicking: 24,
	pickpocketing: 25,
	sneaking: 26
}

var firstSkillIdx = abilityEnum.aerotheurge;
var lastSkillIdx = abilityEnum.witchcraft;
var numSkills = lastSkillIdx - firstSkillIdx;

var talentEnum = {
	all_skilled_up: 0,
	anaconda: 1,
	arrow_recovery: 2,
	back_stabber: 3,
	bigger_and_better: 4,
	bully: 5,
	comeback_kid: 6,
	courageous: 7,
	demon: 8,
	elemental_affinity: 9,
	elemental_ranger: 10,
	escapist: 11,
	far_out_man: 12,
	five_star_diner: 13,
	glass_cannon: 14,
	guerilla: 15,
	headstrong: 16,
	ice_king: 17,
	know_it_all: 18,
	leech: 19,
	light_stepper: 20,
	lightning_rod: 21,
	lone_wolf: 22,
	morning_person: 23,
	my_precious: 24,
	opportunist: 25,
	packmule: 26,
	pet_pal: 27,
	picture_of_health: 28,
	politician: 29,
	quickdraw: 30,
	scientist: 31,
	sidestep: 32,
	sidewinder: 33,
	speedcreeper: 34,
	stand_your_ground: 35,
	stench: 36,
	swift_footed: 37,
	thick_skin: 38,
	voluble_mage: 39,
	walk_it_off: 40,
	weather_the_storm: 41,
	weatherproof: 42,
	what_a_rush: 43,
	zombie: 44
}