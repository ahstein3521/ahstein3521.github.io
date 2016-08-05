const RootURL="https://en.wikipedia.org/"
const Params="/w/api.php?action=query&list=search&format=json&srprop=snippet&srsearch=";


const formatEndpoint=term=> RootURL+Params+term

const button=title=>'<button data-target=".modal-iframe" class="article-btn" id="'+title+'" data-toggle="modal">'+title+"</button>"

function formatHTML({title,snippet}){ 
	return "<div class='result'>"+button(title)+"<p>"+snippet+"...</p></div>"}

function renderResults(data){
	
	if(data.query && data.query.search.length){		
		var results=data.query.search.map((v)=>{return formatHTML(v)}).join("");		
		$('.img-responsive').addClass('hidden');
		$(".search-results").removeClass("hidden").html(results);				
		//there were no errors and the results were retrieved
	}else if(data.error){
		alert("Error: "+data.error.info);
	}
	else{
		alert("Your search for "+$("input").val()+" didn't return any results.");	
	}
}

function wikiSearch(){
	$.ajax({type:"GET",
      		dataType:'jsonp',
            url: formatEndpoint($("#magnifying-glass").val()),
            success:renderResults
    });
}

$("input").on("keydown",function(e){
	if(e.which==13) wikiSearch();
})//simulates a real form submission

$(document).on("click", ".article-btn", function () {
     var title= $(this).attr("id");
     $("iframe").attr("src",RootURL+"wiki/"+title.replace("'","%27"))
});//pass the url of the specific article that was clicked on to the iframe

$(document).on("click", ".random", function () {
     $("iframe").attr("src","https://en.wikipedia.org/wiki/Special:Random")
});
