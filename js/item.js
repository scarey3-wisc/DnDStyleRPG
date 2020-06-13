function Item(name){
	this.name = name;
}
//A catalogue of all the items designed thus far: their images, what they need, and the actions that they generate
Item.prototype.loadImage = function(loader){
	var url = "Resources/Images/Items/";
	var iconName = "Sword";
	if(this.name == "Shortsword")
		iconName = "Shortsword";
	if(this.name == "Mace")
		iconName = "Mace";
	if(this.name == "Dagger")
		iconName = "Dagger";
	if(this.name == "Longbow")
		iconName = "Bow";
	this.sprite = loader.loadImage(url + iconName + ".png");
}
Item.prototype.bodyPartsNeeded = function(){
	if(this.name == "Shortsword")
		return {num: 1, type: "hand"};
	if(this.name == "Mace")
		return {num: 2, type: "hand"};
	if(this.name == "Dagger")
		return {num: 1, type: "hand"};
	if(this.name == "Longbow")
		return {num: 2, type: "hand"};
}
Item.prototype.getAvailableActions = function(unit){
	if(this.name == "Shortsword")
		return Item.shortsword(unit);
	if(this.name == "Mace")
		return Item.mace(unit);
	if(this.name == "Dagger")
		return Item.dagger(unit);
	if(this.name == "Longbow")
		return Item.longbow(unit);
}
//The "best attack" is meant to be part of a progression system where, the more a unit uses ie a sword, the better the action it provides
Item.shortsword = function(unit){
	var actions = [];
	var bestAttack = "Whack";
	if(unit.getActionUseCount("Whack") > 1)
		bestAttack = "Slash";
	actions.push(bestAttack);
	return actions;
}
Item.mace = function(unit){
	var actions = [];
	var bestAttack = "Whack";
	if(unit.getActionUseCount("Whack") > 4)
		bestAttack = "Smash";
	actions.push(bestAttack);
	return actions;
}
Item.dagger = function(unit){
	var actions = [];
	var bestAttack = "Whack";
	if(unit.getActionUseCount("Slash") > 3)
		bestAttack = "Stab";
	actions.push(bestAttack);
	return actions;
}
Item.longbow = function(unit){
	var actions = [];
	var bestAttack = "Launch";
	if(unit.getActionUseCount("Launch") > 3)
		bestAttack = "Shoot";
	actions.push(bestAttack);
	return actions;
}
