function AI(unit){
	this.unit = unit;
	this.map = this.unit.map;
	this.controllerType = "Robot";
}
AI.prototype.generateActions = function(){
	var selfReference = this;
	var actionList = this.actionList = [];
	var unit = this.unit;
	unit.getActionList().forEach(function(item){
		actionList.push(new ActionItem(unit, item, selfReference));
	});
}
AI.prototype.actLikeDummy = function(){
	this.imitateDummy = true;
}
function Dummy(unit){
	AI.call(this, unit);
}
Dummy.prototype = Object.create(AI.prototype);
Dummy.prototype.constructor = Dummy;
Dummy.prototype.decide = function(){
	var found = null;
	this.generateActions();
	this.actionList.forEach(function(item){
		if(item.actionName == "Wait")
			found = item;
	});
	if(found)
		found.whenSelected();
	else{
		this.unit.control = false;
		this.unit.battle.considerTurnEnd();
	}
}
function SearchAndDestroy(unit, targets){
	AI.call(this, unit);
	this.targets = targets;
}
SearchAndDestroy.prototype = Object.create(AI.prototype);
SearchAndDestroy.prototype.constructor = SearchAndDestroy;
SearchAndDestroy.prototype.decide = function(){
	if(this.imitateDummy){
		delete this.imitateDummy;
		this.unit.control = false;
		this.unit.battle.considerTurnEnd();
	}else{
		this.seek();
	}
}
SearchAndDestroy.prototype.seek = function(){
	var selfReference = this;
	this.findPrimaryActions();
	var movement = this.movement;
	var wait = this.wait;
	var unit = this.unit;
	var targets = this.targets;
	for(var i = 0; i < this.targets.length; i++){
		if(!this.targets[i].x || !this.targets[i].y || !this.unit.map.getContent(this.targets[i].x, this.targets[i].y) == this.targets[i]){
			this.targets.splice(i, 1);
			i--;
		}
	}
	if(!movement || !movement.doable){
		this.destroy();
		return;
	}
	
	var moveList = movement.spaceList;
	var targetDist = unit.map.findDistances(unit, unit, targets);
	if(!(moveList && moveList.length > 0 && targetDist && targetDist.length > 0)){
		this.destroy();
		return;
	}
	var closestTarget = targetDist[0];
	targetDist.forEach(function(item){if(item.distance && item.distance < closestTarget.distance) closestTarget = item;});
	if(closestTarget.distance == 1){
		this.destroy();
		return;
	}	
	var sourceDist = unit.map.findDistances(unit, closestTarget, moveList);
	var closestLoc = sourceDist[0];
	sourceDist.forEach(function(item){if(item.distance && item.distance < closestLoc.distance) closestLoc = item;});
	var found;
	moveList.forEach(function(item){
		if(item.x == closestLoc.x && item.y == closestLoc.y)
			found = item;
		});
	if(!found){
		this.destroy();
		return;
	}
	var act = new Movement(unit, found, 
		function(){ 
			selfReference.destroy();
		}, function(){});
	unit.battle.doAction(act);
}
SearchAndDestroy.prototype.destroy = function(){
	var selfReference = this;
	this.findPrimaryActions();
	var attack = this.meleeAttack;
	var wait = this.wait;
	var unit = this.unit;
	var targets = this.targets;
	
	if(!attack || !attack.doable){
		this.wait.whenSelected();
		return;
	}
	
	var attackList = attack.spaceList;
	
	var found = null;
	
	attackList.forEach(function(target){
		if(targets.includes(target)){
			if(!found)
				found = target;
			else if (target.armor < found.armor)
				found = target;
		}
	});
	if(!found){
		this.wait.whenSelected();
		return;
	}
	var act = new Melee(unit, found, attack.actionName, function(){
		if(myDisplay.removeAnimation){
			myDisplay.removeAnimation(act.animation);
			selfReference.seek();
		}
		}, function(){});
	myDisplay.addAnimation(act.animation);
	unit.battle.doAction(act);
}
SearchAndDestroy.prototype.findPrimaryActions = function(){
	this.generateActions();
	var movement = null;
	var wait = null;
	var meleeAttack = null;
	this.actionList.forEach(function(item){
		if(item.actionName == "Wait" && item.doable)
			wait = item;
		if(item.type == "melee" && item.doable)
			meleeAttack = item;
		if(item.type == "move" && item.doable)
			movement = item;
	});
	this.movement = movement;
	this.wait = wait;
	this.meleeAttack = meleeAttack;
}