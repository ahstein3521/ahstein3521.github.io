const DefaultUserList = ['medrybw',"freecodecamp", "billy","nightblue3","syndicate",
						"riotgames","RobotCaleb","imaqtpie","esl_csgo","sodapoppin"];

const EndPoint='https://api.twitch.tv/kraken/';
const Default_IMG="https://placeholdit.imgix.net/~text?txtsize=33&txt=ImageNotAvailable&w=300&h=300"; 

const ListItem=function(props,enter,leave){
	var img=props.logo? props.logo: Default_IMG;
	var status=props.status? props.status : " ";
    
  return("<li class='list-group-item list-group-item-"+props.colorCode+"' onmouseenter='"+enter+"' onmouseleave='"+leave+"'><span class='badge'>X</span><a href='https://www.twitch.tv/"+
  		 props.name+"' target='_blank'><img src='"+img+"' class='img'/><p><strong>"+props.display_name+"</strong></p></a><span>"+status+"</span></p></li>")
}


const Option=(val)=>{ return "<option value="+val+">"}


const UserList=function(){
  this.totalUsers=[];
  this.options=["All","Online","Offline"].concat(DefaultUserList);
  this.searchResult={};//temporary variable 
}

UserList.prototype.init=function(){
	
	if(typeof localStorage["twitch_users"]!="undefined"){
		this.totalUsers=JSON.parse(localStorage.getItem("twitch_users"));
		this.options=JSON.parse(localStorage.getItem("menu-options"));
		this.render(this.totalUsers);
	}
	else{
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
	    		 	
	    		 	if(USERS.length==1){
	    		 		return _this.renderQuery(user);
	    		 	} 
	    		    return _this.update(arr);
	         	}//only sort and update totalUsers after final iteration, but within the async context
	      	})    
	    }) 
	})
}

UserList.prototype.removeUser=function(index,option){
	var newList=this.totalUsers.slice(0,index).concat(this.totalUsers.slice(index+1));
	this.update(newList);
	this.removeOption(option);
}

UserList.prototype.followUser=function(){
	this.totalUsers.push(this.searchResult);
	this.totalUsers.sort((a,b)=>{return b.order-a.order});
    this.update(this.totalUsers);
    this.addOption();
}

UserList.prototype.update=function(newList){
	this.totalUsers=newList;
	localStorage.setItem("twitch_users", JSON.stringify(newList));
	this.render(newList)
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
	var opacity=listToRender.length<this.totalUsers.length? "1":"0";
	var list=listToRender.map((v)=>{return ListItem(v,"showButton(this,true)","showButton(this,false)")})
	 
	$(".list-group").html(list.join(""));
	$(".back-btn").css("opacity",opacity);
}
UserList.prototype.renderQuery=function(query){
	$(".follow-btn").css("opacity","1");
	$(".back-btn").css("opacity","1");
	this.searchResult=query;	
	$(".list-group").html(ListItem(query,"null","null"));
}
UserList.prototype.addOption=function(){
	var newOption=this.searchResult.display_name;
	this.options.push(newOption);
	localStorage.setItem("menu-options",JSON.stringify(this.options));
	$("datalist").append(Option(newOption));
}

UserList.prototype.removeOption=function(opt){
	console.log(opt);
	var newList=this.options.filter((v)=>{return v.toLowerCase()!=opt.toLowerCase()})
	localStorage.setItem("menu-options",JSON.stringify(newList));	
}


let userlist=new UserList();
userlist.init();


function showButton(item,buttonIsVisible){
   let opacity=buttonIsVisible && !$(item).hasClass("search-result")? "0.8":"0";
   $(item).children(".badge").css("opacity",opacity);
}

function removeListItem(item){
	var query=$(item).siblings("a").children("p").children("strong").text();
	var index=userlist.getIndex(query);

	return userlist.removeUser(index,query);
}



$(".search-btn").on("click",function(e){
	var query=$("#user-options").val();
	var index=userlist.getIndex(query);
	e.preventDefault();
	
	if(query=="All"){
		return userlist.render(userlist.totalUsers);
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

// $(".list-group-item").on("mouseenter",function(){showButton(this,true)})
// 					 .on("mouseleave",function(){showButton(this,false)});

$(".badge").on("click",function(){ removeListItem(this)});					 

$(".back-btn").on("click",function(){
	$(".follow-btn").css("opacity","0");
	userlist.render(userlist.totalUsers);
})
$(".follow-btn").on("click",function(){
	$(this).css("opacity","0");
   userlist.followUser();
   userlist.render(userlist.totalUsers)
})

$(document).scroll(function(){
	var top=$(this).scrollTop();
	if(top>70){
		$("nav").css("background","#dfdaff").css("box-shadow","2px 2px 2px rgba(0,0,0,0.6)")
		$(".search-btn").css("color","black");
	}else{
		$("nav").css("background","white").css("box-shadow","none");
	}
})