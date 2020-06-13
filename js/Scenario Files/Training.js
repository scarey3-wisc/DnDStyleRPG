function TrainingScenario(protagonist){
	var myMap = new Training();
	var myGame = new Battle(myMap, delegate, ["Korelin's", "Father Flail's"]);
	protagonist.x = 1;
	protagonist.y = 6	;
	protagonist.map = myMap;
	protagonist.battle = myGame;
	var antagonist = new Unit("Father Flail", 4, 3, 3, [new Item("Mace")], 1);
	antagonist.x = 18;
	antagonist.y = 7;
	antagonist.map = myMap;
	antagonist.battle = myGame;
	antagonist.actionUseCount["Whack"] = 5;
	antagonist.AI = new SearchAndDestroy(antagonist, [protagonist]);
	myMap.addUnit(protagonist);
	myMap.addUnit(antagonist);
	
	
	Unit.initDummy(5, 4, myMap, myGame, -1);
	Unit.initDummy(6, 10, myMap, myGame, -1);
	Unit.initDummy(12, 6, myMap, myGame, -1);
	
	Unit.initBystander("Alaya", 2, 1, myMap, myGame);
	Unit.initBystander("Soldier2", 4, 0, myMap, myGame);
	Unit.initBystander("Orfaug", 0, 3, myMap, myGame);
	Unit.initBystander("Soldier3", 1, 11, myMap, myGame);
	Unit.initBystander("Soldier2", 3, 12, myMap, myGame);
	Unit.initBystander("Soldier2", 17, 1, myMap, myGame);
	Unit.initBystander("Soldier3", 19, 2, myMap, myGame);
	Unit.initBystander("Soldier", 18, 1, myMap, myGame);
	Unit.initBystander("Garvin", 18, 11, myMap, myGame);
	
	var soldiers = [];
	soldiers.push(Unit.initSoldier(0, 6, myMap, myGame, 1));
	soldiers.push(Unit.initSoldier(0, 7, myMap, myGame, 1));
	soldiers.push(Unit.initSoldier(19, 6, myMap, myGame, 1));
	soldiers.push(Unit.initSoldier(19, 7, myMap, myGame, 1));
	
	myGame.scenarioActions = function(unit){
		var list = [];
		var leave = {
			actionName: "Escape",
			doable: function(){
				return unit.stride >= 1;
			},
			whenSelected: function(){
				myDisplay = new Scene(Scene.ProtagonistDeath);
				delegate.setSceneMode(myDisplay);
			}
		}
		var triumph = {
			actionName: "Triumph",
			doable: function(){
				return true;
			},
			whenSelected: function(){
				TrainingScenario.BattleOver(protagonist, antagonist, true, false, myGame.relyBetrayal, myGame.flailBetrayal);
			}
		}
		var talkFlail = {
			actionName: "Talk",
			doable: function(){
				return unit.numActions >= 1 && unit.numBonus >= 1;
			},
			whenSelected: function(){
				unit.numActions--;
				unit.numBonus--;
				myGame.alreadyTalkedToFlail = true;
				myGame.actionStack = [];
				unit.stride = 0;
				if(unit.shouldEndTurn())
					unit.endTurn();
				var skilled = unit.ninjaLevel > 0 && unit.actionUseCount["Slash"] > 0;
				TrainingScenario.FlailConvert(protagonist, antagonist, 
					function(){
						if(!myGame.considerTurnEnd())
							delegate.setNavigateMode(myDisplay);
						antagonist.AI.actLikeDummy();
					}, skilled,
					function(afterwards){
						antagonist.team = protagonist.team;
						myGame.teamNames = ["Player's", "Enemies'"]
						myGame.announce(antagonist.name + " has joined your team.", afterwards);
					});
			}
		}
		var talkSoldier = {
			actionName: "Talk",
			doable: function(){
				return unit.numActions >= 1 && unit.numBonus >= 1;
			},
			whenSelected: function(){
				unit.numActions--;
				unit.numBonus--;
				myGame.actionStack = [];
				unit.stride = 0;
				if(unit.shouldEndTurn())
					unit.endTurn();
				TrainingScenario.Yield(protagonist, 
					function(){
						if(!myGame.considerTurnEnd())
							delegate.setNavigateMode(myDisplay);
					},
					function(afterwards){
						TrainingScenario.BattleOver(protagonist, antagonist, false, false, myGame.relyBetrayal, myGame.flailBetrayal);
					});
			}
		}
		var talkToFlail = protagonist.map.isAdjacent(protagonist, antagonist) && unit == protagonist && !myGame.alreadyTalkedToFlail;
		var talkToSoldier = false;
		soldiers.forEach(function(spearman){
			talkToSoldier = talkToSoldier || protagonist.map.isAdjacent(protagonist, spearman);
		});
		talkToSoldier = talkToSoldier && unit == protagonist && !myGame.relyBetrayal && !myGame.flailBetrayal && !myGame.flailDead;
		if(talkToFlail)
			list.push(talkFlail);
		if(talkToSoldier)
			list.push(talkSoldier);
		if(talkToSoldier && talkToFlail){
			talkSoldier.actionName = "Talk to Soldier";
			talkFlail.actionName = "Talk to Father Flail";
		}
		if(unit.x == 0 || unit.x == 19)
			list.push(leave);
		if(myGame.flailDead && !myGame.relyBetrayal)
			list.push(triumph);
		return list;
	}

	myGame.addHook(Battle.createOnUnitEnterSpaceHook(protagonist, [{x:0,y:6},{x:0,y:7},{x:19,y:6},{x:19,y:7}]), function(act, afterwards){
		var unit = act.unit;
		if(unit == protagonist){
			if(antagonist.team == protagonist.team && !myGame.flailEscaped){
				myGame.relyEscaped = true;
				unit.map.content.remove(unit.x, unit.y);
				delete unit.x;
				delete unit.y;
				myGame.announce(unit.name + " has escaped!", function(){if(!myGame.considerTurnEnd())delegate.setNavigateMode(myDisplay);});
			}else{
				TrainingScenario.SuccesfulEscape(protagonist, antagonist, myGame.flailEscaped);
			}
		}else if(unit == antagonist && antagonist.team == protagonist.team){
			if(!myGame.relyEscaped){
				myGame.flailEscaped = true;
				unit.map.content.remove(unit.x, unit.y);
				delete unit.x;
				delete unit.y;
				myGame.announce(unit.name + " has escaped!", function(){if(!myGame.considerTurnEnd())delegate.setNavigateMode(myDisplay);});
			}else{
				TrainingScenario.SuccesfulEscape(protagonist, antagonist, true);
			}
		}
		
	});
	myGame.addHook(function(act){
			return act.type == "melee" && soldiers.includes(act.target);
		},
		function(act, afterwards){
			var doAnnouncement = false;
			soldiers.forEach(function(soldier){
				if(soldier.AI.targets && !soldier.AI.targets.includes(act.unit)){
					soldier.AI.targets.push(act.unit);
				}else if(!soldier.AI.targets){
					soldier.AI = new SearchAndDestroy(soldier, [act.unit]);
					doAnnouncement = true;
				}
			});
			if(doAnnouncement){
				TrainingScenario.TreacheryConversation(act.unit.name, afterwards);
			}else{
				afterwards();
			}
			if(act.unit == protagonist)
				myGame.relyBetrayal = true;
			if(act.unit == antagonist)
				myGame.flailBetrayal = true;
		});
	myGame.addHook(Battle.createOnUnitDoingActionHook("Punch"), 
		function(act, afterwards){
			if(act.target.armor > 0)
				myGame.announce("Punching armor hurts.", afterwards);
			if(act.target.armor == 0){
				act.unit.ninjaLevel = 1;
				myGame.announce(act.unit.name + " learned Knockout", afterwards);
			}
		});
	myGame.addHook(Battle.createOnUnitDeathHook(antagonist),
		function(act, afterwards){
			myGame.flailDead = true;
			if(myGame.relyEscaped)
				TrainingScenario.SuccesfulEscape(protagonist, antagonist, false);
			else
				afterwards();
		});
	myGame.addHook(Battle.createOnUnitDeathHook(protagonist),
		function(act, afterwards){
			TrainingScenario.BattleOver(protagonist, antagonist, false, !myGame.flailBetrayal, myGame.relyBetrayal, myGame.flailBetrayal);
		});
	myDisplay = new MapDisplay(myMap, 47.5, myGame);
	resizeCanvas();
	myDisplay.onload = function(){
		delegate.setNavigateMode(myDisplay);
		myGame.newTurn(true);
		delegate.paint();
		webpageTitle.innerHTML = 'Alenisburrow Arena';
	};
}
TrainingScenario.SuccesfulEscape = function(protagonist, antagonist, flailEscaped){
	var rely = protagonist.name;
	var fail = antagonist.name;
	var convo = flailEscaped?new Conversation([rely, fail],[]):new Conversation([rely], []);
	myDisplay = new Scene(Scene.CastleInterior);
	delegate.setConversationMode(convo, myDisplay);
	
	var s0 = convo.constructState(rely, "Huff... puff... " + (flailEscaped?"we":"I") + " made it!");
	var s1 = convo.constructState(rely, "Now to get through the arena halls, and out into the city...");
	var s2 = convo.constructState(fail, "Not quite lad - they'll be right behind us. Don't let yourself relax until we reach the city!");
	
	if(flailEscaped)
		s0.nextState = s2;
	else
		s0.nextState = s1;
	
	s2.nextState = s1.nextState = convo.constructState(rely, "Sorry.... Stephen doesn't seem to have implemented this. Maybe yell at him? "
		+ "Anyway, this is eventually supposed to be a simple escape scene on a map that doesn't exist yet. Korelin (+Flail?) VS a bunch "
		+ "of soldiers in a narrow hallway. Coming SoonTM. Thanks for Testing!");
	
	convo.currentState = s0;
	convo.haveCurrentCharacterTalk();
}
TrainingScenario.BattleOver = function(protagonist, antagonist, relyWon, flailWon, relyDefected, flailDefected){
	var rely = protagonist.name;
	var fail = antagonist.name;
	var convo;
	if(relyDefected == flailDefected)
		convo = new Conversation(["Releus", "Alaya"], [rely, fail]);
	else if(relyDefected)
		convo = new Conversation(["Releus", "Alaya", fail], [rely]);
	else if(flailDefected)
		convo = new Conversation(["Releus", "Alaya", rely], [fail]);
	myDisplay = new Scene(Scene.ArenaGrounds);
	delegate.setConversationMode(convo, myDisplay);
	webpageTitle.innerHTML = "Alenisburrow Arena";
	convo.choice = "Vanguard";
	convo.afterwards = function(){
		var flailState;
		if(flailWon)
			flailState = "Officer";
		else if(relyWon && flailDefected)
			flailState = "Betrayed";
		else if(!flailDefected && !flailWon)
			flailState = "Vanguard"
		else
			flailState = "Allied";
		DaggerwaldScenario(protagonist, antagonist, convo.choice, flailState);
	}
	var t0 = convo.constructState("Releus", "We've got " + ((relyDefected != flailDefected)?"him":"them") + ", Commander Alaya.");
	var t1 = convo.constructState("Alaya", "Indeed. It was a foolish thing to try.");
	var u1 = convo.constructState("Alaya", "Both of you are assigned to the vanguard. Releus, I recommend you watch them like hawks. They'll take "
		+ "any opportunity to escape, I'm sure.");
	var u2 = convo.constructState("Releus", "Yes ma'am. They won't get away, I'll make sure of it.");
	var u3 = convo.constructState(fail, "Well, " + rely + " it looks like we're stuck in this together.");
	var u4 = convo.constructState("Alaya", "Guards, take them away.");
	var v1 = convo.constructState("Alaya", "Sergeant Flail, my thanks for your aid in subdoing " + rely +  ".");
	var v2 = convo.constructState("Alaya", "I suppose I'll have to reinstate you, won't I?");
	var v3 = convo.constructState(fail, "Looks like.");
	var v4 = convo.constructState("Alaya", "Indeed. Releus, return " + fail + " to his former quarters. Guards, take " + rely + " to the prison for "
		+ "the time being.");
	var w1 = convo.constructState("Alaya", rely + ", I'm very grateful for your intervention. " + fail + " has been a disciplinary problem for several "
		+ "months now, and you are partially to thank for subduing him.");
	var w2 = convo.constructState(fail, "Damn you, kid - you betrayed me. I swear: as long as my heart beats, I will neither forgive nor forget. May "
		+ "the gods grant me vengeance.");
	var w3 = convo.constructState("Alaya", "That's enough: guards, take him away. Now, " + rely + ", I do believe you can be an asset to the 4th Legion.");
	
	
	var s0 = convo.constructState("Alaya", (relyWon?rely:fail) + " wins!");
	var a1 = convo.constructState("Alaya", rely + ", that was a very impressive performance. I do believe we can make good use of you in the 4th Legion.");
	var a2 = convo.constructState("Alaya", "But where to put you... What weapon do you prefer?");
	var A0 = convo.constructDecision(rely, [
		"Sword and Shield",
		"Bow and Arrow",
		"Mace and Plate",
		"Dagger",
		"Go to Hell"]);
	var a3 = convo.constructState("Alaya", "Legionary standard, then? I can put you with Sergeant Ortiga's Regulars. You'll be in the thick of things, "
		+ "but Releus runs a tight, disciplined ship. What do you say?")
	var a4 = convo.constructState("Alaya", "Excellent: I can always use another bowman. We archers do our best to stay safe, but we do tend to be "
		+ "the first target in a flank. Sounds good?");
	var a5 = convo.constructState("Alaya", "Ah - classic heavy material. You'll be with Lieutenant Farrier, holding the line where we can't afford to "
		+ "give ground. Are you up for it?");
	var a6 = convo.constructState("Alaya", "The stealthy type, I see. We do have a special operations unit... but no. " + rely + ", we don't trust "
		+ "conscripts that much.");
	var a7 = convo.constructState("Alaya", "...that was a gift. It won't come a second time. " + rely + ", you'll be placed with the vanguard, overseen "
		+ "by Sergeant Ortiga. Guards, take him away.");
	var A1 = convo.constructDecision(rely, [
		"Yes",
		"Not that one",
		"I refuse to fight"]);
	var a8 = convo.constructState("Alaya", "Very good. Let it be so. Guards, show " + rely + " to his new bunk.");
	var a9 = convo.constructState("Alaya", "In that case... Which company would you prefer?");
	var A2 = convo.constructDecision(rely, [
		"Sword and Shield: Sergeant Ortiga's Regulars",
		"Bow and Arrow: Archery Unit under Commander Alaya",
		"Mace and Plate: Lieutenant Farrier's Heavies",
		"I have no intention of joining your army"]);
	var b1 = convo.constructState("Alaya", "A fine fight. Flail, you put me in a difficult position.");
	var b2 = convo.constructState(fail, "I should hope so.");
	var b3 = convo.constructState("Alaya", "... Releus? What say you?");
	var b4 = convo.constructState("Releus", "Execute him or return him to his unit, m'Lady - both are costly.");
	var b5 = convo.constructState("Alaya", "... ... ...");
	var b6 = convo.constructState("Alaya", "Sergeant Flail, you may return to your position. " + rely + ", you'll be joining the vanguard, under the "
		+ "supervision of Sergeant Ortiga. Guards, show him to his quarters.");
	var c1 = convo.constructState("Alaya", "A rather boring fight, however. Flail, you disappoint me.");
	var c2 = convo.constructState(fail, "... ... ... ...");
	var c3 = convo.constructState("Alaya", "Releus, what do you think?");
	var c4 = convo.constructState("Releus", "Sergeant Flail - or perhaps I should say 'Ex-Sergeant' - is obviously losing his touch. I recommend transfer "
		+ "to the vanguard.");
	var c5 = convo.constructState("Alaya", "Let it be so. Guards, take both " + rely + " and " + fail + " to their quarters.");
	
	if(relyWon)
		s0.nextState = a1;
	else if(flailWon)
		s0.nextState = b1;
	else
		s0.nextState = c1;
	b1.nextState = b2;
	b2.nextState = b3;
	b3.nextState = b4;
	b4.nextState = b5;
	b5.nextState = b6;
	c1.nextState = c2;
	c2.nextState = c3;
	c3.nextState = c4;
	c4.nextState = c5;
	a1.nextState = a2;
	a2.nextState = A0;
	A0.setLink(0, a3);
	A0.setLink(1, a4);
	A0.setLink(2, a5);
	A0.setLink(3, a6);
	A0.setLink(4, a7);
	a3.nextState = A1;
	a4.nextState = A1;
	a5.nextState = A1;
	a3.nextFunction = function(){
		convo.choice = "Legionary";
		convo.currentState = this.nextState;
		delegate.paint();
	}
	a4.nextFunction = function(){
		convo.choice = "Archer";
		convo.currentState = this.nextState;
		delegate.paint();
	}
	a5.nextFunction = function(){
		convo.choice = "Heavy";
		convo.currentState = this.nextState;
		delegate.paint();
	}
	a6.nextState = a9;
	A1.setLink(0, a8);
	A1.setLink(1, a9);
	A1.setLink(2, a7);
	a9.nextState = A2;
	A2.setLink(0, a8);
	A2.setLink(1, a8);
	A2.setLink(2, a8);
	A2.setLink(3, a7);
	A2.nextFunction = function(){
		var choice = this.options[this.index];
		convo.currentState = choice.nextState;
		if(this.index == 0)
			convo.choice = "Legionary";
		if(this.index == 1)
			convo.choice = "Archer";
		if(this.index == 2)
			convo.choice = "Heavy"
		if(this.index == 3)
			convo.choice = "Vanguard";
		convo.haveCurrentCharacterTalk();
	}
	
	t0.nextState = t1;
	if(!flailDefected)
		t1.nextState = v1;
	else if(!relyDefected)
		t1.nextState = w1;
	else
		t1.nextState = u1;
	u1.nextState = u2;
	u2.nextState = u3;
	u3.nextState = u4;
	v1.nextState = v2;
	v2.nextState = v3;
	v3.nextState = v4;
	w1.nextState = w2;
	w2.nextState = w3;
	w3.nextState = a2;
	
	if(relyDefected || flailDefected)
		convo.currentState = t0;
	else
		convo.currentState = s0;
	convo.haveCurrentCharacterTalk();
}
TrainingScenario.Yield = function(protagonist, afterwards, surrender){
	var rely = protagonist.name;
	var convo = new Conversation(["Soldier"], [rely]);
	delegate.setConversationMode(convo);
	convo.afterwards = afterwards;
	var s0 = convo.constructState("Soldier", "Do you want to surrender?");
	var d0 = convo.constructDecision(rely, [
		"Yes",
		"No"
		]);
	var s1 = convo.constructState("Soldier", "Are you sure? You'll be headed to the vanguard...");
	var d1 = convo.constructDecision(rely, [
		"I'm sure - announce my defeat.",
		"...I guess I'll keep fighting..."
		]);
	var s2 = convo.constructState("Soldier", "I see.");
	var s3 = convo.constructState("Soldier", "STOP THE FIGHT! " + rely + " admits defeat!");
	
	s0.nextState = d0;
	d0.setLink(0, s1);
	d0.setLink(1, s2);
	s1.nextState = d1;
	d1.setLink(0, s3);
	d1.setLink(1, s2);
	s3.nextFunction = function(){surrender(afterwards);};
	
	convo.currentState = s0;
	convo.haveCurrentCharacterTalk();
}
TrainingScenario.FlailConvert = function(protagonist, antagonist, afterwards, relySkilled, convertFlail){
	var rely = protagonist.name;
	var fail = antagonist.name;
	var convo = new Conversation([rely], [fail]);
	delegate.setConversationMode(convo);
	convo.afterwards = afterwards;
	
	var s0 = convo.constructState(rely, "Father Flail - wait.");
	var s1 = convo.constructState(fail, "... ... ... ... ...?");
	var d0 = convo.constructDecision(rely, [
		"I'm going to destroy you, Flail.",
		"Father Flail, please - I don't want to fight you.",
		"So, you disobeyed orders, eh?"
		]);
	var s2 = convo.constructState(fail, "HA! You don't lack for spirit, at least. And you've certainly got a well trained grip and strong arms. " +
		"I'm looking forward to a good fight. Try not to disappoint me.");
	var s3 = convo.constructState(fail, "Bwah ha ha! Those are some bold words. Especially coming from someone who has no experience with a sword. " +
		"Don't try to bluff me kid - I can read your inexperience in that awful grip and those spindly arms. Prepare yourself! " +
		" And don't say I didn't warn you.");
	var d1 = convo.constructDecision(rely, [
		"Sounds like you're scared, Flail.",
		"Before we fight, Flail... what's your opinion of Dideas?"
		]);
	var s4 = convo.constructState(fail, "Scared? I've fought in more battles than you've heard of, kid. You'll get there some day, but for now... " +
		"You're a greenhorn.");
	var s5 = convo.constructState(fail, "Since you ask... its a backwater country; a piece of garbage led by morons. I was a fool to join the army in the " +
		"first place. Shame you didn't get a choice.");
	var d2 = convo.constructDecision(rely, [
		"Ah. An interesting view for such a respected veteran to hold.",
		"I share your sentiments. Consider this, Flail: could idiots hold the likes of you and me, if we tried to leave?"
		]);
	var s6 = convo.constructState(fail, "Indeed.");
	var s7 = convo.constructState(fail, "An interesting idea lad, an interesting idea indeed. " + rely + ", I think this may be the " +
		"the beginning of a beautiful friendship.");
	var s8 = convo.constructState(fail, "...kid, I'm sorry. But I have no choice. I've got to beat you quickly and decisively, or I'm in the " +
		"vanguard of the next battle. Don't worry: I won't kill you.");
	var d3 = convo.constructDecision(rely, [
		"But if I don't win, I'm in the vanguard! Father Flail, please... I don't want to fight anyone, ever.",
		"I don't believe you. One hit of your mace and I'm done for!"
		]);
	var s9 = convo.constructState(fail, "... ... ...");
	var t0 = convo.constructState(fail, "Kid.");
	var t1 = convo.constructState(fail, "Listen. I don't want to be here any more than you do. Now I'm looking at the guards at the arena " +
		"entrances, and they don't seem like much to me. What do you say? Are you willing to work with me and fight our way out of here?");
	var t2 = convo.constructState(fail, rely + ", I can see that you're a strong lad, in good shape. You're not getting out of here, so " +
		"I have only one piece of advice for you. Man up.");
	var d4 = convo.constructDecision(rely, [
		"...yes. I'll do it.",
		"No Father Flail, they'll kill me!"
		]);
	var t3 = convo.constructState(fail, "Then quickly get used to that sword - take out a dummy or two. Hell, try throwing a punch. " +
		"Don't worry - I'll 'graciously' give you a second to get your bearings, and the crowd won't suspect a thing.");
	var t4 = convo.constructState(fail, "Your choice. But if you won't fight for your own freedom, I'm not giving up my own chance at " +
		"surviving to save you.");
	var t5 = convo.constructState(fail, "You heard about that? Somehow I'm not surprised. It was common sense. That fool " +
		"Alaya would've killed half my company if I'd followed her moronic command. She knows absolutely nothing of war.");
	var d5 = convo.constructDecision(rely, [
		"That doesn't matter, Flail. Following the chain of command is crucial to an discipline and order in any army.",
		"Somehow I'm not surprised. Pompous little girl - I bet she's been pampered her whole life."
		]);
	var t6 = convo.constructState(fail, "Believe what you wish. I'm not going to waste my time arguing. Enough chatter - prepare yourself!");
	var t7 = convo.constructState(fail, "Ha! I do believe you're right. You intrigue me, " + rely + ". Do you claim any skill in a fight?");
	var d6 = convo.constructDecision(rely, [
		"Not much, I'm afraid.",
		"Father Flail, I'm the best swordsman you'll ever meet."
		]);
	var t8 = convo.constructState(fail, "I see. You'll get there someday, I think. I hope to see you live through your first real battle. " +
		"But for now... prepare yourself.");
	
	s0.nextState = s1;
	s1.nextState = d0;
	if(relySkilled)
		d0.setLink(0, s2);
	else
		d0.setLink(0, s3);
	d0.setLink(1, s8);
	d0.setLink(2, t5);
	s2.nextState = d1;
	d1.setLink(0, s4);
	d1.setLink(1, s5);
	s5.nextState = d2;
	d2.setLink(0, s6);
	d2.setLink(1, s7);
	s7.nextFunction = function(){convertFlail(afterwards);};
	s8.nextState = d3;
	if(!relySkilled)
		d3.setLink(0, s9);
	else
		d3.setLink(0, t2);
	d3.setLink(1, t6);
	s9.nextState = t0;
	t0.nextState = t1;
	t1.nextState = d4;
	d4.setLink(0, t3);
	d4.setLink(1, t4);
	t3.nextFunction = function(){convertFlail(afterwards);};
	t5.nextState = d5;
	d5.setLink(0, t6);
	d5.setLink(1, t7);
	t7.nextState = d6;
	d6.setLink(0, t8);
	if(relySkilled)
		d6.setLink(1, s2);
	else
		d6.setLink(1, s3);
	
	convo.currentState = s0;
	convo.haveCurrentCharacterTalk();
}
TrainingScenario.TreacheryConversation = function(betrayer, afterwards){
	var convo = new Conversation(["Soldier"], [betrayer]);
	delegate.setConversationMode(convo);
	convo.afterwards = afterwards;
	
	var state0 = convo.constructState("Soldier", "Urrggg...");
	var state1 = convo.constructState(betrayer, "... ... ... ...");
	var state2 = convo.constructState("Soldier", "The rat tried to kill me! Get 'em, boys!");
	
	state0.nextState = state1;
	state1.nextState = state2;
	
	convo.currentState = state0;
	convo.haveCurrentCharacterTalk();
}
TrainingScenario.IntroductionConversation = function(protagonist){
	var prot = protagonist.name
	var convo = new Conversation(["Soldier", prot], ["Father Flail", "Alaya"]);
	myDisplay = new Scene(Scene.ArenaGrounds);
	delegate.setConversationMode(convo, myDisplay);
	webpageTitle.innerHTML = "Alenisburrow Arena";
	convo.afterwards = function(){
		TrainingScenario(protagonist);
	}
	var s0 = convo.constructState("Alaya", "For our fourth exhibition fight, we have... under the Midday Gate: ");
	var s1 = convo.constructState("Alaya", "Sir Flail of Alenisburrow!");
	var s2 = convo.constructState("Father Flail", "... ... ... ... ... ...");
	var s3 = convo.constructState("Alaya", "And under the Midnight Gate, our newest recruit: " + prot + " of Oasis!");
	var s4 = convo.constructState("Soldier", "How are you feeling, kid?");
	var d0 = convo.constructDecision(prot, [
		"Let me put it this way - is there a betting pool?", 
		"Honestly, I'm rather nervous.", 
		"...forgive me..."]);
	var s5 = convo.constructState("Soldier", "As a matter of fact, yes - why do you ask?");
	var s6 = convo.constructState(prot, "Here's 10gp. Odds should be, what, 4 to 1 against me? That's a tidy profit right there.");
	var s7 = convo.constructState("Soldier", "You can always yield the fight - just let me know, and I'll announce your surrender. But I wouldn't " +
		"worry too much. Father Flail is a brutal fighter, but he won't kill you.");
	var s8 = convo.constructState("Soldier", "What was that?");
	var s9 = convo.constructState("Alaya", "Let the battle begin!");
	
	s0.nextState = s1;
	s1.nextState = s2;
	s2.nextState = s3;
	s3.nextState = s4;
	s4.nextState = d0;
	d0.setLink(0, s5);
	s5.nextState = s6;
	s6.nextState = s9;
	d0.setLink(1, s7);
	s7.nextState = s9;
	d0.setLink(2, s8);
	s8.nextState = s9;
	
	convo.currentState = s0;
	convo.haveCurrentCharacterTalk();
}