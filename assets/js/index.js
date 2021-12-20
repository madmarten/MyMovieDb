var api_poster_url = "https://image.tmdb.org/t/p/w185";
var api_popular_url = "https://api.themoviedb.org/3/movie/popular"

var thisModel; //keep reference for viewmodel that is bound to dom

//keep reference to elements for speed improvment during scrolling
var moviesContainer; 
var scrollLoadMoreButton; 

//variables for continous loading when scrolling
var fetchInProgress = false;
var pageToFetch = 1;
var currentScrollPageStop = 5;
var scrollPageSize = 5;

$(document).ready(function () {
	moviesContainer = $("#movies");
	scrollLoadMoreButton = $("#btnLoadMore")
	scrollLoadMoreButton.hide();

	//button to load the initial set of movies
	$("#btnLoadInit").on("click", function (event) {
		event.preventDefault();
		//get initial set of movies
		thisModel.fetchPopularMoviesNext();
		$(this).hide();
		
	});

	//button for continue loading after scroll stop
	scrollLoadMoreButton.on("click", function (event) {
		event.preventDefault();
		currentScrollPageStop = currentScrollPageStop + scrollPageSize;
		thisModel.fetchPopularMoviesNext();
		$(this).hide();
	});

	//button to set and store the api key in a cookie
	$("#btnUseApiKey").on("click", function (event) {
		thisModel.apiKey($("#inputApiKey").val());
		Utility.setCookie("apiKey", thisModel.apiKey(), 30);
		$("#btnLoadInit").show();
	});

	//reset the api key and list of movies
	$("#txtApiKey").on("click", function (event) {
		thisModel.apiKey("");
		$("#inputApiKey").val("");
		thisModel.movies.removeAll();
		pageToFetch = 1;
	});

	//close the error message
	$("#btnAlert").on("click", function (event) {
		$('.alert').removeClass( "show" ).addClass( "hide" );
	});

	//initialize and bind viewmodel to dom elements
	ko.applyBindings(new myViewModel());

	//try to get api key from previous session
	thisModel.apiKey(Utility.getCookie("apiKey",""));

});

var myViewModel = function () {
	var self = this;
	thisModel = this;

	this.apiKey = ko.observable('');
	
	//array to hold all movies loaded
	//when a movie is added or removed from this array the UI element is updated 
	this.movies = ko.observableArray([]); 
 
	//take a Json movie object and map bindings, then add to the movie array
    this.addMovie = function (movieJson) {
        var movie = ko.mapping.fromJS(movieJson);
		if ((movie != null) && (this.movies.indexOf(movie) < 0)) // Prevent blanks and duplicates
		{
			movie.posterFullUrl = ko.computed(function () {
				        return (api_poster_url + movie.poster_path());
				    }, movie);
			this.movies.push(movie);
		}
    };
 
	//make the call to themoviedb.org api and fetch the most popular movies. chunks of 20 movies.
    this.fetchPopularMoviesNext = function (){
		fetchInProgress = true; //to avoid multiple calls while scrolling
		Pace.restart(); //reset progress indicator

		var api_url = api_popular_url + "?api_key=" + this.apiKey() + "&page=" + pageToFetch;
	
		$.getJSON( api_url, function( data ) {
			$.each( data.results, function( i, movie ) {
				thisModel.addMovie(movie);
			});

			if (pageToFetch === currentScrollPageStop) {
		        scrollLoadMoreButton.show(); //show load more button since we reached max nr of pages to auto load
		    }
			pageToFetch ++; //set the next page to load when this method i called next time
			fetchInProgress = false;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			$('.alert').removeClass( "hide" ).addClass( "show" );
			console.log('getJSON request failed! ' + textStatus);
		 });
	}
};



//scrolling will auto load next set of movies to show
$(window).scroll(function () {
    if (currentScrollPageStop >= pageToFetch) {
        if ((moviesContainer.offset().top + moviesContainer.height()) <= ($(window).scrollTop() + $(window).height() + 100)  && !fetchInProgress) {
            scrollLoadMoreButton.hide();
            thisModel.fetchPopularMoviesNext();
        }
    }
});
 


