function Pretraining(){
	Map.call(this, 8, 6, "Resources/Images/Maps/TraineeRoom.jpg");
	this.addFeature(0, 0, "stone");
	this.addFeature(1, 0, "stone");
	this.addFeature(2, 0, "stone");
	this.addFeature(3, 0, "stone");
	this.addFeature(4, 0, "stone");
	this.addFeature(5, 0, "stone");
	this.addFeature(6, 0, "stone");
	this.addFeature(7, 0, "stone");
	this.addFeature(6, 1, "stone");
	this.addFeature(7, 1, "stone");
	this.addFeature(0, 5, "stone");
	this.addFeature(1, 5, "stone");
	this.addFeature(2, 5, "stone");
	this.addFeature(3, 5, "stone");
	this.addFeature(4, 5, "stone");
	this.addFeature(5, 5, "stone");
	this.addFeature(6, 5, "stone");
	this.addFeature(7, 5, "stone");
	this.addFeature(6, 4, "stone");
	this.addFeature(7, 4, "stone");
}
Pretraining.prototype = Object.create(Map.prototype);
Pretraining.prototype.constructor = Pretraining;