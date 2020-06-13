//A general function for animations that run through different poses in a sprite sheet.
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
	//gets whatever part of the sprite sheet we're currently at
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
//This function isn't actually part of any animation object; interpolate is just a useful function for "do a thing that is supposed
//to take time with stuff happening every few milliseconds" - which is mostly used in animations. But an Animation Object is
//specifically a sprite sheet; this function could be used for having a banner move across the screen or some such.
function interpolate(changer, afterwards){
	changer.change();
	if(changer.done()){
		changer.finish();
		afterwards();
	}else{
		setTimeout(function(){interpolate(changer, afterwards)}, changer.delay);
	}
}
