function Melee(unit, target, action, afterDoing, afterUndoing){
	this.animatedAction = true;
	this.unit = unit;
	this.target = target;
	this.map = unit.map;
	this.type = "melee";
	this.action = action;
	this.afterDoing = afterDoing;
	this.afterUndoing = afterUndoing;
	this.killed = false;
	this.initStride = unit.stride;
	this.initActions = unit.numActions;
	this.initBonus = unit.numBonus;
	this.initHP = target.armor;
	this.damage = Melee.calculateDamage(action);
	this.cost = Melee.actionCost(action);
	this.generateAnimation();
}
Melee.prototype.doAction = function(painter){
	var target = this.target;
	target.showHealth = true;
	var killed = false;
	if(target.armor > 0){
		target.armor = Math.max(0, target.armor - this.damage);
	}else{
		this.map.content.remove(target.x, target.y);
		killed = this.killed = true;
	}
	var animation = this.animation;
	this.unit.numActions -= this.cost.actions;
	this.unit.numBonus -= this.cost.bonus;
	var unit = this.unit;
	if(this.cost.movement == "all")
		this.unit.stride = 0;
	else if(!isNaN(this.cost.movement))
		this.unit.stride -= this.cost.movement;
	
	animate = {
		delay: animation.delay,
		change: function(){
			animation.nextFrame();
		},
		finish: function(){
			if(unit.shouldEndTurn())
				unit.endTurn();
			delete target.showHealth;
			if(killed){
				delete target.x;
				delete target.y;
			}
			deactivateRegularPainter();
		},
		done: function(){
			return animation.done();
		}
	}
	interpolate(animate, this.afterDoing);
	requestRegularPainter(painter);
}
Melee.prototype.undoAction = function(painter){
	var target = this.target;
	target.showHealth = true;
	if(this.killed)
		this.map.content.setAt(target.x, target.y, target);
	target.armor = this.initHP;
	this.unit.stride = this.initStride;
	this.unit.numActions = this.initActions;
	this.unit.numBonus = this.initBonus;
	if(!this.unit.control)
		this.unit.unendTurn();
	
	animate = {
		timesDelayed: 0,
		delay: 40,
		change: function(){
			this.timesDelayed++;
			painter();
		},
		finish: function(){
			delete target.showHealth;
		},
		done: function(){
			return this.timesDelayed > 5;
		}
	}
	interpolate(animate, this.afterUndoing);
}
Melee.actionCapable = function(action, unit){
	var cost = Melee.actionCost(action);
	if(unit.numActions < cost.actions)
		return false;
	if(unit.numBonus < cost.bonus)
		return false;
	if(!isNaN(cost.movement) && unit.stride < cost.movement)
		return false;
	return true;
}
Melee.prototype.generateAnimation = function(){
	if(this.action == "Slash")
		this.animation = new Animation(globalImageLibrary.getImage("Slash"), this.target, 5, 2, 6, 50);
	if(this.action == "Stab")
		this.animation = new Animation(globalImageLibrary.getImage("Slash"), this.target, 5, 2, 6, 50);
	if(this.action == "Whack")
		this.animation = new Animation(globalImageLibrary.getImage("Bash"), this.target, 4, 1, 4, 100);
	if(this.action == "Smash")
		this.animation = new Animation(globalImageLibrary.getImage("Bash"), this.target, 4, 1, 4, 100);
	if(this.action == "Punch")
		this.animation = new Animation(globalImageLibrary.getImage("Hit"), this.target, 5, 2, 6, 50);
	if(this.action == "Knockout")
		this.animation = new Animation(globalImageLibrary.getImage("Hit"), this.target, 5, 2, 6, 50);
}
Melee.actionCost = function(action){
	if(action == "Slash")
		return {actions:1, bonus:0, movement:0};
	if(action == "Stab")
		return {actions:0, bonus:1, movement:'all'};
	if(action == "Whack")
		return {actions:1, bonus:0, movement:'all'};
	if(action == "Smash")
		return {actions:1, bonus:0, movement:'all'};
	if(action == "Punch")
		return {actions:1, bonus:0, movement:'all'};
	if(action == "Knockout")
		return {actions:0, bonus:1, movement:'all'};
}
Melee.calculateDamage = function(action){
	if(action == "Slash")
		return 1;
	if(action == "Stab")
		return 1;
	if(action == "Smash")
		return 2;
	if(action == "Punch")
		return 0;
	if(action == "Knockout")
		return 0;
	if(action == "Whack")
		return 1;
}