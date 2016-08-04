var Time_Display;
var DefaultTime={Session:25, Break:5}
var Minutes=DefaultTime.Session;
var Seconds=0;
var Alarm=new Audio("https://www.freesound.org/data/previews/248/248211_4400183-lq.mp3");

var SessionMode=true;
var Playing=false;
var Countdown;


function initTime(){
	Time_Display=new Date(0,0,0,0,Minutes,Seconds);
}
function display(){
 	$(".screen h1").text(Time_Display.toTimeString().split(" ")[0].substr(3));
}
function storeTimeAtPause(){
 	var time=$(".screen h1").text().split(":");
 	Minutes= +time[0];
 	Seconds= +time[1];
}

function _countdown(){
	Time_Display.setSeconds(Time_Display.getSeconds()-1);
	display();
	if(Time_Display.getSeconds()==0){
		switchModes();
	}
}

function switchModes(){
	SessionMode= !SessionMode;
	transitionAnimation();
	setTimeout(function(){
		Countdown=setInterval(_countdown,1000)
	},6000)
	if(SessionMode){
		Minutes=DefaultTime.Session;
	}else{
		Minutes=DefaultTime.Break
	}
	Seconds=0;
	initTime();
}
function transitionAnimation(){
	clearInterval(Countdown);
	Alarm.play();
	//Come up with animation idea..
}
function increment(mode,amount){
	var newTime=DefaultTime[mode]+amount
	if(!Playing && newTime>0 &&newTime<60){
		DefaultTime[mode]=newTime;
		$(".time-display-"+mode).text(newTime);
		adjustCurrentTime(mode,newTime);
	}
}

function adjustCurrentTime(mode,newTime){
	if(mode=="Session"&& SessionMode || mode=="Break" && !SessionMode){
		Minutes=newTime;
		initTime();
		display();
	}
}

$(".play").click(function(){
	var _class=$(".play span").hasClass("glyphicon-play")? "glyphicon-pause":"glyphicon-play";
	$(".play span").attr("class","glyphicon "+ _class);
	Playing= !Playing;
	
	if(Playing){
		initTime();
		Countdown=setInterval(_countdown,1000);
	}else{
		storeTimeAtPause();
		clearInterval(Countdown)
	}
})

$(".reset").click(function(){
	Minutes=DefaultTime.Session;
	Seconds=0;
	Playing=false;
	SessionMode=true;
	$(".play span").attr("class","glyphicon glyphicon-play");
	clearInterval(Countdown);
	initTime();
	display();
})
