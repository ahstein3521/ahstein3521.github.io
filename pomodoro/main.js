var Time_Display;
var DefaultTimes={Session:25, Break:5}
var Minutes=DefaultTimes.Session;
var Seconds=0;

var SessionMode=true;
var Playing=false;
var Countdown;


function initTime(){
	Time_Display=new Date(0,0,0,0,Minutes,Seconds);
}
function display(time){
 	$(".screen h1").text(time.split(" ")[0].substr(3));
}
function storeTimeAtPause(){
 	var time=$(".screen h1").text().split(":");
 	Minutes= +time[0];
 	Seconds= +time[1];
}

function _countdown(){
	Time_Display.setSeconds(Time_Display.getSeconds()-1);
	display(Time_Display.toTimeString());
	if(Time_Display.getSeconds()==1){
		switchModes();
	}
}

function switchModes(){
	SessionMode= !SessionMode;
	if(SessionMode){
		Minutes=DefaultTimes.Session;
	}else{
		Minutes=DefaultTimes.Break
	}
	Seconds=0;
	initTime();
}

function increment(mode,amount){
	var newTime=DefaultTimes[mode]+amount
	if(!Playing && newTime>0 &&newTime<60){
		DefaultTimes[mode]=newTime;
		Minutes=newTime;
		Seconds=0;
		$(".time-display-"+mode).text(newTime);
		adjustDisplay(mode);
	}
}
function adjustDisplay(mode){
	if(mode=="Session" && SessionMode || mode=="Break" && !SessionMode){
      $(".screen h1").text(DefaultTimes[mode]+":00");
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
	Minutes=DefaultTimes.Session;
	Seconds=0;
	Playing=false;
	$(".play span").attr("class","glyphicon glyphicon-play");
	clearInterval(Countdown);
	$(".screen h1").text(Minutes+":00");
})


