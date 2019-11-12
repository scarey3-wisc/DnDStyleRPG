function Announcement(words, type){
	this.words = words;
	this.type = type;
	this.borderWidth = 8;
	if(this.type == "Game-Flow"){
		this.height = 70;
		this.width = 525;
		this.textCenter = 42;
		this.unitHeight = 35;
	}else if(this.type == "Notification"){
		this.height = 20;
		this.unitHeight = 14;
		this.spacing = 10;
	}
	
	this.y = -1 * this.height;
	this.startY = -1 * this.height;
	this.targetY = 0;
	this.finalY = -1 * this.height;
	this.x = -1 * this.width;
	this.startX = -1 * this.width;
	this.targetX;
	this.finalX;
}
Announcement.prototype.announce = function(time, painter, afterwards){
	if(this.type == "Game-Flow")
		this.majorAnnounce(time, painter, afterwards);
	if(this.type == "Notification")
		this.minorAnnounce(time, painter, afterwards);
}
Announcement.prototype.endEarly = function(){
	this.commandEnd = true;
}
Announcement.prototype.minorAnnounce = function(time, painter, afterwards){
	var selfReference = this;
	changer = {
		delay: 20,
		timeElapsed: 0,
		done: function(){return this.timeElapsed >= time || selfReference.commandEnd;},
		finish: function(){deactivateRegularPainter();},
		change: function(){
			this.timeElapsed += this.delay;
			if(this.timeElapsed / time < 0.02){
				var percent = (this.timeElapsed / time) / 0.02;
				selfReference.y = selfReference.startY * (1 - percent) + selfReference.targetY * percent;
			}else if(this.timeElapsed / time < 0.98){
				selfReference.y = selfReference.targetY;
			}else{
				var percent = (this.timeElapsed / time - 0.98) / 0.02;
				selfReference.y = selfReference.targetY * (1 - percent) + selfReference.finalY * percent;
				
			}
		}
	};
	interpolate(changer, afterwards);
	requestRegularPainter(painter);
}
Announcement.prototype.majorAnnounce = function(time, painter, afterwards){
	var selfReference = this;
	changer = {
		delay: 20,
		timeElapsed: 0,
		done: function(){return this.timeElapsed >= time || selfReference.commandEnd;},
		finish: function(){deactivateRegularPainter();},
		change: function(){
			this.timeElapsed += this.delay;
			if(this.timeElapsed / time < 0.1){
				var percent = (this.timeElapsed / time) / 0.1;
				selfReference.x = selfReference.startX * (1 - percent) + selfReference.targetX * percent;
			}else if(this.timeElapsed / time < 0.9){
				selfReference.x = selfReference.targetX;
			}else{
				var percent = (this.timeElapsed / time - 0.9) / 0.1;
				selfReference.x = selfReference.targetX * (1 - percent) + selfReference.finalX * percent;
				
			}
		}
	};
	interpolate(changer, afterwards);
	requestRegularPainter(painter);
}
Announcement.prototype.paint = function(canvas){
	if(this.type == "Game-Flow")
		this.paintMajor(canvas);
	if(this.type == "Notification")
		this.paintMinor(canvas);
}
Announcement.prototype.paintMinor = function(canvas){
	var ctx = canvas.getContext('2d');
	var background = globalImageLibrary.getImage("NotificationBackground");
	
	var y = this.y;
	var font = this.unitHeight + "px Arial";
	ctx.save();
	ctx.font = font;
	var stringWidth = ctx.measureText(this.words).width;
	if(!this.width)
		this.width = stringWidth + 2 * this.spacing;
	var x = (canvas.width - this.width)/2;
	ctx.translate(x, y);
	ctx.fillStyle = ctx.createPattern(background, "repeat");
	ctx.fillRect(0, 0, this.width, this.height);
	ctx.textAlign = "start";
	ctx.textBaseline = "top";
	ctx.fillStyle = "#000000";
	ctx.fillText(this.words, (this.width - stringWidth)/2, (this.height - this.unitHeight)/2);
	ctx.strokeStyle = "#000030";
	ctx.lineWidth = 2;
	ctx.strokeRect(0, 0, this.width, this.height);
	ctx.restore();
}
Announcement.prototype.paintMajor = function(canvas){
	var ctx = canvas.getContext('2d');
	var background = globalImageLibrary.getImage("AnnouncementBackground");
	this.targetX = (canvas.width - this.width)/2;
	this.finalX = canvas.width;
	var x = this.x;
	var y = (canvas.height - this.height)/2;
	var boldFont = "bold " + this.unitHeight + "px Monsieur La Doulaise";
	ctx.save();
	ctx.font = boldFont;
	ctx.translate(x, y);
	ctx.drawImage(background, 0, 0, this.width, this.height);
	ctx.font = boldFont;
	var stringWidth = ctx.measureText(this.words).width;
	ctx.textAlign = "start";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#6b3030";
	ctx.fillText(this.words, this.width/2 - stringWidth/2, this.textCenter);
	ctx.restore();
}