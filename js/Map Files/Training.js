//Literally just a hard code of all the edges and terrain features in the Flail fight map.
function Training(){
	Map.call(this, 20, 13, "Resources/Images/Maps/TrainingGround.jpg");
	this.addFeature(0, 5, "stone");
	this.addFeature(1, 5, "stone");
	this.addFeature(1, 4, "stone");
	this.addFeature(2, 3, "stone");
	this.addFeature(3, 2, "stone");
	this.addFeature(4, 1, "stone");
	this.addFeature(5, 1, "stone");
	this.addFeature(6, 0, "stone");
	this.addFeature(7, 0, "stone");
	this.addFeature(8, 0, "stone");
	this.addFeature(9, 0, "stone");
	this.addFeature(10, 0, "stone");
	this.addFeature(11, 0, "stone");
	this.addFeature(12, 0, "stone");
	this.addFeature(13, 0, "stone");
	this.addFeature(14, 1, "stone");
	this.addFeature(15, 1, "stone");
	this.addFeature(16, 2, "stone");
	this.addFeature(17, 3, "stone");
	this.addFeature(18, 4, "stone");
	this.addFeature(18, 5, "stone");
	this.addFeature(19, 5, "stone");
	
	this.addFeature(0, 8, "stone");
	this.addFeature(1, 8, "stone");
	this.addFeature(1, 9, "stone");
	this.addFeature(2, 10, "stone");
	this.addFeature(3, 11, "stone");
	this.addFeature(4, 12, "stone");
	this.addFeature(5, 12, "stone");
	this.addFeature(6, 12, "stone");
	this.addFeature(13, 12, "stone");
	this.addFeature(14, 12, "stone");
	this.addFeature(15, 12, "stone");
	this.addFeature(16, 11, "stone");
	this.addFeature(17, 10, "stone");
	this.addFeature(18, 9, "stone");
	this.addFeature(18, 8, "stone");
	this.addFeature(19, 8, "stone");
	
	this.addEdge(4, 4, 'l', "wall");
	this.addEdge(4, 3, 'l', "wall");
	
	this.addEdge(4, 5, 'd', "wall");
	this.addEdge(5, 5, 'd', "wall");
	this.addEdge(6, 5, 'd', "wall");
	this.addEdge(6, 5, 'r', "wall");
	this.addEdge(6, 4, 'r', "wall");
	
	this.addEdge(8, 3, 'u', "wall");
	this.addEdge(9, 3, 'u', "wall");
	this.addEdge(10, 3, 'u', "wall");
	
	this.addEdge(12, 3, 'r', "wall");
	this.addEdge(12, 2, 'r', "wall");
	
	this.addEdge(11, 4, 'd', "wall");
	this.addEdge(12, 4, 'd', "wall");
	this.addEdge(13, 4, 'd', "wall");
	
	this.addEdge(10, 4, 'l', "wall");
	this.addEdge(10, 5, 'l', "wall");
	this.addEdge(10, 6, 'l', "wall");
	
	this.addEdge(10, 8, 'd', "wall");
	this.addEdge(9, 8, 'd', "wall");
	this.addEdge(8, 8, 'd', "wall");
	this.addEdge(8, 9, 'l', "wall");
	this.addEdge(8, 10, 'l', "wall");
	
	this.addEdge(5, 8, 'd', "wall");
	this.addEdge(4, 8, 'd', "wall");
	
	this.addEdge(10, 10, 'd', "wall");
	this.addEdge(11, 10, 'd', "wall");
	this.addEdge(12, 10, 'd', "wall");
	
	this.addEdge(12, 9, 'd', "wall");
	this.addEdge(13, 9, 'd', "wall");
	this.addEdge(14, 9, 'd', "wall");
	this.addEdge(14, 9, 'r', "wall");
	this.addEdge(14, 8, 'r', "wall");
	this.addEdge(14, 7, 'r', "wall");
}
Training.prototype = Object.create(Map.prototype);
Training.prototype.constructor = Training;