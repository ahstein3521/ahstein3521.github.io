var valueOnScreen="";
var values=["+"];


$('.btn').click(function(){
  let val=this.innerHTML;
  if(val.match(/[0-9]/)){
    handleNumberClick(val)
  }
  else if(val.match(/[-%+/]/)||val=="X"){
    handleOperation(val)
  }else if(val=="AC"){
    clear();//function is not registering as onclick attr in html
  }
  else{
    this.onclick;
  }
});

function handleNumberClick(num){
   if((num==0 && valueOnScreen==="0")||valueOnScreen.length>7){
    return
  //stop user from inputting num longer than calculator screen
  //handle edge case where input is 0 and the only value on screen is 0
  }else{
    valueOnScreen+=num;
    renderScreen();
  }
}
function handleOperation(operator){
  let total=$(".screen").text();
  
  if(total!==valueOnScreen){
    valueOnScreen=total;
  }//performing operations on a previously calculated value
  
  values.push(+valueOnScreen,operator)
  valueOnScreen="";
  renderScreen();
}
function calculate(a,operation,b){
  switch (operation){
    case "+":
      return a+b;
    case "-":
      return a-b;
    case "/":
      return a/b;
    case "%":
      return a%b;
    case "X":
      return a*b;
  }//convert segments of array into mathematical expression;
}
function getTotal(){
  var res=0;
  values.push(+valueOnScreen);
  
  for(var i=0;i<values.length-1;i+=2){
    res=calculate(res,values[i],values[i+1])
  }//todo: refactor as Array.prototype.reduce()
  valueOnScreen=formatNum(res);
  renderScreen();
  reset();
}

function formatNum(num){
  return(String(num).length>7)? num.toFixed(6):num;
}//make sure num fits on screen

function reset(){
  valueOnScreen="";
  values=["+"];
}

function clear(){
  reset();
  renderScreen();
}

function clearDigit(){
  let len=valueOnScreen.length-1
    valueOnScreen=valueOnScreen.slice(0,len)
    renderScreen();
}
function handleDecimal(){
  let len=valueOnScreen.length;
  if(!len){
    valueOnScreen+="0."
  }
  else if(Number.isInteger(+valueOnScreen)){
    valueOnScreen+=".";
  }
  renderScreen();
}

function renderScreen(){
  $('.screen').html("<h2>"+valueOnScreen+"</h2>")
};
//BUG:creating a number over a certain length wont render on screen but will still  affect the final calculation
//BUG:Operations involving decimals will sometimes print out an odd number of placeholder zeroes at the end of a calculation - ex. 0.3+0.6==0.90000000 but 0.2+0.5==0.7