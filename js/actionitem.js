function ActionItem(unit, actionName, controller, scenario){
	this.unit = unit;
	this.actionName = actionName;
	this.menuString = this.actionName;
	this.controller = controller;
	if(scenario)
		this.setupScenario(scenario);
	else
		this.discoverType(scenario);
}
ActionItem.prototype.setupScenario = function(scenario){
	this.doable = scenario.doable();
	this.whenSelected = scenario.whenSelected;
}
ActionItem.prototype.discoverType = function(){
	if(this.actionName == "Walk")
		this.setupType("move");
	if(this.actionName == "Dash")
		this.setupType("move");
	if(this.actionName == "March")
		this.setupType("move");
	if(this.actionName == "Run")
		this.setupType("move");
	if(this.actionName == "Whack")
		this.setupType("melee");
	if(this.actionName == "Knockout")
		this.setupType("melee");
	if(this.actionName == "Slash")
		this.setupType("melee");
	if(this.actionName == "Smash")
		this.setupType("melee");
	if(this.actionName == "Punch")
		this.setupType("melee");
	if(this.actionName == "Heal")
		this.setupType("touch");
	if(this.actionName == "Defend")
		this.setupType("self");
	if(this.actionName == "Crossbow")
		this.setupType("ranged");
	if(this.actionName == "Fireball")
		this.setupType("spell");
	if(this.actionName == "Wait")
		this.setupType("self");
	if(this.actionName.split(" ")[0] == "Drop")
		this.setupType("self");
	if(this.actionName.split(" ")[0] == "Take")
		this.setupType("self");
}
ActionItem.prototype.setupType = function(type){
	this.type = type;
	if(type == "move"){
		this.doable = this.moveDoable();
		this.whenSelected = this.whenMoveSelected;
		if(Math.floor(this.unit.stride) == 1)
			this.menuString = this.actionName + " (" + Math.floor(this.unit.stride) + " space)";
		else
			this.menuString = this.actionName + " (" + Math.floor(this.unit.stride) + " spaces)";
	}else if(type == "melee"){
		this.doable = this.meleeDoable();
		this.whenSelected = this.whenMeleeSelected;
		this.menuString = this.actionName + " (" + Math.floor(Melee.calculateDamage(this.actionName)) + " damage)";
	}else if(type == "touch"){
		this.doable = false;
		this.whenSelected = function(){};
	}else if(type == "self"){
		this.doable = this.selfDoable();
		this.whenSelected = this.getWhenSelfSelected();
	}else if(type == "ranged"){
		this.doable = false;
		this.whenSelected = function(){};
	}else if(type == "spell"){
		this.doable = false;
		this.whenSelected = function(){};
	}else{
		this.doable = false;
		this.whenSelected = function(){};
	}
}
ActionItem.prototype.selfDoable = function(){
	return SelfActionItems.getDoableFunction(this.unit, this.actionName)();
}
ActionItem.prototype.getWhenSelfSelected = function(){
	return SelfActionItems.getWhenSelectedFunction(this.unit, this.actionName, this.controller);
}
ActionItem.prototype.meleeDoable = function(){
	this.spaceList = [];
	var unit = this.unit;
	var map = unit.map;
	if(map.getContent({x:unit.x, y:unit.y+1}) && unit.canTravel(map.getEdge(unit.x, unit.y, 'd')))
		this.spaceList.push(map.getContent({x:unit.x, y:unit.y+1}));
	if(map.getContent({x:unit.x+1, y:unit.y}) && unit.canTravel(map.getEdge(unit.x, unit.y, 'r')))
		this.spaceList.push(map.getContent({x:unit.x+1, y:unit.y}));
	if(map.getContent({x:unit.x, y:unit.y-1}) && unit.canTravel(map.getEdge(unit.x, unit.y, 'u')))
		this.spaceList.push(map.getContent({x:unit.x, y:unit.y-1}));
	if(map.getContent({x:unit.x-1, y:unit.y}) && unit.canTravel(map.getEdge(unit.x, unit.y, 'l')))
		this.spaceList.push(map.getContent({x:unit.x-1, y:unit.y}));
	return this.spaceList.length > 0 && Melee.actionCapable(this.actionName, this.unit);
}
ActionItem.prototype.whenMeleeSelected = function(){
	this.controller.setMeleeMode(this.unit, this.actionName, this.spaceList);
}
ActionItem.prototype.moveDoable = function(){
	this.spaceList = this.unit.map.allReachable(this.unit, this.unit.stride);
	return this.spaceList.length > 0;
}
ActionItem.prototype.whenMoveSelected = function(){
	this.controller.setMovementMode(this.unit, this.spaceList);
}