function DaggerwaldScenario(rely, flail, relyState, flailState){
	var myMap = new Daggerwald();
	var myGame = new Battle(myMap, delegate, ["Player", "Enemy"]);
	
	/*rely.x = 13;
	rely.y = 8;*/
	rely.x = 20;
	rely.y = 0;
	rely.map = myMap;
	rely.battle = myGame;
	myMap.addUnit(rely);
	
	Unit.initArcher(4, 3, myMap, myGame, 1);
	Unit.initArcher(5, 2, myMap, myGame, 1);
	Unit.initArcher(5, 4, myMap, myGame, 1);
	Unit.initArcher(6, 3, myMap, myGame, 1);
	var alaya = new Unit("Alaya", 5, 3, 3, [], 1);
	alaya.x = 5;
	alaya.y = 3;
	alaya.map = myMap;
	alaya.battle = myGame;
	alaya.actionUseCount["Zap"] = 5;
	myMap.addUnit(alaya);
	
	Unit.initLegionary(5, 12, myMap, myGame, 1);
	Unit.initLegionary(6, 12, myMap, myGame, 1);
	Unit.initLegionary(7, 11, myMap, myGame, 1);
	Unit.initLegionary(7, 10, myMap, myGame, 1);
	Unit.initLegionary(6, 11, myMap, myGame, 1);
	
	Unit.initHeavy(1, 10, myMap, myGame, 1);
	Unit.initHeavy(2, 10, myMap, myGame, 1);
	Unit.initHeavy(3, 10, myMap, myGame, 1);
	Unit.initHeavy(2, 11, myMap, myGame, 1);
	
	
	
	myDisplay = new MapDisplay(myMap, 47.5, myGame);
	resizeCanvas();
	myDisplay.onload = function(){
		webpageTitle.innerHTML = 'Daggerwald';
		delegate.paint();
		DaggerwaldScenario.IntroductionConversation(rely, flail, relyState, flailState, function(){
			delegate.setNavigateMode(myDisplay);
			myGame.newTurn(true);
			delegate.paint();
		});
	};
}
DaggerwaldScenario.IntroductionConversation = function(rely, flail, relyState, flailState, afterwards){
	var convo = new Conversation(["Alaya"], []);
	delegate.setConversationMode(convo, myDisplay);
	convo.afterwards = afterwards;
	convo.currentState = convo.constructState("Alaya", "I'm sorry.... it looks like Stephen hasn't coded this yet! You should yell at him. But "
	+ "you can hopefully see part of the Daggerwald map in the background. Stephen hopes to have an epic battle there, with three teams: Player "
	+ "Team, which is Korelin + possibly Flail, 'Alaya Team' which is the army that Korelin/Flail are working with, and 'Enemies.' Actually doing "
	+ "this will require a new AI, because the 'search and destroy' AI is too simplistic for appropriate behavior in a battle of ~40 units clashing. "
	+ "Stephen also wants a bunch of new items for this. Some branches let Korelin become an Archer, or have a shield, etc. for this battle. Archery "
	+ "in particular will require a bunch of work, but all of it requires tons of new dev. So for now, Daggerwald is SoonTM!!!! Thanks for testing!");
	convo.haveCurrentCharacterTalk();
}