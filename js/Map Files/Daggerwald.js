//Literally just a hard code of all the edges and terrain features in the Daggerwald map.
function Daggerwald(){
	Map.call(this, 50, 18, "Resources/Images/Maps/MountainRun.jpg");
	this.addEdge(12, 4, 'l', "cliff");
	this.addEdge(12, 5, 'l', "cliff");
	this.addEdge(12, 6, 'l', "cliff");
	this.addEdge(12, 4, 'u', "cliff");
	this.addEdge(12, 6, 'd', "cliff");
	
	
	this.addFeature(3, 7, "cliff");
	this.addFeature(4, 7, "cliff");
	
	//this.addEdge(12, 0, "d", "river");
	this.addEdge(12, 0, "r", "river");
	this.addFeature(11, 1, "river");
	this.addFeature(10, 2, "river");
	this.addEdge(10, 2, 'd', "cliff");
	this.addFeature(10, 3, "river");
	this.addFeature(10, 4, "river");
	this.addFeature(10, 5, "river");
	this.addFeature(10, 6, "river");
	this.addFeature(10, 7, "river");
	this.addFeature(9, 8, "river");
	this.addEdge(8, 8, 'd', "river");
	this.addEdge(7, 8, 'd', "river");
	this.addFeature(6, 8, "river");
	//this.addFeature(5, 8, "river");
	this.addFeature(4, 8, "river");
	this.addEdge(3, 8, 'd', "river");
	this.addFeature(2, 9, "river");
	this.addFeature(1, 9, "river");
	this.addEdge(0, 8, 'd', "river");
	
	this.addEdge(8, 9, 'l', "cliff");
	this.addEdge(8, 9, 'd', "cliff");
	this.addEdge(9, 10, 'l', "cliff");
	this.addEdge(9, 11, 'l', "cliff");
	this.addEdge(9, 12, "l", "cliff");
	
	this.addEdge(0, 3, 'd', "cliff");
	this.addEdge(0, 3, 'r', "cliff");
	this.addEdge(1, 2, 'd', "cliff");
	this.addEdge(2, 2, 'd', "cliff");
	this.addEdge(2, 2, 'r', "cliff");
	this.addEdge(3, 1, 'd', "cliff");
	this.addEdge(3, 1, 'r', "cliff");
	this.addEdge(4, 0, 'd', "cliff");
	this.addEdge(5, 0, 'd', "cliff");
	this.addEdge(6, 1, 'l', "cliff");
	this.addEdge(6, 2, 'l', "cliff");
	this.addEdge(6, 2, 'd', "cliff");
	this.addEdge(7, 2, 'd', "cliff");
	this.addEdge(8, 2, 'd', "cliff");
	this.addEdge(9, 2, 'd', "cliff");
	this.addEdge(11, 1, 'd', "cliff");
	this.addEdge(12, 1, 'd', "cliff");
	this.addEdge(13, 1, 'd', "cliff");
	this.addFeature(14, 2, "cliff");
	this.addEdge(15, 2, "d", "cliff");
	this.addFeature(16, 3, "cliff");
	
	this.addFeature(16, 4, "wall");
	this.addFeature(15, 4, "wall");
	this.addEdge(15, 5, 'l', "wall");
	this.addEdge(15, 9, 'l', "wall");
	this.addFeature(15, 10, "wall");
	this.addFeature(16, 10, "wall");
	this.addEdge(17, 11, "l", "wall");
	this.addEdge(17, 11, "d", "wall");
	this.addEdge(18, 11, "d", "wall");
	this.addEdge(19, 11, "d", "wall");
	this.addEdge(20, 6, "u", "wall");
	this.addEdge(19, 6, "u", "wall");
	this.addEdge(18, 6, "u", "wall");
	this.addEdge(18, 6, "l", "wall");
	this.addEdge(18, 7, "l", "wall");
	this.addEdge(18, 8, "l", "wall");
	this.addEdge(18, 8, "d", "wall");
	this.addEdge(19, 8, "d", "wall");
	this.addEdge(20, 8, "d", "wall");
	
	this.addEdge(20, 12, "l", "cliff");
	this.addFeature(19, 13, "cliff");
	this.addEdge(18, 14, 'u', "cliff");
	this.addEdge(18, 14, 'l', "cliff");
	this.addEdge(17, 15, 'u', "cliff");
	this.addEdge(16, 15, 'u', "cliff");
	this.addEdge(15, 15, 'u', "cliff");
	this.addEdge(14, 14, 'r', "cliff");
	this.addEdge(14, 14, 'u', "cliff");
	this.addEdge(13, 14, 'u', "cliff");
	this.addEdge(12, 14, 'u', "cliff");
	this.addEdge(12, 14, 'l', "cliff");
	this.addEdge(11, 15, 'u', "cliff");
	this.addFeature(10, 15, "cliff");
	this.addFeature(9, 15, "cliff");
	this.addFeature(8, 15, "cliff");
	this.addEdge(7, 15, 'u', "cliff");
	this.addFeature(6, 14, "cliff");
	this.addEdge(5, 13, 'r', "cliff");
	this.addEdge(5, 13, 'u', "cliff");
	this.addEdge(4, 13, 'u', "cliff");
	this.addFeature(3, 13, "cliff");
	this.addEdge(3, 14, 'l', "cliff");
	this.addEdge(2, 15, 'u', "cliff");
	this.addEdge(1, 15, 'u', "cliff");
	this.addEdge(0, 15, 'u', "cliff");
	
	this.addFeature(21, 0, "cliff");
	this.addFeature(22, 1, "cliff");
	this.addEdge(23, 1, 'l', "cliff");
	this.addEdge(23, 1, 'd', "cliff");
	this.addEdge(24, 1, 'd', "cliff");
	this.addEdge(25, 2, 'u', "cliff");
	this.addEdge(25, 2, 'r', "cliff");
	this.addEdge(26, 2, 'd', "cliff");
	this.addEdge(27, 3, 'u', "cliff");
	this.addEdge(27, 3, 'r', "cliff");
	this.addEdge(28, 3, 'd', "cliff");
	this.addEdge(29, 4, 'l', "cliff");
	this.addEdge(29, 5, 'l', "cliff");
	this.addEdge(29, 5, 'd', "cliff");
	this.addEdge(30, 6, 'u', "cliff");
	this.addEdge(30, 6, 'r', "cliff");
	
	this.addFeature(30, 1, "cliff");
	this.addEdge(31, 1, 'u', "cliff");
	this.addEdge(32, 1, 'u', "cliff");
	this.addEdge(33, 1, 'u', "cliff");
	this.addEdge(34, 1, 'u', "cliff");
	this.addEdge(34, 1, 'r', "cliff");
	
	this.addFeature(36, 3, "cliff");
	this.addEdge(35, 3, 'u', "cliff");
	this.addFeature(34, 3, "cliff");
	this.addFeature(33, 3, "cliff");
	this.addEdge(32, 4, 'u', "cliff");
	this.addEdge(32, 4, 'l', "cliff");
	this.addEdge(32, 4, 'd', "cliff");
	this.addEdge(33, 5, 'l', "cliff");
	this.addEdge(33, 5, 'd', "cliff");
	this.addEdge(34, 6, 'l', "cliff");
	this.addEdge(33, 7, 'u', "cliff");
	this.addEdge(33, 7, 'l', "cliff");
	this.addFeature(33, 8, "cliff");
	this.addFeature(33, 9, "cliff");
	this.addEdge(32, 9, 'u', "cliff");
	this.addEdge(34, 9, 'd', "cliff");
	this.addEdge(35, 9, 'd', "cliff");
	this.addEdge(36, 9, 'd', "cliff");
	this.addEdge(36, 9, 'r', "cliff");
	this.addEdge(37, 8, 'd', "cliff");
	this.addEdge(37, 8, 'r', "cliff");
	this.addEdge(38, 8, 'u', "cliff");
	this.addEdge(38, 7, 'r', "cliff");
	this.addEdge(39, 6, 'd', "cliff");
	this.addFeature(40, 6, "cliff");
	this.addEdge(41, 5, 'd', "cliff");
	this.addFeature(42, 5, "cliff");
	this.addEdge(43, 5, 'u', "cliff");
	this.addEdge(44, 5, 'u', "cliff");
	this.addEdge(44, 5, 'r', "cliff");
	this.addEdge(45, 5, 'd', "cliff");
	this.addEdge(46, 6, 'l', "cliff");
	this.addEdge(46, 6, 'd', "cliff");
	this.addEdge(47, 7, 'l', "cliff");
	this.addEdge(47, 8, 'l', "cliff");
	
	this.addEdge(40, 0, 'l', "cliff");
	this.addEdge(40, 1, 'l', "cliff");
	this.addEdge(40, 2, 'l', "cliff");
	this.addFeature(40, 3, "cliff");
	
	this.addEdge(46, 0, 'l', "cliff");
	this.addEdge(46, 0, 'd', "cliff");
	this.addFeature(47, 1, "cliff");
	this.addEdge(47, 2, 'r', "cliff");
	this.addEdge(47, 2, 'd', "cliff");
	this.addEdge(47, 3, 'l', "cliff");
	this.addEdge(47, 4, 'l', "cliff");
	
	this.addEdge(46, 11, 'u', "cliff");
	this.addEdge(46, 11, 'l', "cliff");
	this.addEdge(46, 12, 'l', "cliff");
	this.addEdge(45, 13, 'u', "cliff");
	this.addEdge(44, 13, 'u', "cliff");
	this.addEdge(43, 13, 'u', "cliff");
	this.addEdge(42, 13, 'u', "cliff");
	this.addEdge(41, 13, 'u', "cliff");
	this.addEdge(40, 13, 'u', "cliff");
	this.addEdge(39, 13, 'u', "cliff");
	this.addEdge(39, 13, 'l', "cliff");
	this.addEdge(39, 13, 'd', "cliff");
	this.addEdge(40, 13, 'd', "cliff");
	this.addEdge(41, 14, 'l', "cliff");
	this.addEdge(40, 15, 'u', "cliff");
	this.addEdge(40, 15, 'l', "cliff");
	this.addEdge(40, 16, 'l', "cliff");
	
	this.addEdge(49, 12, 'd', "cliff");
	this.addFeature(48, 13, "cliff");
	this.addEdge(47, 14, 'r', "cliff");
	this.addEdge(47, 14, 'd', "cliff");
	this.addFeature(46, 15, "cliff");
	
	this.addEdge(37, 16, 'l', "cliff");
	this.addEdge(37, 16, 'u', "cliff");
	this.addEdge(37, 15, 'r', "cliff");
	this.addEdge(37, 15, 'u', "cliff");
	this.addEdge(36, 14, 'r', "cliff");
	this.addEdge(36, 13, 'r', "cliff");
	this.addFeature(37, 13, "cliff");
	
	this.addEdge(33, 14, 'u', "cliff");
	this.addEdge(32, 14, 'u', "cliff");
	this.addEdge(31, 14, 'u', "cliff");
	this.addEdge(30, 14, 'u', "cliff");
	this.addEdge(29, 14, 'u', "cliff");
	this.addEdge(28, 14, 'u', "cliff");
	this.addEdge(27, 14, 'u', "cliff");
	this.addEdge(26, 14, 'u', "cliff");
	this.addEdge(25, 13, 'r', "cliff");
	this.addEdge(25, 13, 'u', "cliff");
	this.addFeature(24, 13, "cliff");
	this.addEdge(24, 14, 'l', "cliff");
	this.addEdge(24, 15, 'l', "cliff");
	this.addEdge(23, 16, 'u', "cliff");
	this.addEdge(22, 16, 'u', "cliff");
	
	
	
	
	
	
	
	
	
	
}
Daggerwald.prototype = Object.create(Map.prototype);
Daggerwald.prototype.constructor = Daggerwald;