
//All events related to Landing page dropdown and page scrolling
function autoScroll(label){
  let height=$("."+label.toLowerCase()).offsetTop-$('nav').clientHeight;
  
  $('html body').animate({scrollTop:height},1000).css('overflow-y','scroll')
  //http://stackoverflow.com/questions/832860/how-to-scroll-the-window-using-jquery-scrollto-function
}

window.addEventListener('scroll',function(){
  let opacity=document.body.scrollTop>700? 1 : 0.8;
  $("nav").css("opacity",opacity); 
})

$(".nav-menu").click(function(){
  let _class=["top","middle","bottom"];
  let scroll="hidden";
  
  for(let i=0;i<3;i++){
    $(".nav-menu div:nth-child("+(i+1)+")").toggleClass(_class[i]);
  }

  $('.nav-options').removeClass("hidden")
                   .children()
                   .toggleClass("fadeIn")
                   .toggleClass("fadeOut")
 
  $("body").toggleClass("hide-scroll");

  if($("body").hasClass())

}) 
