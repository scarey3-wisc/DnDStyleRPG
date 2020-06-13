//The ImageLoader is an object for whenever we need to load several images at once, and want an onload event to occur only once they've
//all been loaded. Looking at it again, the loadImage function should really take a list of urls and start loading them all
//simultaneously. ImageLoader also has the ability to cache images so that, once loaded, they can be looked up by name later.
function ImageLoader(){
	this.activeObjects = 0;
	this.cachedImages = [];
}
ImageLoader.prototype.loadImage = function(url){
	var newImage = document.createElement("IMG");
	this.addLoadingObject(newImage);
	newImage.src = url;
	return newImage;
}
ImageLoader.prototype.casheImage = function(url, name){
	var newImage = document.createElement("IMG");
	this.addLoadingObject(newImage);
	newImage.src = url;
	this.cachedImages[name] = newImage;
}
ImageLoader.prototype.getImage = function(name){
	return this.cachedImages[name];
}
ImageLoader.prototype.addLoadingObject = function(object){
	var selfReference = this;
	this.activeObjects++;
	object.onload = function(){
		selfReference.activeObjects--;
		if(selfReference.activeObjects == 0){
			selfReference.onload();
		}
	}
}
ImageLoader.prototype.ready = function(){
	return this.activeObjects == 0;
}
ImageLoader.prototype.onload = function(){};
