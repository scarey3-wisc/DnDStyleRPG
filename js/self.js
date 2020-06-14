//This file contains several actions that involve instant activation, like waiting, picking up an object, etc. It basically just
//contains functions for checking whether those actions are allowed, and for what happens when they're selected.

var SelfActionItems = {};
SelfActionItems.getWhenSelectedFunction = function(unit, actionName, controller){
	var doer = {
		type: "self",
		unit: unit,
		animatedAction:false,
		afterUndoing:toMenu
	}
	
	
	if(actionName == "Wait"){
		doer.doAction = function(){unit.endTurn(); this.afterDoing();};
		doer.undoAction = function(){unit.unendTurn(); this.afterUndoing();};
		doer.afterDoing = function(){
			if(controller.controllerType == "Human"){
				controller.setNavigateMode(controller.myDisplay);
				controller.paint();
			}
			unit.battle.considerTurnEnd();
		}
		doer.afterUndoing = toMenu;
	}
	if(actionName.split(" ")[0] == "Drop"){
		var item = unit.getItem(actionName.split(" ")[1]);
		doer.doAction = function(){
			unit.removeItem(item);
			unit.map.placeItem(unit.x, unit.y, item);
			this.afterDoing();
		}
		doer.undoAction = function(){
			unit.map.removeItem(unit.x, unit.y, item);
			unit.addItem(item);
			this.afterUndoing();
		}
		doer.afterDoing = toMenu;
		doer.afterUndoing = toMenu;
	}
	if(actionName.split(" ")[0] == "Take"){
		var item = null;
		unit.map.getAllItems(unit.x, unit.y).forEach(function(foundItem){
			if(foundItem.name == actionName.split(" ")[1])
				item = foundItem;
		});
		doer.doAction = function(){
			unit.map.removeItem(unit.x, unit.y, item);
			unit.addItem(item);
			unit.numBonus--;
			this.afterDoing();
		}
		doer.undoAction = function(){
			unit.removeItem(item);
			unit.map.placeItem(unit.x, unit.y, item);
			unit.numBonus++;
			this.afterUndoing();
		}
		doer.afterDoing = toMenu;
		doer.afterUndoing = toMenu;
	}
	
	return doDoer;
	function doDoer(){
		unit.battle.doAction(doer);
	}
	function toMenu(){
		if(controller.controllerType == "Human"){
			controller.setActionMenuMode(unit);
			controller.paint();
		}
	}
}
SelfActionItems.getDoableFunction = function(unit, actionName){
	if(actionName == "Wait")
		return waitDoable;
	if(actionName.split(" ")[0] == "Drop")
		return dropDoable;
	if(actionName.split(" ")[0] == "Take")
		return pickupDoable;
	
	function pickupDoable(){
		var itemName = actionName.split(" ")[1];
		var item = null;
		unit.map.getAllItems(unit.x, unit.y).forEach(function(foundItem){
			if(foundItem.name == itemName)
				item = foundItem;
		});
		return unit.couldHold(item) && unit.numBonus > 0;
	}
	function waitDoable(){
		return true;
	}
	function dropDoable(){
		return true;
	}
}