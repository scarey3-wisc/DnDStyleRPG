function Scene(backgroundURL){
	var selfReference = this;
	this.loader = new ImageLoader();
	this.loader.onload = function(){
		selfReference.onload();
	}
	this.background = this.loader.loadImage(backgroundURL);
}
Scene.prototype.onload = function(){
	resizeCanvas();
	delegate.paint();
}
Scene.prototype.paint = function(canvas){
	var ctx = canvas.getContext('2d');
	ctx.drawImage(this.background, 0, 0);
}
Scene.ProtagonistDeath = "Resources/Images/Scenes/DeathScreen.jpg";
Scene.EscapedTheArena = "Resources/Images/Scenes/CityScreen.jpg";
Scene.CastleInterior = "Resources/Images/Scenes/CastleInterior.jpg";
Scene.ArenaGrounds = "Resources/Images/Scenes/ArenaGrounds.jpg";
Scene.Daggerwald = "Resources/Images/Scenes/DaggerwaldView.jpg";