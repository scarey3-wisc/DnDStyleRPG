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