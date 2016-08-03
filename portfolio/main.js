
//All events related to Landing page dropdown and page scrolling
function autoScroll(label){
  let height=$("."+label.toLowerCase()).offsetTop-$('nav').clientHeight;
  smoothScroll(height);
}
function smoothScroll(height){
  $('html body').animate({scrollTop:height},1000).css('overflow-y','scroll')
//http://stackoverflow.com/questions/832860/how-to-scroll-the-window-using-jquery-scrollto-function
}

function toggleScrollHeight(){
  $("body").toggleClass("hide-scroll");

  if($("body").hasClass("hide-scroll")){
    $("html body").css("position","fixed").css("overflow-y","scroll")
  }else{
    smoothScroll(localStorage.getItem("top"))
    $("html body").css('position','static');
  }
}

window.addEventListener('scroll',function(){
  let opacity=document.body.scrollTop>700? 1 : 0.8;
  $("nav").css("opacity",opacity); 
})

$(".nav-menu").click(function(){
  let _class=["top","middle","bottom"];
  
  if(document.body.scrollTop!=0){
    localStorage.setItem("top",document.body.scrollTop)
  }
  
  for(let i=0;i<3;i++){
    $(".nav-menu div:nth-child("+(i+1)+")").toggleClass(_class[i]);
  }

  $('.nav-options').removeClass("hidden")
                   .children()
                   .toggleClass("fadeIn")
                   .toggleClass("fadeOut")
  toggleScrollHeight();
}) 
