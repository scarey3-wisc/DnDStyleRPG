function Unit(name, speed, armor, maxArmor, items, team){
	this.name = name;
	this.speed = speed;
	this.armor = armor;
	this.maxArmor = maxArmor;
	this.control = false;
	//speed is how much distance you can cover in a turn; stride is how much movement you have left. 
	this.stride = speed;
	this.numActions = 1;
	this.numBonus = 1;
	//ninjaLevel is for recording how good a unit is at using its fists: fist fighting doesn't depend on weapons, and so can't
	//use the ordinary flow for generating actions (which looks at items)
	this.ninjaLevel = 0;
	this.team = team;
	this.items = items;
	this.actionUseCount = [];
	this.availableSlots = {
		hand: 2,
		foot: 1,
		chest: 1,
		head: 1
	}
	this.calculateItemSlots();
}
Unit.prototype.getItem = function(name){
	var found = null;
	this.items.forEach(function(item){
		if(item.name == name)
			found = item;
	});
	return found;
}
Unit.prototype.addItem = function(obj){
	this.items.push(obj);
	this.calculateItemSlots();
}
Unit.prototype.removeItem = function(obj){
	var index = this.items.indexOf(obj);
	if(index != -1)
		this.items.splice(index, 1);
	this.calculateItemSlots();
}
Unit.prototype.calculateItemSlots = function(){
	var filledSlots = this.filledSlots = {
		hand: 0,
		foot: 0,
		chest: 0,
		head: 0
	}
	this.items.forEach(function(item){
		var reqs = item.bodyPartsNeeded();
		filledSlots[reqs.type] += reqs.num;
	});
}
Unit.prototype.couldHold = function(item) {
	var reqs = item.bodyPartsNeeded();
	return this.availableSlots[reqs.type] >= this.filledSlots[reqs.type] + reqs.num;
}
Unit.prototype.getActionList = function(){
	var selfReference = this;
	var actionList = [];
	this.items.forEach(function(item){
		item.getAvailableActions(selfReference).forEach(function(string){
			if(!actionList.includes(string))
				actionList.push(string);
		});
	});
	if(this.filledSlots.hand == 0 || (this.filledSlots.hand < 2 && this.ninjaLevel > 0)){
		if(this.ninjaLevel == 0)
			actionList.push("Punch");
		if(this.ninjaLevel == 1)
			actionList.push("Knockout");
	}
		
	actionList.push("March");
	this.map.getAllItems(this.x, this.y).forEach(function(item){
		actionList.push("Take " + item.name);
	});
	this.items.forEach(function(item){
		actionList.push("Drop " + item.name);
	});
	
	actionList.push("Wait");
	return actionList;
}
Unit.prototype.getActionUseCount = function(actionName){
	if(this.actionUseCount[actionName])
		return this.actionUseCount[actionName];
	return 0;
}
//Primarily used as a hook for the battles.
Unit.prototype.wouldLearnFrom = function(actionName){
	var formerActionList = this.getActionList();
	if(!this.actionUseCount[actionName]){
		this.actionUseCount[actionName] = 0;
	}
	this.actionUseCount[actionName]++;
	var newActionList = this.getActionList();
	
	formerActionList.forEach(function(item){
		var index = newActionList.indexOf(item);
		if(index != -1)
			newActionList.splice(index, 1);
	});
	this.actionUseCount[actionName]--;
	return newActionList;
}
Unit.prototype.useAction = function(actionName){
	if(!this.actionUseCount[actionName]){
		this.actionUseCount[actionName] = 0;
	}
	this.actionUseCount[actionName]++;
}
Unit.prototype.unuseAction = function(actionName){
	if(this.actionUseCount[actionName]){
		this.actionUseCount[actionName] = Math.max(0, this.actionUseCount[actionName] - 1);
	}
}
Unit.prototype.loadImage = function(loader){
	var url = "Resources/Images/Sprites/";
	this.colorSprite = loader.loadImage(url + this.name + ".png");
	this.greyScaleSprite = loader.loadImage(url + this.name + "Grey" + ".png");
	this.sprite = this.colorSprite;
	this.items.forEach(function(value){
		value.loadImage(loader);
	});
}
//Right now, any terrain blocks movement - this method could be expanded or overwritten for units with special movement abilities.
Unit.prototype.canTravel = function(terrainType){
	return !terrainType;
}
Unit.prototype.travelCost = function(terrainType){
	if(!this.canTravel(terrainType))
		return;
	if(!terrainType)
		return 0;
	if(terrainType == "river")
		return 3;
	if(terrainType == "woods")
		return 1;
	if(terrainType == "cliff")
		return 4;
}
Unit.prototype.startTurn = function(){
	this.control = true;
	this.stride = this.speed;
	this.numActions = 1;
	this.numBonus = 1;
}
Unit.prototype.shouldEndTurn = function(){
	return this.stride < 1 && this.numActions == 0 && this.numBonus == 0;
}
Unit.prototype.endTurn = function(){
	this.control = false;
	this.sprite = this.greyScaleSprite;
}
Unit.prototype.resetColor = function(){
	this.sprite = this.colorSprite;
}
Unit.prototype.unendTurn = function(){
	this.control = true;
	this.sprite = this.colorSprite;
}

//A series of basic, default units we might want to create.
Unit.initBystander = function(name, x, y, map, battle){
	var dum = new Unit(name, 0, 1, 1, [], -1);
	dum.x = x;
	dum.y = y;
	dum.AI = new Dummy(dum);
	dum.battle = battle;
	dum.map = map;
	map.addUnit(dum);
	return dum;
}
Unit.initDummy = function(x, y, map, battle, team){
	var dum = new Unit("Dummy", 0, 1, 1, [], team);
	dum.x = x;
	dum.y = y;
	dum.AI = new Dummy(dum);
	dum.battle = battle;
	dum.map = map;
	map.addUnit(dum);
	return dum;
}
Unit.initSoldier = function(x, y, map, battle, team){
	var dum = new Unit("Soldier", 4, 2, 2, [new Item("Mace")], team);
	dum.x = x;
	dum.y = y;
	dum.AI = new Dummy(dum);
	dum.actionUseCount["Whack"] = 5;
	dum.battle = battle;
	dum.map = map;
	map.addUnit(dum);
	return dum;
}
Unit.initHeavy = function(x, y, map, battle, team){
	var dum = new Unit("Heavy", 4, 6, 6, [new Item("Mace")], team);
	dum.x = x;
	dum.y = y;
	dum.AI = new Dummy(dum);
	dum.actionUseCount["Whack"] = 5;
	dum.battle = battle;
	dum.map = map;
	map.addUnit(dum);
	return dum;
}
Unit.initLegionary = function(x, y, map, battle, team){
	var dum = new Unit("Legionary", 5, 4, 4, [new Item("Shortsword")], team);
	dum.x = x;
	dum.y = y;
	dum.AI = new Dummy(dum);
	dum.actionUseCount["Whack"] = 2;
	dum.battle = battle;
	dum.map = map;
	map.addUnit(dum);
	return dum;
}
Unit.initArcher = function(x, y, map, battle, team){
	var dum = new Unit("Archer", 6, 2, 2, [new Item("Longbow")], team);
	dum.x = x;
	dum.y = y;
	dum.AI = new Dummy(dum);
	dum.actionUseCount["Launch"] = 2;
	dum.battle = battle;
	dum.map = map;
	map.addUnit(dum);
	return dum;
}