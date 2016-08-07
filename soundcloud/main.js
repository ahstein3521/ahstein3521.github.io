const id='ddca176ba143988989db8adba1cdfa7f';
const default_img="https://i.ytimg.com/vi/ekYcOzXXX0Q/hqdefault.jpg";

$(document).ready(function(){

	SC.initialize({client_id:id});
	
	var widget=SC.Widget(document.querySelector("iframe"))	
	var playlist={};//global object for the current playlist
	var library=[];

	(function(){
		if(typeof localStorage['library']!="undefined"){
			library=JSON.parse(localStorage.getItem("library"));
			
			var list=library.map(function(v){ return "<li class='playlist-link'>"+v.title+"</li>"}).join("");
			$(".dropdown-menu").html(list)
		}
	})()

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
	
	PlayList.prototype.save=function(){
		library.push(this);
		localStorage.setItem("library",JSON.stringify(library));
	}

	PlayList.prototype.select=function(track){
		var i=$(track).attr("id");
		this.currentTrack=this.list[i];
	}
	
	PlayList.prototype.load=function(){
		let track=this.currentTrack;
		
		widget.load(track.url);
		$(".screen").html("<img src='"+track.art+"' class='img'/><p>"+track.title+"</p><br><p> Track: "+ (+track.index+1)+" of "+this.list.length+" on <em>"+this.title+"</em>");
		
	}
	
	function buildList(arr){
		var list="<ul class='list-group'>";
			list+=arr.map((v,i)=>{
			return "<li class='list-group-item'><button class='link' id='"+i+"'>"+v.title+"</button></li>"}).join("");
			list+="</ul>"
			$(".results").html(list);
	}

	function togglePlayButton(){
		$(".play").children("span").toggleClass("glyphicon-play").toggleClass("glyphicon-pause");
	}

	$(".search-btn").click(function(e){
		var query=$("input").val();
		var titles=library.map(v=> v.title);
        var index=titles.indexOf(query)

		playlist=new PlayList(query)
		
		if(index!=-1){
			playlist.list=library[index].list;
			return buildList(playlist.list);
		}

		SC.get('/tracks', {q: query})
	  	  .then(function(tracks) {
	  	  	buildList(tracks);
	  	  	playlist.build(tracks);
	  	  	playlist.save();
	  	});
	})
		SC.get('/tracks', {q: "lenny kravitz"})
	  	  .then(function(tracks) {
	  	  	playlist=new PlayList("lenny kravitz")
	  	  	buildList(tracks);
	  	  	playlist.build(tracks);
	  	  	playlist.save();
	  	});


	$(document).on("click",".link",function(){
		playlist.select(this)
		playlist.load();

	})
		$(document).on("click",".back",function(){
		playlist.back()
		playlist.load();
		widget.play()
	})
		$(document).on("click",".next",function(){
		playlist.next();
		playlist.load();
		widget.play();
	})


	

	$(".play").on("click",function(){
		togglePlayButton();
		if($(this).children("span").hasClass("glyphicon-pause")){
			widget.play();
		}else{
			widget.pause();
		}
	})	
})