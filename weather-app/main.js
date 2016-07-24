const IP_URL='https://freegeoip.net/json/'
const Root_URL='https://api.forecast.io/forecast/'
const KEY='94269274acb05155270ba58e89e88e63/';

const Minutes=15*60;
const Interval=Minutes*1000; 

const Time=new Date();

const Images={
  "clear-day":"2/24/California-05731_-_Clear_Day_%2820637551715%29.jpg",
  "clear-night":"d/d6/Hiding_in_the_night_sky.jpg",
  "rain":"8/8d/Here_comes_rain_again.jpg",
  "snow":"c/cf/Heavy_snow_-_2_%283260168691%29.jpg",
  "sleet":"9/9f/Sleet_on_the_ground.jpg",
  "wind":"2/21/Blowing_in_the_wind_-_geograph.org.uk_-_711606.jpg",
  "fog":"e/e3/Bliggspitze_Fog.JPG",
  "cloudy":"1/1d/Cloudy_sky_over_Bergamo.jpg",
  "partly-cloudy-day":"4/40/Cloudy_Day_03.jpg",
  "partly-cloudy-night":"7/78/British_Night_Sky_%286965599269%29.jpg",
  "hail":"7/79/FEMA_-_44376_-_truck_windshield_with_hail_damage_in_OK.jpg",
  "thunderstorm":"8/88/Thunderstorm_003.jpg",
  "tornado":"e/ef/Occluded_mesocyclone_tornado5_-_NOAA.jpg"
}

const BG=(bg)=>{return `url(https://upload.wikimedia.org/wikipedia/commons/${Images[bg]})center center no-repeat`}
const Icon=(icon)=>{return" <i class='wi wi-forecast-io-"+icon+"'></i>"}

let Temp;//global temperature object
let Unit="F"; //global unit variable so units don't revert to default after each update


$(document).ready(function(){

  function format(time){
    let label=" AM",
        hour; 
    time=time.split(" ")[0].split(":").slice(0,2);
    hour=time[0];
    
    if(hour>12){
      time[0]= hour!=24? hour%12:12;
      //makes sure midnight doesn't display as 00 
      label=" PM";
    }
    return "Last updated at "+time.join(":")+ label;
  }

  function Temperature(val){
    this.F=val; 
    this.C=((val-32)*0.5556).toPrecision(3);
    this.value=Unit=="F"?this.F:this.C;
  }

  Temperature.prototype.toggle=function(){
     this.value=Unit=="C"?this.F : this.C;
     Unit=Unit=="F"?"C":"F";
     $(".display").html(this.value+" &deg "+Unit);
  }
  
  function getWeather(location){
    
    $.get(IP_URL,function({longitude,latitude,city}){
      let URL=Root_URL+KEY+latitude+","+longitude;
      $('.title h1').html(city);

      $.ajax({
        url:Root_URL+KEY+latitude+","+longitude,
        dataType:"jsonp",
        success:function({currently,alerts}){
          Temp=new Temperature(currently.temperature.toFixed(1));
          if(alerts){
            $(".warning").html("<a target='blank' href="+alerts[0].uri+">"+alerts[0].title+"</a>");
          }
          $("body").css("background",BG(currently.icon))
                   .css("background-size","cover");
          $('.display').html( Temp.value+" &deg "+Unit);
          $(".condition").html(currently.summary+Icon(currently.icon));
        }
      })
    });
  }
  $('.display').click(function(){
    Temp.toggle();
  })//Convert units by clicking icon

  function render(){
     $('.clock').html("<p>"+format(Time.toTimeString())+"</p>");
      getWeather();
  };

  setInterval(function(){
    console.log(Temp.value,format(Time.toTimeString()));
    Time.setSeconds(Time.getSeconds()+Minutes);
    render();
  },Interval)
  //Update 

  render();
})