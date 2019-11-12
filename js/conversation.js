function Conversation(leftNames, rightNames){
	var selfReference = this;
	var loader = this.loader = new ImageLoader();
	var portraits = this.portraits = [];
	this.loader.onload = function(){
		if(selfReference.onload)
			selfReference.onload();
		else
			delegate.paint();
	}
	var numLeft = 0;
	leftNames.forEach(function(name){
		numLeft++;
		portraits.push(
			{leftSide:true, name: name, icon: loader.loadImage("Resources/Images/Portraits/" + name + ".png")});
	});
	var numRight = 0;
	rightNames.forEach(function(name){
		numRight++;
		portraits.push(
			{leftSide:false, name: name, icon: loader.loadImage("Resources/Images/Portraits/" + name + ".png")});
	});
	var index = 0;
	portraits.forEach(function(character){
		if(character.leftSide){
			character.xPercent = (index + 1) * 0.5 / (numLeft + 1);
		}else{
			character.xPercent = 0.5 + (index - numLeft + 1) * 0.5 / (numRight + 1);
		}
		index++;
	});
	this.backgroundImage = this.loader.loadImage("Resources/Images/Misc/ConversationBackground.jpg");
	this.currentState = {content:"", message:"", speaker:"", nextFunction:function(){}};
	this.talking = false;
	this.horizontalMargins = 10;
	this.lineHeight = 20;
	this.lineSpacing = 25;
}
Conversation.prototype.constructDecision = function(speaker, options){
	var convo = this;
	var myOptions = [];
	options.forEach(function(words){
		myOptions.push({content:words});
	});
	return new Decision();
	function Decision(){
		var selfReference = this;
		this.type = "decision";
		this.index = 0;
		this.options = myOptions;
		this.speaker = speaker;
		this.nextFunction = function(){
			var choice = selfReference.options[selfReference.index];
			if(choice.nextState){
				convo.currentState = choice.nextState;
				if(convo.currentState.type == "talk")
					convo.haveCurrentCharacterTalk();
				else if(convo.currentState.type == "decision")
					delegate.paint();
			}else{
				afterwards();
			}
		}
		this.setLink = function(index, linkage){
			this.options[index].nextState = linkage;
		}
	}
}
Conversation.prototype.constructState = function(speaker, message){
	var convo = this;
	var afterwards = this.afterwards;
	return new State(speaker, message);
	function State(){
		var selfReference = this;
		this.type = "talk";
		this.content = "";
		this.message = message;
		this.speaker = speaker;
		this.nextFunction = function(){
			if(selfReference.nextState){
				convo.currentState = selfReference.nextState;
				if(convo.currentState.type == "talk")
					convo.haveCurrentCharacterTalk();
				else if(convo.currentState.type == "decision")
					delegate.paint();
			}else{
				afterwards();
			}
		}
	}
}
Conversation.prototype.getCharacterPortrait = function(name){
	var found = null;
	this.portraits.forEach(function(cand){
		if(cand.name == name)
			found = cand;
	});
	return found;
}
Conversation.prototype.haveCurrentCharacterTalk = function(){
	var selfReference = this;
	this.speaking = this.getCharacterPortrait(this.currentState.speaker);
	changer = {
		delay: 30,
		words: selfReference.currentState.message.split(""),
		index: 0,
		done: function(){return this.index == this.words.length - 1 || !selfReference.talking;},
		finish: function(){
			selfReference.currentState.content = selfReference.currentState.message;
			deactivateRegularPainter();
			selfReference.talking = false;
		},
		change: function(){
			selfReference.currentState.content += this.words[this.index];
			this.index++;
		}
	};
	this.talking = true;
	interpolate(changer, function(){});
	requestRegularPainter(function(){delegate.paint();});
}
Conversation.prototype.arrowClicked = function(direction){
	if(this.currentState && this.currentState.type == "decision" && this.decisionData){
		var data = this.decisionData;
		if(direction == 'l'){
			this.currentState.index = (this.currentState.index - 1 + this.decisionData.numItem) % this.decisionData.numItem;
		}else if(direction == 'r'){
			this.currentState.index = (this.currentState.index + 1) % this.decisionData.numItem;
		}else if(direction == 'd'){
			this.currentState.index += this.decisionData.numCols;
			if(this.currentState.index >= this.decisionData.numItem){
				while(this.currentState.index >= this.decisionData.numCols)
					this.currentState.index -= this.decisionData.numCols;
			}
		}else if(direction == 'u'){
			this.currentState.index -= this.decisionData.numCols;
			if(this.currentState.index < 0){
				while(this.currentState.index + this.decisionData.numCols < this.decisionData.numItem)
					this.currentState.index += this.decisionData.numCols;
			}
		}
	}
	
}
Conversation.prototype.paint = function(canvas){
	var selfReference = this;
	var ctx = canvas.getContext('2d');
	var lineY = 0.75 * canvas.height;
	var currentState = this.currentState;
	var lineSpacing = this.lineSpacing;
	var horizontalMargins = this.horizontalMargins;
	var lineHeight = this.lineHeight;

	this.portraits.forEach(function(character){
		paintPortrait(character);
	});
	ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = ctx.createPattern(this.backgroundImage, "repeat");
	ctx.fillRect(0, lineY, canvas.width, canvas.height - lineY);
	
	
	if(currentState.speaker)
		paintPortrait(this.getCharacterPortrait(currentState.speaker));
	
	ctx.strokeStyle = "#905030";
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(0, lineY);
	ctx.lineTo(canvas.width, lineY);
	ctx.stroke();
	if(this.currentState){
		if(this.currentState.type == "talk")
			paintTalking();
		if(this.currentState.type == "decision")
			paintDecision();
	}
	
	
	function paintPortrait(character){
		ctx.save();
		ctx.translate(canvas.width * character.xPercent, lineY - character.icon.height);
		if(character.leftSide)
			ctx.scale(-1, 1);
		ctx.translate(-1 * character.icon.width / 2, 0);
		ctx.drawImage(character.icon, 0, 0);
		ctx.restore();
	}
	function paintDecision(){
		ctx.font = lineHeight + "px ZCOOL XiaoWei";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		var options = currentState.options;
		
		var totalWidth = 0;
		var maxWidth = 0;
		options.forEach(function(choice){
			var content = choice.content;
			var width = ctx.measureText(content).width;
			totalWidth += width;
			maxWidth = Math.max(maxWidth, width);
		});
		var betweenSpace = 4 * horizontalMargins;
		var betweenVert = 2 * lineSpacing;
		var numRows = 1;
		var perRow = Math.ceil(options.length / numRows);
		while((totalWidth + betweenSpace * perRow)/numRows > canvas.width || (perRow > 1 && maxWidth > (canvas.width - perRow * betweenSpace)/perRow)){
			numRows++;
			perRow = Math.ceil(options.length / numRows);
		}
		selfReference.decisionData = {
			numRows:numRows,
			numCols:perRow,
			numItem:options.length
		};
		
		options.forEach(function(choice, index){
			var content = choice.content;
			var y = Math.floor(index / perRow);
			var x = index % perRow;
			var perWord = canvas.width / perRow - betweenSpace;
			var wordVert = (canvas.height - lineY) / numRows - betweenVert;
			var wordX = betweenSpace / 2 + perWord/2 + x * (perWord + betweenSpace);
			var wordY = lineY + betweenVert/2 + wordVert/2 + y * (wordVert + betweenVert);
			if(index == currentState.index)
				ctx.fillStyle = "#608060";
			else
				ctx.fillStyle = "#000000";
			ctx.fillText(content, wordX, wordY);
			
		});
		var wordX = betweenSpace / 2 
	}
	function paintTalking (){
		ctx.font = lineHeight + "px ZCOOL XiaoWei";
		ctx.fillStyle = "black";
		ctx.textAlign = "start";
		ctx.textBaseline = "hanging";
	
		var words = currentState.content.split(" ");
		var wordX = horizontalMargins;
		var wordY = lineY + horizontalMargins;
		var index = 0;
		var line = "";
		while(index < words.length){
			var proposedLine = line + words[index] + " ";
			if(ctx.measureText(proposedLine).width > canvas.width - 2 * horizontalMargins){
				ctx.fillText(line, wordX, wordY);
				line = words[index] + " ";
				wordY += lineSpacing;
			}else{
				line = proposedLine;
			}
			index++;	
		}
		ctx.fillText(line, wordX, wordY);
	}
}