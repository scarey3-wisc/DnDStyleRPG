
var myDisplay;
var canvas;
var globalImageLibrary;
var delegate;
var webpageTitle;
var regularPainter;
window.onload = function() {
	globalImageLibrary = new ImageLoader();
	globalImageLibrary.onload = initGame;
	globalImageLibrary.casheImage("Resources/Images/Misc/ActionMenuBackground.jpg", "ActionMenuBackground");
	globalImageLibrary.casheImage("Resources/Images/Misc/NotificationBackground.jpg", "NotificationBackground");
	globalImageLibrary.casheImage("Resources/Images/Misc/AnnouncementBackground.png", "AnnouncementBackground");
	globalImageLibrary.casheImage("Resources/Images/Animations/Sword 1.png", "Slash");
	globalImageLibrary.casheImage("Resources/Images/Animations/Bash.png", "Bash");
	globalImageLibrary.casheImage("Resources/Images/Animations/Punch.png", "Hit");
}
function requestRegularPainter(paintFunction){
	if(!regularPainter){
		regularPainter = {
			activeProcesses: 1,
			paint: function(){
				var selfReference = this;
				paintFunction();
				if(this.activeProcesses && this.activeProcesses > 0)
					setTimeout(function(){selfReference.paint();}, 20);
			}
		}
		regularPainter.paint();
	}else{
		regularPainter.activeProcesses++;
	}
}
function deactivateRegularPainter(){
	if(regularPainter){
		regularPainter.activeProcesses--;
		if(regularPainter.activeProcesses == 0)
			regularPainter = null;
	}
}
function initGame() {
	canvas = document.getElementById('myCanvas');
	webpageTitle = document.getElementById('title');
	canvas.focus();
	canvas.onselectstart = function () { return false; };
	canvas.oncontextmenu = function (mouseEvent) { mouseEvent.button = 1; canvas.onclick(mouseEvent); return false; };
	
	
	var Rely = new Unit("Korelin", 5, 2, 2, [new Item("Shortsword")], 0);
	Rely.actionUseCount["Whack"] = 5;
	Rely.ninjaLevel = 1;
	delegate = new MouseDelegate(canvas);
	DaggerwaldScenario(Rely, null, "Vanguard", "Vanguard");

}
function initFromBeginning(){
	canvas = document.getElementById('myCanvas');
	webpageTitle = document.getElementById('title');
	canvas.focus();
	canvas.onselectstart = function () { return false; };
	canvas.oncontextmenu = function (mouseEvent) { mouseEvent.button = 1; canvas.onclick(mouseEvent); return false; };
	Rely = new Unit("Korelin", 5, 2, 2, [], 0);
	delegate = new MouseDelegate(canvas);
	PretrainingScenario.IntroductionConversation(Rely);
}
window.onresize = resizeCanvas;
function resizeCanvas(){
	canvas.width = Math.min(Math.floor(window.innerWidth - 50/*1*/), myDisplay.background.width);
	canvas.height = Math.min(Math.floor(window.innerHeight - webpageTitle.scrollHeight - 25), myDisplay.background.height);
	delegate.paint(canvas);
}
