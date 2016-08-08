const id='ddca176ba143988989db8adba1cdfa7f';
const default_img="https://i.ytimg.com/vi/ekYcOzXXX0Q/hqdefault.jpg";

const default_track={
					  index:0,
					    url:"https%3A//api.soundcloud.com/tracks/104570219",
						art:"https://i1.sndcdn.com/artworks-000054832512-8zv6d9-large.jpg",
					  title:"Frank Zappa- Willie The Pimp"
					}

$(document).ready(function(){

	SC.initialize({client_id:id});
	
	var widget=SC.Widget(document.querySelector("iframe"))	
	var playlist={};//global object for the current playlist
	var library=[];

	function uniqueTitle(title){
		var titleArray=library.map((v)=>{return v.title.toLowerCase()});
		 return titleArray.indexOf(title.toLowerCase());
		
		// titleArray=titleArray.filter((v)=> {return v==title});
		// return [ index , title + "("+titleArray.length+")"];
	}

	var PlayList=function(title="Untitled"){
		this.title=title;
		this.list=[default_track];
		this.currentTrack=default_track;
	}

	PlayList.prototype.setTitle=function(newTitle){
		this.title=newTitle;
	}
	PlayList.prototype.init=function(){
		this.currentTrack=this.list[0];
		this.load(true);	
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
	
	PlayList.prototype.load=function(autoPlay){
		let track=this.currentTrack;
		if(autoPlay) $(".play span").removeClass("glyphicon-play").addClass("glyphicon-pause");
		widget.load(track.url,{auto_play:autoPlay});
		$(".screen").html("<img src='"+track.art+"' class='img'/><p class='title'><strong>"+track.title+"</strong></p><br><p class='track-listing'> Track: "+ (+track.index+1)+" of "+this.list.length+" on <em>"+this.title+"</em>");
	}
	
	function buildList(arr){
		var list="<ul class='list-group'>";
			list+=arr.map((v,i)=>{
			return "<li class='list-group-item'><button class='link' id='"+i+"'>"+v.title+"</button></li>"}).join("");
			list+="</ul>"
			$(".modal-body").html(list);
	}

	function togglePlayButton(){$(".play span").toggleClass("glyphicon-play").toggleClass("glyphicon-pause");}

	(function(){
		if(typeof localStorage['library']!="undefined"){
			library=JSON.parse(localStorage.getItem("library"));
			
			var list=library.map(function(v){ return "<li class='playlist-link'>"+v.title+"</li>"}).join("");
			$(".dropdown-menu").html(list)
		}	
		playlist=new PlayList();
		playlist.load(false);
	})()

	
	$(".search-btn").on("click",function(e){
		var query=$("input").val();

		if(query.trim().length==0) return;
		
		var index=uniqueTitle(query);
		playlist=new PlayList(query);

		if(index!==-1){
			playlist.list=library[index].list;
			return buildList(playlist.list);
		}

		SC.get('/tracks', {q: query})
	  	  .then(function(tracks) {
	  	  	buildList(tracks);
	  	  	playlist.build(tracks);
	  	});
	})

	$(document).on("click",".link",function(){
		togglePlayButton();
		playlist.select(this);
		playlist.load(true);
		
	})
		$(document).on("click",".back",function(){
		if(playlist.list.length==1)return;		
		playlist.back()
		playlist.load(true);
	
	})
		$(document).on("click",".next",function(){
		if(playlist.list.length==1)return;	
		playlist.next();
		playlist.load(true);
		
	})

	$(".play").on("click",function(){
		togglePlayButton();
		if($(this).children("span").hasClass("glyphicon-pause")){
			widget.play();
		}else{
			widget.pause();
		}
	})
	
	$(".save-playlist").on("click",function(){
		playlist.save();
		$(".playlist").modal("hide");
	})
	
	$(".load-playlist").on("click",function(){
		playlist.init();
		$(".playlist").modal("hide");
	})
		
})