function MouseDelegate(canvas){
	this.canvas = canvas;
	this.mode = null;
	this.controllerType = "Human";
}
MouseDelegate.prototype.updateMouseCoords = function(mouseEvent){
	this.mouseX = mouseEvent.offsetX;
	this.mouseY = mouseEvent.offsetY;
}
MouseDelegate.prototype.setModeSetup = function(){
	if(this.closeMode){
		this.closeMode();
	}
	this.resetListeners();
}
MouseDelegate.prototype.triggerUndo = function(){
	var act = this.myDisplay.battle.undoAction();
	if(act && act.animatedAction){
		this.myDisplay.unhighlight(act.unit);
		this.setWaitingMode();
	}else if(act && act.afterUndoing){
		act.afterUndoing();
	}else{
		this.setNavigateMode(this.myDisplay);
	}
}
MouseDelegate.prototype.resetListeners = function () {
	var selfReference = this;
	this.canvas.onmousedown = function (mouseEvent) { return false; };
	this.canvas.onmouseup = function (mouseEvent) { return false; };
	this.canvas.onmousemove = function (mouseEvent) { selfReference.updateMouseCoords(mouseEvent); return false; };
	this.canvas.onclick = function (mouseEvent) { return false; };
	this.canvas.onkeyup = function(keyEvent) { return false; };
	this.mode = "unset";
}
MouseDelegate.prototype.setAnnouncementMode = function(announcement){
	if(this.closeMode){
		this.closeMode();
	}
	this.resetListeners();
	this.canvas.onkeyup = function(keyEvent) {
		if(keyEvent.keyCode == 32){
			announcement.endEarly();
		}
	};
	canvas.onclick = function(mouseEvent){
		if(announcement.type == "Notification"){
			announcement.endEarly();
		}
	}
}
MouseDelegate.prototype.setSceneMode = function(myDisplay){
	this.setModeSetup();
	this.mode = "Scene";
	this.myDisplay = myDisplay;
}
MouseDelegate.prototype.setConversationMode = function(conversation, display){
	var selfReference = this;
	this.setModeSetup();
	this.mode = "Scene";
	this.conversation = conversation;
	if(display)
		this.myDisplay = display;
	
	this.canvas.onkeyup = function(keyEvent) {
		if(keyEvent.keyCode == 32 || keyEvent.keyCode == 13){
			if(conversation.talking)
				conversation.talking = false;
			else
				conversation.currentState.nextFunction();
		}
		if(keyEvent.keyCode == 37){
			conversation.arrowClicked("l");
			selfReference.paint();
		}
		if(keyEvent.keyCode == 38){
			conversation.arrowClicked("u");
			selfReference.paint();
		}
		if(keyEvent.keyCode == 39){
			conversation.arrowClicked("r");
			selfReference.paint();
		}
		if(keyEvent.keyCode == 40){
			conversation.arrowClicked("d");
			selfReference.paint();
		}
	};
	this.closeMode = function(){
		delete this.conversation;
		delete this.closeMode;
	}
	conversation.onload = function(){
		selfReference.paint();
	}
}
MouseDelegate.prototype.setNavigateMode = function(myDisplay){
	this.setModeSetup();
	this.mode = "Navigate";
	var selfReference = this;
	var canvas = this.canvas;
	this.myDisplay = myDisplay;
	myDisplay.conditionallyHighlight({offsetX: this.mouseX, offsetY: this.mouseY}, myDisplay.defaultHighlightColor, function(loc, unit){
		if(unit && unit.control)
			return 1;
		return -1;
	});
	
	
	canvas.onmousedown = function(mouseEvent) { myDisplay.startDrag(mouseEvent); };
	canvas.onmouseup = function(mouseEvent) { myDisplay.endDrag(mouseEvent); };
	canvas.onmousemove = function(mouseEvent){
		selfReference.updateMouseCoords(mouseEvent);
		myDisplay.drag(mouseEvent);
		myDisplay.conditionallyHighlight(mouseEvent, null, function(loc, unitFound){
			if(myDisplay.dragging)
				return 0;
			if(unitFound)
				return 1;
			return -1;
		});
		myDisplay.conditionallyHighlight(mouseEvent, myDisplay.defaultHighlightColor, function(loc, unit){
			if(myDisplay.dragging)
				return 0;
			if(unit && unit.control)
				return 1;
			return 0;
		});
		myDisplay.paint(canvas);
	}
	canvas.onclick = function(mouseEvent) {
		var unit = myDisplay.unitAt(mouseEvent);
		if(unit && unit.control){
			selfReference.setActionMenuMode(unit);
		}
	}
	canvas.onkeyup = function(keyEvent) {
		if(keyEvent.keyCode == 90 && keyEvent.ctrlKey)
			selfReference.triggerUndo();
	}
	this.paint();
}
MouseDelegate.prototype.setWaitingMode = function(unit){
	this.setModeSetup();
	this.mode = "Waiting";
	var selfReference = this;
	var canvas = this.canvas;
	var myDisplay = this.myDisplay;
	myDisplay.conditionallyHighlight({offsetX: this.mouseX, offsetY: this.mouseY}, myDisplay.defaultHighlightColor, function(loc, unitFound){
		if(unitFound && unitFound.control && unitFound != unit)
			return 1;
		return -1;
	});
	
	canvas.onmousedown = function(mouseEvent) { myDisplay.startDrag(mouseEvent); };
	canvas.onmouseup = function(mouseEvent) { myDisplay.endDrag(mouseEvent); };
	canvas.onmousemove = function(mouseEvent){
		selfReference.updateMouseCoords(mouseEvent);
		myDisplay.drag(mouseEvent);
		myDisplay.conditionallyHighlight(mouseEvent, null, function(loc, unitFound){
			if(myDisplay.dragging)
				return 0;
			if(unitFound)
				return 1;
			return -1;
		});
		myDisplay.conditionallyHighlight(mouseEvent, myDisplay.defaultHighlightColor, function(loc, unitFound){
			if(myDisplay.dragging)
				return 0;
			if(unitFound && unitFound.control && unitFound != unit)
				return 1;
			return 0;
		});
		myDisplay.paint(canvas);
	}
}
MouseDelegate.prototype.setActionMenuMode = function(unit){
	this.setModeSetup();
	this.mode = "Action Menu";
	var selfReference = this;
	var canvas = this.canvas;
	var coords = this.myDisplay.coordinatesOf({x:unit.x + 1, y:unit.y});
	var actionMenu = this.actionMenu = new ActionMenu(coords.x, coords.y, unit, this);
	this.myDisplay.highlight(unit, this.myDisplay.defaultHighlightColor);
	actionMenu.paint(canvas);
	actionMenu.highlight({offsetX:this.mouseX, offsetY:this.mouseY});
	
	canvas.onmousemove = function(mouseEvent){
		selfReference.updateMouseCoords(mouseEvent);
		actionMenu.highlight(mouseEvent);
		actionMenu.paint(canvas);
	}
	
	canvas.onclick = function(mouseEvent){
		var action = actionMenu.optionAt(mouseEvent);
		if(action){
			if(action.doable){
				action.whenSelected();
			}
		}else{
			selfReference.setNavigateMode(selfReference.myDisplay, mouseEvent);
			selfReference.canvas.onclick(mouseEvent);
		}
	}
	canvas.onkeyup = function(keyEvent) {
		if(keyEvent.keyCode == 90 && keyEvent.ctrlKey){
			selfReference.triggerUndo();
		}
		if(keyEvent.keyCode == 32){
			var found = null;
			actionMenu.actionList.forEach(function(listItem){
				if(listItem.actionName == "Wait")
					found = listItem;
			});
			if(found && found.doable)
				found.whenSelected();
		}
	}
	this.closeMode = function(){
		delete this.actionMenu;
		delete this.closeMode;
	}
	this.paint();
}
MouseDelegate.prototype.setMeleeMode = function(unit, action, spaceList){
	this.setModeSetup();
	this.mode = "Melee";
	var selfReference = this;
	var canvas = this.canvas;
	var myDisplay = this.myDisplay;
	
	var stroke = "#aa2020";
	var fill = "rgba(255, 50, 50, 0.25)";
	var megaHighlight = "#ff3030";
	/*if(purpose == "aid"){
		stroke = "#20d020";
		megaHighlight = "#40ff40";
		fill = "rgba(0, 255, 0, 0.2)";
	}*/
	
	myDisplay.setAccentedSpaceList(spaceList, fill, stroke);
	
	canvas.onmousedown = function(mouseEvent) { myDisplay.startDrag(mouseEvent); };
	canvas.onmouseup = function(mouseEvent) { 
		myDisplay.endDrag(mouseEvent);
		return false;
	};
	canvas.onmousemove = function(mouseEvent){
		selfReference.updateMouseCoords(mouseEvent);
		myDisplay.drag(mouseEvent);
		myDisplay.conditionallyHighlight(mouseEvent, null, function(loc, unitFound){
			if(myDisplay.dragging)
				return 0;
			if(unitFound)
				return 1;
			return -1;
		});
		myDisplay.conditionallyHighlight(mouseEvent, myDisplay.defaultHighlightColor, function(loc, unitFound){
			if(myDisplay.dragging)
				return 0;
			if(unitFound && unitFound.control && unitFound != unit)
				return 1
			return 0;
		});
		myDisplay.conditionallyHighlight(mouseEvent, megaHighlight, function(loc, unitFound){
			if(myDisplay.dragging)
				return 0;
			var found = false;
			spaceList.forEach(function(item){
				if(loc.x == item.x && loc.y == item.y)
					found = true;
			});
			if(found)
				return 1;
			return 0;
		});
		myDisplay.paint(canvas);
	}
	canvas.onclick = function(mouseEvent){
		var clicked = myDisplay.convertClick(mouseEvent);
		var found = null;
		spaceList.forEach(function(item){
			if(item.x == clicked.x && item.y == clicked.y)
				found = item;
		});
		if(found){
			var act = new Melee(unit, found, action, function(){
				if(!myDisplay.battle.considerTurnEnd()){
					if(unit.control)
						selfReference.setActionMenuMode(unit);
					else
						selfReference.setNavigateMode(selfReference.myDisplay);
				}
				selfReference.myDisplay.removeAnimation(act.animation);
				selfReference.paint();
			}, function(){
				selfReference.setActionMenuMode(unit);
				selfReference.paint();
			});
			myDisplay.addAnimation(act.animation);
			myDisplay.battle.doAction(act);
			selfReference.setWaitingMode(unit);
		}else{
			selfReference.setNavigateMode(selfReference.myDisplay, mouseEvent);
			selfReference.canvas.onclick(mouseEvent);
		}
	}
	
	this.closeMode = function(){
		myDisplay.clearAccentedSpaceList();
		delete this.closeMode;
	}
	this.paint();
}
MouseDelegate.prototype.setMovementMode = function(unit, spaceList){
	this.setModeSetup();
	this.mode = "Movement";
	var selfReference = this;
	var canvas = this.canvas;
	var myDisplay = this.myDisplay;

	myDisplay.setAccentedSpaceList(spaceList, "rgba(50, 140, 255, 0.4)", null);
	
	canvas.onmousedown = function(mouseEvent) { myDisplay.startDrag(mouseEvent); };
	canvas.onmouseup = function(mouseEvent) { myDisplay.endDrag(mouseEvent); };
	canvas.onmousemove = function(mouseEvent){
		selfReference.updateMouseCoords(mouseEvent);
		myDisplay.drag(mouseEvent);
		myDisplay.conditionallyHighlight(mouseEvent, null, function(loc, unitFound){
			if(myDisplay.dragging)
				return 0;
			if(unitFound)
				return 1;
			return -1;
		});
		myDisplay.conditionallyHighlight(mouseEvent, myDisplay.defaultHighlightColor, function(loc, unitFound){
			if(myDisplay.dragging)
				return 0;
			if(unitFound && unitFound.control && unitFound != unit)
				return 1
			return 0;
		});
		myDisplay.conditionallyHighlight(mouseEvent, "#6088dd", function(loc, unitFound){
			if(myDisplay.dragging)
				return 0;
			var found = false;
			spaceList.forEach(function(item){
				if(loc.x == item.x && loc.y == item.y)
					found = true;
			});
			if(found)
				return 1;
			return 0;
		});
		myDisplay.paint(canvas);
	}
	canvas.onclick = function(mouseEvent){
		var clicked = myDisplay.convertClick(mouseEvent);
		var found = null;
		spaceList.forEach(function(item){
			if(item.x == clicked.x && item.y == clicked.y)
				found = item;
		});
		if(found){
			var act = new Movement(unit, found, function(){
				if(!myDisplay.battle.considerTurnEnd()){
					if(unit.control)
						selfReference.setActionMenuMode(unit);
					else
						selfReference.setNavigateMode(selfReference.myDisplay);
				}
				selfReference.paint();
			}, function(){
				selfReference.setActionMenuMode(unit);
				selfReference.paint();
			});
			myDisplay.battle.doAction(act);
			selfReference.setWaitingMode(unit);
		}else{
			selfReference.setNavigateMode(selfReference.myDisplay, mouseEvent);
			selfReference.canvas.onclick(mouseEvent);
		}
	}
	
	this.closeMode = function(){
		myDisplay.clearAccentedSpaceList();
		delete this.closeMode;
	}
	this.paint();
}
MouseDelegate.prototype.makeAnnouncement = function(words, type, time, afterwards){
	var selfReference = this;
	this.announcement = new Announcement(words, type);
	this.setAnnouncementMode(this.announcement);
	this.myDisplay.highlightedLocation = null;
	this.paint();
	this.announcement.announce(time, function(){selfReference.paint();}, 
		function(){
			delete selfReference.announcement;
			if(afterwards)
				afterwards();
		});
}
MouseDelegate.prototype.paint = function () {
	if(this.myDisplay)
		this.myDisplay.paint(this.canvas);
	if(this.actionMenu)
		this.actionMenu.paint(this.canvas);
	if(this.announcement)
		this.announcement.paint(this.canvas);
	if(this.conversation)
		this.conversation.paint(this.canvas);
}