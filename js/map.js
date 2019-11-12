function Map(width, height, backgroundURL){
	this.width = width;
	this.height = height;
	this.backgroundURL = backgroundURL;
	this.territory = [];
	this.territory.width = this.width;
	this.territory.height = this.height;
	this.territory.getAt = getAt;
	this.territory.setAt = setAt;
	this.territory.remove = remove;
	this.territory.iterate = iterate;
	this.content = [];
	this.content.width = this.width;
	this.content.height = this.height;
	this.content.getAt = getAt;
	this.content.setAt = setAt;
	this.content.remove = remove;
	this.content.iterate = iterate;
	this.objects = [];
	this.objects.width = this.width;
	this.objects.height = this.height;
	this.objects.iterate = iterate;
	this.verticalEdges = [];
	this.verticalEdges.width = this.width;
	this.verticalEdges.height = this.height - 1;
	this.verticalEdges.getAt = getAt;
	this.verticalEdges.setAt = setAt;
	this.verticalEdges.remove = remove;
	this.verticalEdges.iterate = iterate;
	this.horizontalEdges = [];
	this.horizontalEdges.width = this.width - 1;
	this.horizontalEdges.height = this.height;
	this.horizontalEdges.getAt = getAt;
	this.horizontalEdges.setAt = setAt;
	this.horizontalEdges.remove = remove;
	this.horizontalEdges.iterate = iterate;
	
	function getAt(x, y){
		if(this[x]){
			return this[x][y];
		}
	}
	function setAt(x, y, obj){
		if(x < 0 || y < 0 || x >= this.width || y >= this.height){
			return;
		}
		if(!this[x]){
			this[x] = [];
		}
		this[x][y] = obj;
	}
	function remove(x, y){
		if(this[x] && this[x][y]){
			delete this[x][y];
		}
	}
	function iterate(callback){
		this.forEach(function(column, columnNum){
			if(column)
				column.forEach(function (item, rowNum){
					if(item)
						callback(item, columnNum, rowNum);
				});
		});
	}
}
Map.prototype.placeItem = function(x, y, obj){
	if(x < 0 || y < 0 || x >= this.width || y >= this.height)
		return;
	if(!this.objects[x])
		this.objects[x] = [];
	if(!this.objects[x][y])
		this.objects[x][y] = [];
	this.objects[x][y].push(obj);
	obj.x = x;
	obj.y = y;
}
Map.prototype.removeItem = function(x, y, obj){
	if(x < 0 || y < 0 || x >= this.width || y >= this.height)
		return;
	if(!this.objects[x])
		return;
	if(!this.objects[x][y])
		return;
	var index = this.objects[x][y].indexOf(obj);
	if(index != -1)
		this.objects[x][y].splice(index, 1);
	delete obj.x;
	delete obj.y;
}
Map.prototype.getAllItems = function(x, y){
	if(x < 0 || y < 0 || x >= this.width || y >= this.height)
		return [];
	if(!this.objects[x])
		return [];
	if(!this.objects[x][y])
		return [];
	return this.objects[x][y];
}
Map.prototype.addFeature = function(x, y, content){
	this.territory.setAt(x, y, content);
}
Map.prototype.addEdge = function(x, y, direction, content){
	if(direction == "u")
		this.verticalEdges.setAt(x, y - 1, content);
	if(direction == "d")
		this.verticalEdges.setAt(x, y, content);
	if(direction == "l")
		this.horizontalEdges.setAt(x - 1, y, content);
	if(direction == "r")
		this.horizontalEdges.setAt(x, y, content);
}
Map.prototype.getEdge = function(x, y, direction){
	if(direction == "u")
		return this.verticalEdges.getAt(x, y - 1);
	if(direction == "d")
		return this.verticalEdges.getAt(x, y);
	if(direction == "l")
		return this.horizontalEdges.getAt(x - 1, y);
	if(direction == "r")
		return this.horizontalEdges.getAt(x, y);
}
Map.prototype.dropObject = function(x, y, object){
	
}
Map.prototype.addUnit = function(unit){
	this.content.setAt(unit.x, unit.y, unit);
}
Map.prototype.getContent = function(locs){
	return this.content.getAt(locs.x, locs.y);
}
Map.prototype.isAdjacent = function(unit, loc){
	if(unit.x + 1 == loc.x && unit.y == loc.y)
		return unit.canTravel(this.getEdge(unit.x, unit.y, 'r'));
	if(unit.x - 1 == loc.x && unit.y == loc.y)
		return unit.canTravel(this.getEdge(unit.x, unit.y, 'l'));
	if(unit.x == loc.x && unit.y + 1 == loc.y)
		return unit.canTravel(this.getEdge(unit.x, unit.y, 'd'));
	if(unit.x == loc.x && unit.y - 1 == loc.y)
		return unit.canTravel(this.getEdge(unit.x, unit.y, 'u'));
	return false;
}
Map.prototype.allWithinRadius = function(loc, distance){
	var result = [];
	for(var i = Math.max(0, loc.x - distance); i <= Math.min(this.width - 1, loc.x + distance); i++){
		for(var j = Math.max(0, loc.y - distance); j <= Math.min(this.height - 1, loc.y + distance); j++){
			var dist = (i - loc.x) * (i - loc.x) + (j - loc.y) * (j - loc.y);
			if(dist <= distance * distance){
				result.push({x:i, y:j});
			}
		}
	}
	return result;
}
Map.prototype.findDistances = function(unit, start, endings, passableSpaces){
	var selfReference = this;
	var candidates = [];
	var source = null;
	var dests = [];
	var licit = this.licitMove;
	generateGraph();
	this.linkGraph(this.generateVectorLengths(unit), candidates, passableSpaces);
	
	var frontier = [];
	source.distance = 0;
	source.legacy = [];
	frontier.push(source);
	this.dijkstras(source, unit, passableSpaces);
	
	return dests;
	
	function generateGraph(){
		for(var i = 0; i < selfReference.width; i++){
			candidates.push([]);
			for(var j = 0; j < selfReference.height; j++){
				var nova = {x:i, y:j, links:[], popped:false};
				candidates[candidates.length - 1].push(nova);
				if(nova.x == start.x && nova.y == start.y)
					source = nova;
				endings.forEach(function(item, index){
					if(nova.x == item.x && nova.y == item.y)
						dests[index] = nova;
				});
			}
		}
	}
}
Map.prototype.allReachable = function(unit, dist, passableSpaces){
	var selfReference = this;
	var candidates = [];
	var source = null;
	generateGraph();
	this.linkGraph(this.generateVectorLengths(unit), candidates, passableSpaces);
	if(!source)
		return [];
	this.dijkstras(source, unit, passableSpaces);
	
	var finalResult = [];
	for(var i = 0; i < candidates.length; i++){
		for(var j = 0 ; j < candidates[i].length; j++){
			var cand = candidates[i][j];
			if(cand != source && cand.distance && cand.distance <= dist && selfReference.canPass(cand, passableSpaces))
				finalResult.push(cand);
		}
	}
	return finalResult;
	
	function generateGraph(){
		for(var i = Math.max(0, unit.x - unit.speed); i <= Math.min(selfReference.width - 1, unit.x + unit.speed); i++){
			candidates.push([]);
			for(var j = Math.max(0, unit.y - unit.speed); j <= Math.min(selfReference.height - 1, unit.y + unit.speed); j++){
				var nova = {x:i, y:j, links:[], popped:false};
				candidates[candidates.length - 1].push(nova);
				if(nova.x == unit.x && nova.y == unit.y)
					source = nova;					
			}
		}
	}
}
Map.prototype.dijkstras = function(source, unit, passableSpaces){
	var selfReference = this;
	var frontier = [];
	source.distance = 0;
	source.legacy = [];
	frontier.push(source);
	while(frontier.length > 0){
		var min = frontier[0];
		var index = 0;
		for(i = 0; i < frontier.length; i++){
			if(frontier[i].distance < min.distance){
				min = frontier[i];
				index = i;
			}
		}
		frontier.splice(index, 1);
		min.popped = true;
		min.links.forEach(function(item){
			if(!item.con.popped){
				if(!item.con.distance && unit.canTravel(selfReference.territory.getAt(item.con.x, item.con.y))){
					item.con.distance = min.distance + item.dist;
					if(selfReference.canPass(item.con, passableSpaces))
						frontier.push(item.con);
					item.con.legacy = min.legacy.slice();
					item.con.legacy.push(min);
				}else if(min.distance + item.dist < item.con.distance){
					item.con.distance = min.distance + item.dist;
					item.con.legacy = min.legacy.slice();
					item.con.legacy.push(min);
				}
			}
		});
	}
}
Map.prototype.linkGraph = function(vectorLengths, candidates, passableSpaces){
	var licit = this.licitMove;
	
	for(var i = 0; i < candidates.length; i++){
		for(var j = 0; j < candidates[i].length; j++){
			var cand = candidates[i][j];
			vectorLengths.forEach(function(v){
				if(valid(i + v.a, j + v.b) && licit(cand.x, cand.y, cand.x + v.a, cand.y + v.b, v.test, passableSpaces))
					cand.links.push({con:candidates[i + v.a][j + v.b], dist:v.d});
				if(valid(i - v.a, j + v.b) && licit(cand.x, cand.y, cand.x - v.a, cand.y + v.b, v.test, passableSpaces))
					cand.links.push({con:candidates[i - v.a][j + v.b], dist:v.d});
				if(valid(i + v.a, j - v.b) && licit(cand.x, cand.y, cand.x + v.a, cand.y - v.b, v.test, passableSpaces))
					cand.links.push({con:candidates[i + v.a][j - v.b], dist:v.d});
				if(valid(i - v.a, j - v.b) && licit(cand.x, cand.y, cand.x - v.a, cand.y - v.b, v.test, passableSpaces))
					cand.links.push({con:candidates[i - v.a][j - v.b], dist:v.d});
				if(valid(i + v.b, j + v.a) && licit(cand.x, cand.y, cand.x + v.b, cand.y + v.a, v.test, passableSpaces))
					cand.links.push({con:candidates[i + v.b][j + v.a], dist:v.d});
				if(valid(i - v.b, j + v.a) && licit(cand.x, cand.y, cand.x - v.b, cand.y + v.a, v.test, passableSpaces))
					cand.links.push({con:candidates[i - v.b][j + v.a], dist:v.d});
				if(valid(i + v.b, j - v.a) && licit(cand.x, cand.y, cand.x + v.b, cand.y - v.a, v.test, passableSpaces))
					cand.links.push({con:candidates[i + v.b][j - v.a], dist:v.d});
				if(valid(i - v.b, j - v.a) && licit(cand.x, cand.y, cand.x - v.b, cand.y - v.a, v.test, passableSpaces))
					cand.links.push({con:candidates[i - v.b][j - v.a], dist:v.d});
			});
		}
	}
	function valid(x, y){
		return x >= 0 && x < candidates.length && y >= 0 && y < candidates[0].length;
	}
}
Map.prototype.licitMove = function(x1, y1, x2, y2, checker, passableSpaces){
		var prim = {};
		var sec = {};
	if(Math.abs(x2 - x1) >= Math.abs(y2 - y1)){
		if(x2 > x1){
			prim.moveForward = function(loc){loc.x++;};
			prim.forward = 'r';
			prim.moveBackward = function(loc){loc.x--;};
			prim.backward = 'l';
		}else{
			prim.moveForward = function(loc){loc.x--;};
			prim.forward = 'l';
			prim.moveBackward = function(loc){loc.x++;};
			prim.backward = 'r';
		}
		if(y2 > y1){
			sec.moveForward = function(loc){loc.y++;};
			sec.forward = 'd';
			sec.moveBackward = function(loc){loc.y--;};
			sec.backward = 'u';
		}else{
			sec.moveForward = function(loc){loc.y--;};
			sec.forward = 'u';
			sec.moveBackward = function(loc){loc.y++;};
			sec.backward = 'd';
		}
	}else{
		if(x2 > x1){
			sec.moveForward = function(loc){loc.x++;};
			sec.forward = 'r';
			sec.moveBackward = function(loc){loc.x--;};
			sec.backward = 'l';
		}else{
			sec.moveForward = function(loc){loc.x--;};
			sec.forward = 'l';
			sec.moveBackward = function(loc){loc.x++;};
			sec.backward = 'r';
		}
		if(y2 > y1){
			prim.moveForward = function(loc){loc.y++;};
			prim.forward = 'd';
			prim.moveBackward = function(loc){loc.y--;};
			prim.backward = 'u';
		}else{
			prim.moveForward = function(loc){loc.y--;};
			prim.forward = 'u';
			prim.moveBackward = function(loc){loc.y++;};
			prim.backward = 'd';
		}			
	}
	return checker({x:x1, y:y1}, prim, sec, passableSpaces);
}
Map.prototype.generateVectorLengths = function(unit){
	var selfReference = this;
	var canPass = this.canPass;
	var vectorLengths = [];
	vectorLengths.push({a:1, b:0, d:1, test:function(loc, prim, sec, passableSpaces){
		return unit.canTravel(selfReference.getEdge(loc.x, loc.y, prim.forward));
	}});
	vectorLengths.push({a:1, b:1, d:Math.sqrt(2), test:function(loc, prim, sec, passableSpaces){
		var okay = true;
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, prim.forward));
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, sec.forward));
		prim.moveForward(loc);
		okay = okay && unit.canTravel(selfReference.territory.getAt(loc.x, loc.y)) && selfReference.canPass(loc, passableSpaces);
		prim.moveBackward(loc);
		sec.moveForward(loc);
		okay = okay && unit.canTravel(selfReference.territory.getAt(loc.x, loc.y)) && selfReference.canPass(loc, passableSpaces);
		prim.moveForward(loc);
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, prim.backward));
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, sec.backward));
		return okay;
	}});
	vectorLengths.push({a:2, b:1, d:Math.sqrt(5), test:function(loc, prim, sec, passableSpaces){
		var okay = true;
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, prim.forward));
		prim.moveForward(loc);
		okay = okay && unit.canTravel(selfReference.territory.getAt(loc.x, loc.y)) && selfReference.canPass(loc, passableSpaces);
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, sec.forward));
		sec.moveForward(loc);
		okay = okay && unit.canTravel(selfReference.territory.getAt(loc.x, loc.y)) && selfReference.canPass(loc, passableSpaces);
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, prim.forward));
		prim.moveForward(loc);
		return okay;
	}});
	vectorLengths.push({a:3, b:1, d:Math.sqrt(10), test:function(loc, prim, sec, passableSpaces){
		var okay = true;
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, prim.forward));
		prim.moveForward(loc);
		okay = okay && unit.canTravel(selfReference.territory.getAt(loc.x, loc.y)) && selfReference.canPass(loc, passableSpaces);
		
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, prim.forward));
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, sec.forward));
		prim.moveForward(loc);
		okay = okay && unit.canTravel(selfReference.territory.getAt(loc.x, loc.y)) && selfReference.canPass(loc, passableSpaces);
		prim.moveBackward(loc);
		sec.moveForward(loc);
		okay = okay && unit.canTravel(selfReference.territory.getAt(loc.x, loc.y)) && selfReference.canPass(loc, passableSpaces);
		prim.moveForward(loc);
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, prim.backward));
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, sec.backward));
		okay = okay && unit.canTravel(selfReference.territory.getAt(loc.x, loc.y)) && selfReference.canPass(loc, passableSpaces);
		
		okay = okay && unit.canTravel(selfReference.getEdge(loc.x, loc.y, prim.forward));
		prim.moveForward(loc);
		return okay;
	}});
	return vectorLengths;
}
Map.prototype.canPass = function(space, passableSpaces){
		if(!this.content.getAt(space.x, space.y))
			return true;
		if(!passableSpaces)
			return false;
		var contained = false;
		passableSpaces.forEach(function(loc){if(loc.x==space.x&&loc.y==space.y)contained=true;});
		return contained;
}