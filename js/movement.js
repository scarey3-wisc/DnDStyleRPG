function Movement(unit, target, afterDoing, afterUndoing){
	this.animatedAction = true;
	this.type = "move";
	this.unit = unit;
	this.start = {x: unit.x, y: unit.y};
	this.end = {x: target.x, y: target.y};
	this.path = target.legacy;
	this.path.push(target);
	this.map = unit.map;
	this.afterDoing = afterDoing;
	this.afterUndoing = afterUndoing;
}
Movement.prototype.doAction = function(painter){
	this.map.content.remove(this.start.x, this.start.y);
	this.map.content.setAt(this.end.x, this.end.y, this.unit);
	var unit = this.unit;
	var start = this.start;
	var end = this.end;
	var path = this.path;
	var distance = path[path.length - 1].distance;
	unit.stride -= distance;
	var travelTime = 800 * distance / unit.speed;
	
	interpolateLocation = {
		time: 0,
		totalTime: travelTime,
		delay: 15,
		change: function(){
			var distanceTravelled = 1.0 * distance * this.time / this.totalTime;
			var index = 0;
			var first = path[index];
			var second = path[index + 1];
			while(distanceTravelled > second.distance){
				index++;
				first = path[index];
				second = path[index + 1];
			}                                                                                      
			var percentTravelled = (distanceTravelled - first.distance) / (second.distance - first.distance);
			unit.x = 1.0 * second.x * percentTravelled + first.x * (1.0 - percentTravelled);
			unit.y = 1.0 * second.y * percentTravelled + first.y * (1.0 - percentTravelled);
			this.time += this.delay;
		},
		finish: function(){
			unit.x = end.x;
			unit.y = end.y;
			if(unit.shouldEndTurn())
				unit.endTurn();
			deactivateRegularPainter();
		},
		done: function(){
			return this.time >= this.totalTime;
		}
	}
	interpolate(interpolateLocation, this.afterDoing);
	requestRegularPainter(painter);
}
Movement.prototype.undoAction = function(painter){
	this.map.content.remove(this.end.x, this.end.y);
	this.map.content.setAt(this.start.x, this.start.y, this.unit);
	var unit = this.unit;
	var start = this.start;
	var end = this.end;
	var path = this.path;
	var distance = path[path.length - 1].distance;
	unit.stride += distance;
	var travelTime = 300 * distance / unit.speed;
	if(!unit.control)
		unit.unendTurn();
	
	interpolateLocation = {
		time: 0,
		totalTime: travelTime,
		delay: 15,
		change: function(){
			var distanceTravelled = 1.0 * distance * this.time / this.totalTime;
			var index = path.length - 1;
			var first = path[index];
			var second = path[index - 1];
			while(distanceTravelled > distance - second.distance){
				index--;
				first = path[index];
				second = path[index - 1];
			}                                                                                      
			var percentTravelled = (distanceTravelled - (distance - first.distance)) / (first.distance - second.distance);
			unit.x = 1.0 * second.x * percentTravelled + first.x * (1.0 - percentTravelled);
			unit.y = 1.0 * second.y * percentTravelled + first.y * (1.0 - percentTravelled);
			painter();
			this.time += this.delay;
		},
		finish: function(){
			unit.x = start.x;
			unit.y = start.y;
		},
		done: function(){
			return this.time >= this.totalTime;
		}
	}
	interpolate(interpolateLocation, this.afterUndoing);
}