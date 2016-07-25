var audioUrl="https://s3.amazonaws.com/freecodecamp/simonSound";
var freeSoundUrl="https://www.freesound.org/data/previews/"

var Sounds={
	red:new Audio(audioUrl+"2.mp3"),
	blue:new Audio(audioUrl+"1.mp3"),
	yellow:new Audio(audioUrl+"3.mp3"),
	green:new Audio(audioUrl+"4.mp3"),
	fail:new Audio(freeSoundUrl+"181/181354_1038806-lq.mp3"),
	win:new Audio(freeSoundUrl+"78/78823_350482-lq.mp3")
}
var Game=function(){ 
	this.On=false;
	this.StrictMode=false;
	this.Sequence=[];
	this.MoveNumber=0;
	this.Slow=700;
	this.Fast=500;
	this.GameLength=20;
}

Game.prototype.nextMove=function(){
	var colors=["red","green","blue","yellow"];
	var color=colors[Math.floor(Math.random()*4)];
	this.Sequence.push(color);
	animateButton(color);
}
Game.prototype.checkMove=function(usersMove){
	if(usersMove==this.Sequence[this.MoveNumber]){
		return this.correctMove();
	}else{
		return this.wrongMove();
	}
}
Game.prototype.correctMove=function(){
	this.MoveNumber++;
	if(this.MoveNumber==this.GameLength){
		Sounds.win.play();
		displayScore("!!!");
		this.Sequence=[];
	}//User Wins
	else if(this.MoveNumber==this.Sequence.length){
		this.MoveNumber=0;
		displayScore(this.Sequence.length);
		return this.replay(true);
	}//User score increases
}
Game.prototype.wrongMove=function(){
	this.MoveNumber=0;
	Sounds.fail.play();
	if(this.StrictMode){
		this.Sequence=[];
		displayScore("0")
		this.nextMove();
	}else{
		this.replay(false,4000);
	}
}
Game.prototype.replay=function(addNewMove,timer){
	var time=timer||1000;
	var speed=this.Sequence.length>10? this.Fast:this.Slow;
	this.Sequence.forEach(function(color){
		setTimeout(function(){
			animateButton(color)
		},time+=speed)
	})
	if(addNewMove){
		setTimeout(function(){
			game.nextMove();
		},time+=speed)		
	}
}

var game=new Game();

function animateButton(color){
	if(!game.On)return;
    $("."+color).animate({opacity: '.7'}).animate({opacity: '1'});
    Sounds[color].play();
}

function displayScore(score){
	$(".display").html("<h4>"+score+"</h4>");
}

$(".on-off").click(function(){
   game.On= !game.On
   $(".btn-sm").toggleClass("on").toggleClass("off");
   displayScore("- -") 
   if(!game.On){
   		game=new Game();
   		displayScore("")
   }
})
$(".strict").click(function(){
	if(game.On){
		$(".light").toggleClass("light-on");
		game.StrictMode= !game.StrictMode;
	}
})

$(".start").click(function(){
	if(game.On){
		if(game.Sequence.length){
			return game.replay(false);
		}else{
			displayScore(game.Sequence.length);
			return game.nextMove();
		}
	}
})

$(".color-buttons button").click(function(){
	var color=$(this).attr("class");
	if(game.On&&game.MoveNumber!=game.GameLength){
		animateButton(color);
		game.checkMove(color);
	}
})


