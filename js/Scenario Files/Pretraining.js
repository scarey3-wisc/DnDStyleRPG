function PretrainingScenario(protagonist){
	var myMap = new Pretraining();
	var myGame = new Battle(myMap, delegate, ["Korelin's", "Dummies'"]);
	protagonist.x = 2;
	protagonist.y = 2	;
	protagonist.map = myMap;
	protagonist.battle = myGame;
	myMap.addUnit(protagonist);
	
	
	myMap.addUnit(Unit.initDummy(5, 4, myMap, myGame, 1));
	myMap.addUnit(Unit.initDummy(4, 4, myMap, myGame, 1));
	myMap.addUnit(Unit.initDummy(3, 4, myMap, myGame, 1));
	myMap.addUnit(Unit.initDummy(2, 4, myMap, myGame, 1));
	myMap.addUnit(Unit.initDummy(1, 4, myMap, myGame, 1));
	myMap.placeItem(1, 1, new Item("Shortsword"));
	myMap.placeItem(2, 1, new Item("Shortsword"));
	myMap.placeItem(3, 1, new Item("Shortsword"));
	myMap.placeItem(4, 1, new Item("Shortsword"));
	myMap.placeItem(5, 1, new Item("Shortsword"));
	
	
	myGame.scenarioActions = function(unit){
		return [];
	}
	
	myGame.addHook(Battle.createOnUnitDoingActionHook("Punch"), 
	function(act, afterwards){
		if(act.target.armor > 0)
			myGame.announce("Your hand stings. Punching doesn't seem very effective.", afterwards);
		else{
			act.unit.ninjaLevel = 1;
			myGame.removeHook(this);
			myGame.announce("How's that for a punch?", function(){myGame.announce(act.unit.name + " learned Knockout", afterwards)});
		}
	});
	myGame.addHook(Battle.createOnUnitEnterSpaceHook(protagonist, [{x:7, y:2}, {x:7, y:3}]), function(act, afterwards){
		var acts = protagonist.getActionList();
		if(!acts.includes("Whack") && !acts.includes("Slash")){
			myGame.announce("Entering the arena unarmed? Seems stupid.", function(){
				myDisplay.setAccentedSpaceList([{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1}], null, "#33b592");
				delegate.makeAnnouncement("Grab a shortsword!", "Notification", 3000, function(){
					myDisplay.clearAccentedSpaceList();
					afterwards();
				});
			});
		}else if(!acts.includes("Slash") && !this.alreadyWarned){
			this.alreadyWarned = true;
			myGame.announce("Weird grip - might want a minute to get used to it.", function(){
				myDisplay.setAccentedSpaceList([{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:5,y:4}], null, "#33b592");
				delegate.makeAnnouncement("Try attacking a dummy!", "Notification", 3000, function(){
					myDisplay.clearAccentedSpaceList();
					afterwards();
				});
			});
		}else{
			TrainingScenario.IntroductionConversation(protagonist);
		}
	});
	
	myDisplay = new MapDisplay(myMap, 47.5, myGame);
	resizeCanvas();
	myDisplay.onload = function(){
		delegate.myDisplay = myDisplay;
		myGame.newTurn(true);
		delegate.setModeSetup();
		delegate.paint();
		webpageTitle.innerHTML = "The Barracks";
		delegate.makeAnnouncement("Press Spacebar to skip notifications", "Notification", 10000, function(){
			myDisplay.setAccentedSpaceList([{x:7,y:2},{x:7,y:3}], null, "#33b592");
			delegate.makeAnnouncement("Move Korelin to the arena entrance when ready", "Notification", 3000, function(){
				myDisplay.setAccentedSpaceList([protagonist], null, "#33b592");
				delegate.makeAnnouncement("Left click Korelin to see his Actions", "Notification", 3000, function(){
					myDisplay.clearAccentedSpaceList();
					delegate.setNavigateMode(myDisplay);
				});
			});
		});
	};
}
PretrainingScenario.IntroductionConversation = function(protagonist){
	var convo = new Conversation(["Soldier"], [protagonist.name]);
	myDisplay = new Scene(Scene.CastleInterior);
	delegate.setConversationMode(convo, myDisplay);
	webpageTitle.innerHTML = "The Barracks";
	convo.afterwards = function(){
		PretrainingScenario(protagonist);
	}
	
	var state0 = convo.constructState("Soldier", "Welcome to the barracks. When you're ready, the hallway to your right leads to the arena.");
	var state1 = convo.constructState(protagonist.name, "I assume I can take a sword?");
	var state2 = convo.constructState("Soldier", "Yes. You can use any of the standard issue shortswords. Might want to get used to " + 
		"the balance, though. I recommend a minute of practice against one of the training dummies.");
	var state3 = convo.constructState(protagonist.name, "Will do. Can you tell me anything about my opponent?");
	var state4 = convo.constructState("Soldier", "You're up against Father Flail, as we call him. He's an old veteran, very skilled with the " +
		"mace. I've seen him crush men with a single blow.");
	var state5 = convo.constructState(protagonist.name, "Isn't it odd for a respected soldier to participate in one of these fights?");
	var state6 = convo.constructState("Soldier", "Flail disobeyed a direct order in battle. He's so well loved that Commander Alaya charging him " +
		"with insubordination and removing him entirely would be... costly. But if he performs poorly against a green nobody...")
	var state7 = convo.constructState(protagonist.name, "She'd be justified in transfering him to the vanguard, where he's harmless to her. Got it.");
	var state8 = convo.constructState("Soldier", "Just so... ... ...");
	var state9 = convo.constructState("Soldier", "Kid.");
	var statea = convo.constructState("Soldier", "I want you to know I'm rooting for you. If you lose this you'll go to the vanguard. And, well...");
	var stateb = convo.constructState("Soldier", "The vanguard of any army is always the first to die. You seem like a good lad.");
	var statec = convo.constructState(protagonist.name, "... ... ...");
	var stated = convo.constructState("Soldier", "Good luck kid - you'll need it. I'll be watching from the arena entrance.");
	
	state0.nextState = state1;
	state1.nextState = state2;
	state2.nextState = state3;
	state3.nextState = state4;
	state4.nextState = state5;
	state5.nextState = state6;
	state6.nextState = state7;
	state7.nextState = state8;
	state8.nextState = state9;
	state9.nextState = statea;
	statea.nextState = stateb;
	stateb.nextState = statec;
	statec.nextState = stated;
	
	convo.currentState = state0;
	convo.haveCurrentCharacterTalk();
}