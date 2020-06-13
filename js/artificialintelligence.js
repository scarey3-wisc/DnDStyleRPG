//This file contains all of the AI code we've written thus far. We have a bit of polymorphism in that there may be mulitple
//types of AI. Right now, we just have the "Search and Destroy" AI that looks for the shortest path towards a target and then
//attacks that target.

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
	//When the AI is in Dummy mode, it just stands there and uses the "wait" command. That's actually useful:
	//It means we can have units not moving while the usual turn flow (where we don't move to the next turn until every
	//unit has run out of options) works for AI who aren't doing anything
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
	//A Search and Destroy AI can be made to do nothing for one turn but, unless the command keeps coming on subsequent turns,
	//its going to continue seeking the very next turn.
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
	//remove any targets that aren't on the map anymore
	for(var i = 0; i < this.targets.length; i++){
		if(!this.targets[i].x || !this.targets[i].y || !this.unit.map.getContent(this.targets[i].x, this.targets[i].y) == this.targets[i]){
			this.targets.splice(i, 1);
			i--;
		}
	}
	//if we can't move any more, just try to attack and be done
	if(!movement || !movement.doable){
		this.destroy();
		return;
	}
	
	var moveList = movement.spaceList;
	var targetDist = unit.map.findDistances(unit, unit, targets);
	//the ! makes this confusing - if there's no target, or if we're blocked from moving, try to attack and be done
	if(!(moveList && moveList.length > 0 && targetDist && targetDist.length > 0)){
		this.destroy();
		return;
	}
	
	var closestTarget = targetDist[0];
	targetDist.forEach(function(item){if(item.distance && item.distance < closestTarget.distance) closestTarget = item;});
	//if we're got a target right next to us, attack and be done
	if(closestTarget.distance == 1){
		this.destroy();
		return;
	}
	//the order of inputs can be deceptive: we're finding the distance to the enemy from each location that we could move to
	//so that we can determine which of our moves is the best
	var sourceDist = unit.map.findDistances(unit, closestTarget, moveList);
	var closestLoc = sourceDist[0];
	sourceDist.forEach(function(item){if(item.distance && item.distance < closestLoc.distance) closestLoc = item;});
	
	//our "closestLoc" space isn't the same object as the spaces in our moveList - this fixes that, with some safety code
	//if something goes wrong.
	var found;
	moveList.forEach(function(item){
		if(item.x == closestLoc.x && item.y == closestLoc.y)
			found = item;
		});
	
	if(!found){
		this.destroy();
		return;
	}
	
	//Generate the move command, then put it on the Battle's stack of actions as normal. Our "afterward" function goes back
	//to the AI, causing the AI to try attacking after it moves.
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
	//if we can't attack, we're done
	if(!attack || !attack.doable){
		this.wait.whenSelected();
		return;
	}
	
	var attackList = attack.spaceList;
	
	//find the weakest target within the spaces around us
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
	//generate our attack action, and execute it through the normal battle action stack. Also, try to seek a new target afterwards
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
	//Our unit might have a bunch of actions, but Search and Destroy is only concerned with moving and attacking
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
