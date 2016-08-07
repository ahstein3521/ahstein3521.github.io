const id='ddca176ba143988989db8adba1cdfa7f';
const default_img="https://i.ytimg.com/vi/ekYcOzXXX0Q/hqdefault.jpg";

SC.initialize({client_id:id});

var widget=SC.Widget(document.querySelector("iframe"))	
var playlist={};//global object for the current playlist

var PlayList=function(title){
	this.title=title;
	this.list=[];
	this.currentTrack;
}

PlayList.prototype.next=function(){
	var nextIndex=this.currentTrack.index+1;
	if(nextIndex>=this.list.length) nextIndex=0;

	this.currentTrack=this.list[nextIndex];
}

PlayList.prototype.back=function(){
	var prevIndex=this.currentTrack.index-1;
	if(prevIndex<=0) prevIndex=this.list.length-1;

	this.currentTrack=this.list[prevIndex]
}

PlayList.prototype.build=function(tracksArray){
	var img;
	var list=tracksArray.map(function(v,i){
		img=v.artwork_url?v.artwork_url:default_img;
		return {index:i, title:v.title, art:img, url:v.uri}
	})
	this.list=list;
}

PlayList.prototype.select=function(track){
	var i=$(track).attr("id");
	this.currentTrack=this.list[i];
}

PlayList.prototype.load=function(){
	let track=this.currentTrack;
	
	widget.load(track.url);
	$(".screen").html("<img src='"+track.art+"' class='img'/><p>"+track.title+"</p><br><p> Track: "+ (+track.index+1)+" of "+this.list.length+" on <em>"+this.title+"</em>");
	console.log(track);
}