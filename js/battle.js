function Battle(map, delegate, teamNames){
	var selfReference = this;
	this.map = map;
	this.map.battle = this;
	this.actionStack = [];
	this.delegate = delegate;
	this.teamNames = teamNames;
	this.whoseTurn = -1;
	this.eventHooks = [];
	this.addStandardHooks();
}
Battle.prototype.addStandardHooks = function(){
	this.addHook(Battle.onLearnHook, Battle.learnNotification);
	this.addHook(Battle.onArmorBreakingHook, Battle.createDynamicNotification(function(act){
		return act.target.name + "'s armor broke!";
	}));
}
Battle.prototype.addHook = function(trigger, action){
	var delegate = this.delegate;
	var map = this.map;
	this.eventHooks.push({
		trigger:trigger, 
		result:action,
		delegate:delegate,
		map:map
		});
}
Battle.prototype.removeHook = function(hook){
	var index = this.eventHooks.indexOf(hook);
	this.eventHooks.splice(index, 1);
}
Battle.prototype.doAction = function(act){
	var delegate = this.delegate;
	this.eventHooks.forEach(function(hook){
		if(hook.trigger(act)){
			var afterwards = act.afterDoing;
			act.afterDoing = function(){hook.result(act, afterwards);};
		}
	});
	if(act.action && act.unit){
		var result = act.unit.useAction(act.action);
	}
	this.actionStack.push(act);
	act.doAction(function(){delegate.paint();});	
}
Battle.prototype.undoAction = function(){
	if(this.actionStack.length == 0)
		return;
	var act = this.actionStack.pop();
	var delegate = this.delegate;
	act.undoAction(function(){delegate.paint();});
	act.unit.unuseAction(act.action);
	return act;
}
Battle.prototype.considerTurnEnd = function(){
	var anyActive = false;
	var whoseTurn = this.whoseTurn;
	this.map.content.iterate(function(unit){
		if(unit.team == whoseTurn && unit.control)
			anyActive = true;
	});
	if(!anyActive)
		this.newTurn();
	return !anyActive;
}
Battle.prototype.playAsAI = function() {
	var selfReference = this;
	var whoseTurn = selfReference.whoseTurn;
	var allUnits = [];
	selfReference.map.content.iterate(function(unit){
		if(unit.team == whoseTurn){
			if(unit.AI && unit.AI.decide){
				allUnits.push(unit);
			}else{
				unit.control = false;
			}
		}
	});
	allUnits.forEach(function(unit){
		unit.AI.decide();
	});
}
Battle.prototype.setPlayerAppropriateDelegateMode = function(){
	var selfReference = this;
	if(this.whoseTurn == 0){
		this.delegate.setNavigateMode(this.delegate.myDisplay);
	}else{
		this.delegate.setModeSetup();
		setTimeout(function(){selfReference.playAsAI();}, 50);
	}
}
Battle.prototype.newTurn = function(skipBanner){
	var selfReference = this;
	var prevTurn = this.whoseTurn;
	var nextTurn = (this.whoseTurn + 1) % selfReference.teamNames.length;
	var nextTurnString = this.teamNames[nextTurn];
	
	selfReference.actionStack = [];
	selfReference.whoseTurn = nextTurn;
	selfReference.map.content.iterate(function(unit){
		if(unit.team == selfReference.whoseTurn)
			unit.startTurn();
	});
	this.delegate.paint();
	
	if(this.onTurnEndEvent){
		if(this.onTurnEndEvent())
			return;
	}
		
		
	if(!this.considerTurnEnd()){
		if(nextTurn == prevTurn)
			setTimeout(function(){
				resetBoard();
				selfReference.setPlayerAppropriateDelegateMode();
			}, 750);
			
		else{
			var delegate = this.delegate;
			if(skipBanner){
				selfReference.setPlayerAppropriateDelegateMode();
				resetBoard();
				delegate.paint();
			}else{
				delegate.makeAnnouncement(nextTurnString + " Turn", "Game-Flow", 2300, function(){
					selfReference.setPlayerAppropriateDelegateMode();
					resetBoard();
					delegate.paint();
				});
			}
		}
	}
	
	function resetBoard(){
		selfReference.map.content.iterate(function(unit){
			unit.resetColor();
		});
	}
}
Battle.onLearnHook = function(act){
	if(act.action && act.unit){
		this.listOfLearning = act.unit.wouldLearnFrom(act.action);
		if(this.listOfLearning.length > 0)
			return true;
	}else{
		return false;
	}
}
Battle.createOnUnitDeathHook = function(unit){
	return function(act){
		return act.type == "melee" && act.initHP == 0 && act.target == unit;
	};
}
Battle.createOnUnitEnterSpaceHook = function(unit, spaceList){
	return function(act){
		if(act.type != "move")
			return false;
		var entered = null;
		spaceList.forEach(function(loc){
			if(act.end.x == loc.x && act.end.y == loc.y){
				entered = loc;
			}
		});
		if(entered)
			return true;
		return false;
	}
}
Battle.createOnUnitDoingActionHook = function(actionName, unit){
	return function(act){
		return act.action == actionName && (!unit || act.unit == unit);
	};
}
Battle.onArmorBreakingHook = function(act){
	if(act.type == "melee"){
		if(act.initHP > 0 && act.damage >= act.initHP){
			return true;
		}
	}
	return false;
}
Battle.createDynamicNotification = function(creator){
	return function(act, afterwards){
		var delegate = this.delegate;
		delegate.makeAnnouncement(creator(act), "Notification", 3000, afterwards);
	}
}
Battle.createNotification = function(textString){
	return function(act, afterwards){
		var delegate = this.delegate;
		delegate.makeAnnouncement(textString, "Notification", 3000, afterwards);
	}
}
Battle.prototype.announce = function(textString, afterwards){
	this.delegate.makeAnnouncement(textString, "Notification", 3000, afterwards);
}
Battle.learnNotification = function(act, afterwards){
	var delegate = this.delegate;
	var result = this.listOfLearning;
	delete this.listOfLearning;
	var note = act.unit.name + " learned ";
	result.forEach(function(item, index){
		note += item;
		if(index + 1 < result.length)
			note += " and ";
	});
	delegate.makeAnnouncement(note, "Notification", 3000, afterwards);
}