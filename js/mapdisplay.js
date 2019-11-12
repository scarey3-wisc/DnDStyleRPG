function MapDisplay(map, cellSize, battle){
	let borderThickness = this.borderThickness = 2;
	let selfReference = this;
	this.map = map;
	this.battle = battle;
	this.cellSize = cellSize;
	this.background = document.createElement("CANVAS");
	this.background.width = cellSize * this.map.width + borderThickness;
	this.background.height = cellSize * this.map.height + borderThickness;
	this.xOffset = 0;
	this.yOffset = 0;
	this.xStartDrag = 0;
	this.yStartDrag = 0;
	this.xSavedOffset = 0;
	this.ySavedOffset = 0;
	this.loader = new ImageLoader();
	this.loader.onload = function(){
		drawBackground(selfReference.background, selfReference.backgroundImage);
		drawGrid(selfReference.background, map.width, map.height);
		selfReference.onload();
	}
	this.backgroundImage = this.loader.loadImage(map.backgroundURL);
	this.map.content.iterate(function(unit){
		unit.loadImage(selfReference.loader);
	});
	this.map.objects.iterate(function(itemList){
		if(itemList){
			itemList.forEach(function(item){
				item.loadImage(selfReference.loader);
			});
		}
	});
	this.prevCanvasWidth = 0;
	this.prevCanvasHeight = 0;
	this.dragging = false;
	this.highlightedLocation = null;
	this.defaultHighlightColor = '#6088dd';
	this.accentedSpaceList = [];
	this.animationList = [];
	
	function drawBackground(canvas, source){
		var ctx = canvas.getContext("2d");
		ctx.drawImage(source, 0, 0);
	}
	function drawGrid(canvas, width, height){
		var ctx = canvas.getContext("2d");
		ctx.translate(borderThickness/2, borderThickness/2);
		ctx.lineWidth = borderThickness;
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		for(var i = 0; i <= width; i++){
			ctx.moveTo(i * cellSize, 0);
			ctx.lineTo(i * cellSize, height * cellSize);
		}
		for(var j = 0; j <= height; j++){
			ctx.moveTo(0, j * cellSize);
			ctx.lineTo(width * cellSize, j * cellSize);
		}
		ctx.stroke();
	}
}
MapDisplay.prototype.conditionallyHighlight = function(mouseEvent, stroke, condition){
	var loc = this.convertClick(mouseEvent);
	var result = condition(loc, this.map.getContent(loc));
	if(result == 1)
		this.highlightedLocation = {x:loc.x, y:loc.y, stroke:stroke};
	else if(result == -1)
		this.highlightedLocation = null;
}
MapDisplay.prototype.unhighlight = function(loc){
	if(this.highlightedLocation && this.highlightedLocation.x == loc.x && this.highlightedLocation.y == loc.y)
		this.highlightedLocation = null;
}
MapDisplay.prototype.highlight = function(loc, stroke){
	this.highlightedLocation = {x:loc.x, y:loc.y, stroke:stroke};
}
MapDisplay.prototype.setAccentedSpaceList = function(locs, fill, border){
	this.accentedSpaceList = locs;
	this.accentedSpaceList.fill = fill;
	this.accentedSpaceList.border = border;
}
MapDisplay.prototype.clearAccentedSpaceList = function() {
	this.accentedSpaceList = [];
}
MapDisplay.prototype.addAnimation = function(anim){
	this.animationList.push(anim);
}
MapDisplay.prototype.removeAnimation = function(anim){
	var index = this.animationList.indexOf(anim);
	if(index != -1)
		this.animationList.splice(index, 1);
}
MapDisplay.prototype.startDrag = function(mouseEvent){
	if(mouseEvent.button == 0){
		this.dragging = true;
		this.xStartDrag = mouseEvent.offsetX;
		this.yStartDrag = mouseEvent.offsetY;
		this.xSavedOffset = this.xOffset;
		this.ySavedOffset = this.yOffset;
	}
}
MapDisplay.prototype.drag = function(mouseEvent){
	if(mouseEvent.buttons != 1){
		this.endDrag(mouseEvent);
	}else if(this.dragging){
		this.ignoreNextClick = true;
		var deltaX = this.xStartDrag - mouseEvent.offsetX;
		var deltaY = this.yStartDrag - mouseEvent.offsetY;
		deltaX = this.cellSize * Math.round(deltaX / this.cellSize);
		deltaY = this.cellSize * Math.round(deltaY / this.cellSize);
		this.xOffset = this.xSavedOffset + deltaX;
		this.yOffset = this.ySavedOffset + deltaY;
		
		if(this.xOffset < 0){
			this.xOffset = 0;
			this.xStartDrag = mouseEvent.offsetX;
			this.xSavedOffset = this.xOffset;
		}
		if(this.xOffset > this.background.width - this.prevCanvasWidth){
			this.xOffset = this.background.width - this.prevCanvasWidth
			this.xStartDrag = mouseEvent.offsetX;
			this.xSavedOffset = this.xOffset;
		}
		if(this.yOffset < 0){
			this.yOffset = 0;
			this.yStartDrag = mouseEvent.offsetY;
			this.ySavedOffset = this.yOffset;
		}
		if(this.yOffset > this.background.height - this.prevCanvasHeight){
			this.yOffset = this.background.height - this.prevCanvasHeight;
			this.yStartDrag = mouseEvent.offsetY;
			this.ySavedOffset = this.yOffset;
		}
	}
}
MapDisplay.prototype.endDrag = function(mouseEvent){
	this.dragging = false;
}
MapDisplay.prototype.convertClick = function(mouseEvent) {
	var x = mouseEvent.offsetX + this.xOffset;
	var y = mouseEvent.offsetY + this.yOffset;
	x = Math.floor(x / this.cellSize);
	y = Math.floor(y / this.cellSize);
	return {x: x, y: y};
}

