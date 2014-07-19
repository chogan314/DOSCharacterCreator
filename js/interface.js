for (var i = 0; i < attributeNames.length; i++) {
	var div = document.createElement('div');
	div.innerHTML = attributeNames[i];
	document.getElementById('attributes').appendChild(div);
}

for (var i = 0; i < abilityNames.length; i++) {
	var div = document.createElement('div');
	div.innerHTML = abilityNames[i];
	document.getElementById('abilities').appendChild(div);
}

for (var i = 0; i < talentNames.length; i++) {
	var div = document.createElement('div');
	div.innerHTML = talentNames[i];
	document.getElementById('talents').appendChild(div);
}

function UI() {

}