//the ActionMenu is the window that appears when the user selects a unit
function ActionMenu(x, y, unit, mouseDelegate){
	var selfReference = this;
	this.x = x;
	this.y = y;
	this.unit = unit;
	this.unitHeight = 14;
	this.borderWidth = 3;
	this.spacing = 4;
	this.highlightedIndex = -1;
	this.backgroundImage = globalImageLibrary.getImage("ActionMenuBackground");
	this.x+= 2*this.borderWidth;
	this.mouseDelegate = mouseDelegate;
	//setting up all the actions that can be taken
	var actionList = this.actionList = [];
	this.actionList.push(new ActionItem(unit, unit.name + "'s Actions", mouseDelegate));
	this.unit.getActionList().forEach(function(item){
		actionList.push(new ActionItem(unit, item, mouseDelegate));
	});
	if(mouseDelegate.myDisplay.battle.scenarioActions)
		mouseDelegate.myDisplay.battle.scenarioActions(unit).forEach(function(item){
			actionList.push(new ActionItem(unit, item.actionName, mouseDelegate, item));
		});
	this.height = this.unitHeight * this.actionList.length + this.spacing * (this.actionList.length + 1);
}
ActionMenu.prototype.convertClick = function(mouseEvent){
	var x = mouseEvent.offsetX - this.x;
	var y = mouseEvent.offsetY - this.y;
	y -= this.spacing/2;
	var delta = this.unitHeight + this.spacing;
	var index = Math.floor(y / delta);
	return {validX: x >= 0 && this.width && x <= this.width, index: index};
}
ActionMenu.prototype.highlight = function(mouseEvent){
	var result = this.convertClick(mouseEvent);
	if(result.validX && result.index >= 0 && result.index < this.actionList.length && this.actionList[result.index].doable){
		this.highlightedIndex = result.index;
	}else{
		this.highlightedIndex = -1;
	}
}
ActionMenu.prototype.optionAt = function(mouseEvent){
	var result = this.convertClick(mouseEvent);
	if(result.validX){
		if(result.index >= 0 && result.index < this.actionList.length){
			return this.actionList[result.index];
		}
	}
	return null;
}
ActionMenu.prototype.paint = function(canvas){
	var ctx = canvas.getContext('2d');
	ctx.save();
	var regularFont = "italic " + this.unitHeight + "px Arial";
	var boldFont = "italic bold " + this.unitHeight + "px Arial";
	ctx.font = regularFont;
	ctx.textAlign = "start";
	ctx.textBaseline = "hanging";
	//calculating the width is an annoying, some what time consuming operation that requires actually measuring the text.
	//We don't do it in the constructor, because the constructor knows nothing about the canvas or its context. Instead,
	//we do it the first time the paint method is called, and never again.
	if(!this.width){
		var width = 0;
		this.actionList.forEach(function(action, index){
			if(index == 0)
				ctx.font = boldFont;
			width = Math.max(width, ctx.measureText(action.menuString).width);
			if(index == 0)
				ctx.font = regularFont;
		});
		this.width = width + 2 * this.spacing;
	}
	if(this.x + this.width > canvas.width){
		this.x -= (this.width + this.mouseDelegate.myDisplay.cellSize + 4 * this.borderWidth);
	}
	if(this.y + this.height > canvas.height){
		this.y -= (this.height - this.mouseDelegate.myDisplay.cellSize);
	}

	ctx.translate(this.x, this.y);
	ctx.fillStyle = ctx.createPattern(this.backgroundImage, "repeat");
	ctx.lineWidth = this.borderWidth;
	ctx.lineJoin = 'bevel';
	ctx.fillRect(0, 0, this.width, this.height);
	
	var j = this.spacing;
	var i = this.spacing;
	var delta = this.unitHeight + this.spacing;
	for(var index = 0; index < this.actionList.length; index++){
		if(index == 0)
			ctx.font = boldFont;
		var string = this.actionList[index].menuString;
		if(index == this.highlightedIndex){
			ctx.save();
			ctx.fillStyle = 'rgba(20, 20, 80, 0.4)';
			ctx.fillRect(0, j - this.spacing/2, this.width, this.unitHeight + this.spacing);
			ctx.restore();
		}
		ctx.fillStyle = '#ffffff';
		if(!this.actionList[index].doable){
			ctx.fillStyle = '#101010';
		}
		ctx.fillText(string, i, j + this.unitHeight * 0.11);
		if(index != this.actionList.length - 1){
			ctx.save();
			ctx.strokeStyle = '#000000';
			ctx.lineWidth = 0.8;
			ctx.beginPath();
			ctx.moveTo(this.spacing, j + this.unitHeight + this.spacing/2);
			ctx.lineTo(this.width - this.spacing, j + this.unitHeight + this.spacing/2);
			ctx.stroke();
			ctx.restore();
		}
		
		j += delta;
		if(index == 0)
			ctx.font = regularFont;
	}
	
	ctx.strokeStyle = '#203044';
	ctx.strokeRect(0, 0, this.width, this.height);
	ctx.restore();
}