MapDisplay.prototype.unitAt = function(mouseEvent) {
	return this.map.getContent(this.convertClick(mouseEvent));
}
MapDisplay.prototype.coordinatesOf = function(locs){
	return {x:locs.x * this.cellSize - this.xOffset, y:locs.y * this.cellSize - this.yOffset};
}
MapDisplay.prototype.paint = function(canvas){
	var selfReference = this;
	this.prevCanvasWidth = canvas.width;
	this.prevCanvasHeight = canvas.height;
	var cellSize = this.cellSize;
	var border = this.borderThickness;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(this.background, this.xOffset, this.yOffset, 
		canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.translate(-1 * this.xOffset, -1 * this.yOffset);
	this.map.objects.iterate(function(itemList){
		if(itemList){
			ctx.save();
			
			itemList.forEach(function(item, index){
				if(index == 0)
					ctx.translate(item.x * cellSize + border / 2 + cellSize / 2, item.y * cellSize + border / 2 + cellSize / 2);
				var xLoc = -item.sprite.width/2 - cellSize / 6;
				var yLoc = -item.sprite.height/2 - cellSize / 6;
				ctx.drawImage(item.sprite, xLoc, yLoc);
				ctx.rotate(45);
			});
			ctx.restore();
		}
	});
	this.accentedSpaceList.forEach(function(item) {
		ctx.lineWidth = border * 1.5;;
		ctx.lineJoin = 'bevel';
		if(this.fill){
			ctx.fillStyle = this.fill;
			ctx.fillRect(item.x * cellSize + border/2, item.y * cellSize + border/2, cellSize, cellSize);
		}
		if(this.border){
			ctx.strokeStyle = this.border;
			ctx.strokeRect(item.x * cellSize + border/2, item.y * cellSize + border/2, cellSize, cellSize);
		}
	}, this.accentedSpaceList);
	if(this.highlightedLocation != null && this.highlightedLocation.stroke){
		var hlu = this.highlightedLocation;
		ctx.strokeStyle = this.highlightedLocation.stroke;
		ctx.lineWidth = border * 1.5;;
		ctx.lineJoin = 'bevel';
		ctx.strokeRect(hlu.x * cellSize + border/2, hlu.y * cellSize + border/2, cellSize, cellSize);
	}
	this.map.content.iterate(function(unit){
		var showHealth = selfReference.highlightedLocation && unit.x == selfReference.highlightedLocation.x && unit.y == selfReference.highlightedLocation.y;
		selfReference.paintUnit(unit, ctx, showHealth || unit.showHealth);
	});
	this.animationList.forEach(function(anim){
		anim.draw(ctx, cellSize);
	});
	ctx.restore();
}
MapDisplay.prototype.paintUnit = function(unit, ctx, healthBar){
	var cellSize = this.cellSize;
	var border = this.borderThickness;
	ctx.save();
	ctx.translate(unit.x * cellSize + border / 2, unit.y * cellSize + border / 2);
	var xLoc = -0.1 * cellSize;
	var yLoc = -0.1 * cellSize;
	ctx.drawImage(unit.sprite, xLoc, yLoc, cellSize * 1.2, cellSize * 1.2);
	if(healthBar){
		var maxHP = unit.maxArmor;
		var columns = Math.min(6, maxHP);
		var rows = Math.ceil(maxHP/6);
		var unitHeight = cellSize * 0.15;
		var height = unitHeight * rows;
		var width = 6 * unitHeight;
		var unitWidth = width / columns;
		var borderWidth = 2;
	
		ctx.fillStyle = "#806060";
		ctx.lineWidth = borderWidth;
		ctx.lineJoin = 'bevel';
		ctx.fillRect(cellSize/2 - width/2, borderWidth, width, height);
	
	
		ctx.save();	
		ctx.translate(cellSize/2 - width/2, borderWidth);
		ctx.strokeStyle = "#202020";
	
		ctx.lineWidth = 0.8;
		for(var i = 0; i < maxHP; i++){
			var x = (i % 6) * unitWidth;;
			var y = Math.floor(i / 6) * unitHeight;
			if(i < unit.armor){
				ctx.fillStyle = "#c00000";
			}else{
				ctx.fillStyle = "#b0b0b0";
			}
			ctx.fillRect(x, y, unitWidth, unitHeight);
			ctx.strokeRect(x, y, unitWidth, unitHeight);
		}
		ctx.restore();
		ctx.strokeStyle = '#806060';
		ctx.strokeRect(cellSize/2 - width/2, borderWidth, width, height);
	}
	

	ctx.restore();
}

MapDisplay.prototype.onload = function(){}