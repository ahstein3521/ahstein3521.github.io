var DefaultUserList = ['medrybw',"freecodecamp", "storbeck", "terakilobyte",
						"habathcx","brunofin","riotgames","RobotCaleb",
						"thomasballinger","noobs2ninjas","beohoff"];

var EndPoint='https://api.twitch.tv/kraken/';
var Default_IMG="https://placeholdit.imgix.net/~text?txtsize=33&txt=ImageNotAvailable&w=300&h=300"; 


var ListItem=function(props){
	var img=props.logo? props.logo: Default_IMG;
	var status=props.status? props.status : " ";
    
  return("<li onmouseenter='showButton(this,true)' onmouseleave='showButton(this,false)' class='list-group-item list-group-item-"+
  		 props.colorCode+"'><span class='badge' onclick='removeListItem(this)'>X</span>"+ 
         "<a href=https:'//www.twitch.tv/"+props.name+"' target='_blank'><img src='"+img+"' class='img'/>"
         +"<p><strong>"+props.display_name+"</strong></p></a><span>"+status+"</span></p></li>")
}

var Option=(val)=>{ return "<option value="+val+">"}


var UserList=function(){
  this.totalUsers=[];
  this.options=["All","Online","Offline"].concat(DefaultUserList);
}

UserList.prototype.init=function(){
	if(typeof localStorage["twitch_users"]!="undefined"){
		this.totalUsers=JSON.parse(localStorage.getItem("twitch_users"));
		this.options=JSON.parse(localStorage.getItem("menu-options"));
		this.render();
	}else{
		localStorage.setItem("menu-options",JSON.stringify(this.options));
		this.fetch(DefaultUserList);
	}
	var options=this.options.map(function(o){return Option(o)}).join("")
	$("datalist").html(options);
		
}

UserList.prototype.fetch=function(USERS){
	var arr=this.totalUsers.slice();
	var _this=this;
	
	USERS.forEach(function(name){
	    $.getJSON(EndPoint+'channels/'+name+'?callback=?',(user)=>{
	       $.getJSON(EndPoint+'streams/'+name+'?callback=?',(str)=>{
	           
	           if(str.stream){
	            	user.stream='Online'; 
	            	user.colorCode='info';
	            	user.order=2;
	           }else if(!user.error){
	             	user.stream='Offline';
	             	user.colorCode='warning';
	             	user.order=1;
	           }else{
	           		user.display_name=user.message.split(" ")[1].replace(/'/g,"");
	           		user.name=""; //redirect to twitch homepage
          			user.order=0,
          			user.colorCode='danger',
          			user.status=user.message;
	           }
	         	arr.push(user);
	         	let len=_this.totalUsers.length;


	         	if(arr.length>=len || len==0 && arr.length==DefaultUserList.length){
	           		
	           		arr.sort((a,b)=>{return b.order-a.order})
	           		localStorage.setItem("twitch_users",JSON.stringify(arr));
	    		 	_this.totalUsers=arr; 
	    		 	if(USERS.length==1){
	    		 		_this.addOption(user.display_name);
	    		 		return _this.render([user]);
	    		 	} 
	    		 	
	    		    return _this.render();
	         	}//only sort and update totalUsers after final iteration, but within the async context
	      	})    
	    }) 
	})
}

UserList.prototype.removeUser=function(index,option){
	var newList=this.totalUsers.slice(0,index).concat(this.totalUsers.slice(index+1));
	var conf=confirm("Are you sure you want to delete this user?");
	if(conf){
		this.totalUsers=newList;
		localStorage.setItem("twitch_users",JSON.stringify(newList));
		$(".back-btn").hide();
		this.render(newList);
		this.removeOption(option);
	}
}
UserList.prototype.getIndex=function(query){
	 var res=-1;
	 this.totalUsers.forEach(function(val,i){
		if(val.name==query.toLowerCase()||val.display_name.toLowerCase()==query.toLowerCase()){
			res=i;
		}
	})
	 return res;
}


UserList.prototype.render=function(listToRender){
	var opacity="1";
	if(!listToRender){
		listToRender=this.totalUsers;
		opacity="0";
	}
	
	var list=listToRender.map((v)=>{return ListItem(v)}).join("")
	 $(".list-group").html(list)
	 $(".back-btn").css("opacity",opacity);
}

UserList.prototype.addOption=function(opt){
	this.options.push(opt);
	localStorage.setItem("menu-options",JSON.stringify(this.options));
	$("datalist").append(Option(opt));
}
UserList.prototype.removeOption=function(opt){
	
	var newList=this.options.filter((v)=>{return v.toLowerCase()!=opt.toLowerCase()})
	 localStorage.setItem("menu-options",JSON.stringify(newList));
		
}

var userlist=new UserList();
userlist.init();


function showButton(item,buttonIsVisible){
   let opacity=buttonIsVisible? "0.8":"0";
   $(item).children(".badge").css("opacity",opacity);
}

function removeListItem(item){
	var query=$(item).siblings("a").children("p").children("strong").text();
	var index=userlist.getIndex(query);


	return userlist.removeUser(index,query);
}



$(".search-btn").click(function(e){
	var query=$("#user-options").val();
	var index=userlist.getIndex(query);
	e.preventDefault();
	console.log(index,query)
	if(query=="All"){
		return userlist.render();
	}else if(query=="Online"){
		return userlist.render(userlist.totalUsers.filter((v)=>{return v.order==2}))
	}
	else if(query=="Offline"){
		return userlist.render(userlist.totalUsers.filter((v)=>{return v.order==1}))	
	}
	else if(index!=-1){
		return userlist.render([userlist.totalUsers[index]])
	}else{
		return userlist.fetch([query]);
	}
})

$(".back-btn").click(function(){
	userlist.render();
})

