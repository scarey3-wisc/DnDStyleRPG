function Animation(spriteSheet, loc, sheetWidth, sheetHeight, numFrames, delay){
	this.sheet = spriteSheet;
	this.loc = loc;
	this.sheetWidth = sheetWidth;
	this.sheetHeight = sheetHeight;
	this.numFrames = numFrames;
	this.currentFrame = 0;
	this.delay = delay;
}
Animation.prototype.getCurrentFrame = function(){
	var canvas = document.createElement("CANVAS");
	var tileWidth = this.sheet.width / this.sheetWidth;
	var tileHeight = this.sheet.height / this.sheetHeight;
	var x = this.currentFrame % this.sheetWidth;
	var y = Math.floor(this.currentFrame / this.sheetWidth);
	canvas.width = tileWidth;
	canvas.height = tileHeight;
	var ctx = canvas.getContext('2d');
	ctx.drawImage(this.sheet, x * tileWidth, y * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
	return canvas;
}
Animation.prototype.draw = function(context, cellSize){
	context.drawImage(this.getCurrentFrame(), this.loc.x * cellSize, this.loc.y * cellSize, cellSize, cellSize);
}
Animation.prototype.nextFrame = function(){
	this.currentFrame++;
}
Animation.prototype.done = function(){
	return this.currentFrame >= this.numFrames;
}
function interpolate(changer, afterwards){
	changer.change();
	if(changer.done()){
		changer.finish();
		afterwards();
	}else{
		setTimeout(function(){interpolate(changer, afterwards)}, changer.delay);
	}
}