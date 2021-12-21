var thisModel; //keep reference for viewmodel that is bound to dom

//keep reference to elements for speed improvment during scrolling
var moviesContainer; 
var scrollLoadMoreButton; 



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
		thisModel.currentScrollPageStop = thisModel.currentScrollPageStop + thisModel.scrollPageSize;
		thisModel.fetchPopularMoviesNext();
		$(this).hide();
	});

	//button to set and store the api key in a cookie
	$("#btnUseApiKey").on("click", function (event) {
		thisModel.apiKey($("#inputApiKey").val());
		TheMovieDb.setApiKey(thisModel.apiKey());
		$("#btnLoadInit").show();
	});

	//reset the api key and list of movies
	$("#txtApiKey").on("click", function (event) {
		thisModel.apiKey("");
		$("#inputApiKey").val("");
		thisModel.movies.removeAll();
		thisModel.pageToFetch = 1;
		scrollLoadMoreButton.hide();
	});

	//close the error message
	$("#btnAlert").on("click", function (event) {
		$('.alert').removeClass( "show" ).addClass( "hide" );
	});

	//initialize and bind viewmodel to dom elements
	ko.applyBindings(new myViewModel());

	//try to get api key from previous session
	thisModel.apiKey(TheMovieDb.getApiKey());

});

var myViewModel = function () {
	var self = this;
	thisModel = this;

	//variables for continous loading when scrolling
	this.fetchInProgress = false;
	this.pageToFetch = 1;
	this.currentScrollPageStop = 5;
	this.scrollPageSize = 5; //5 x 20 movie chunks = 100 movies before showing load more button


	this.apiKey = ko.observable(''); //to bind apiKey with dom element for input
	
	//array to hold all movies loaded
	//when a movie is added or removed from this array the UI element is updated 
	this.movies = ko.observableArray([]); 
 
	//take a Json movie object and map bindings, then add to the movie array
    this.addMovie = function (movieJson) {
        var movie = ko.mapping.fromJS(movieJson);
		if ((movie != null) && (this.movies.indexOf(movie) < 0)) // Prevent blanks and duplicates
		{
			movie.posterFullUrl = ko.computed(function () {
				        return (TheMovieDb.API_POSTER_URL + movie.poster_path());
				    }, movie);
			this.movies.push(movie);
		}
    };
 
	//make the call to themoviedb.org api and fetch the most popular movies. chunks of 20 movies.
    this.fetchPopularMoviesNext = function (){
		thisModel.fetchInProgress = true; //to avoid multiple calls while scrolling
		Pace.restart(); //reset progress indicator

		TheMovieDb.fetchPopularMovies(thisModel.pageToFetch, function(data){
			//success
			$.each( data.results, function( i, movie ) {
				thisModel.addMovie(movie);
			});

			if (thisModel.pageToFetch === thisModel.currentScrollPageStop) {
				scrollLoadMoreButton.show(); 
			}
			thisModel.pageToFetch ++; 
			thisModel.fetchInProgress = false;

		},
		function(){
			//fail
			thisModel.fetchInProgress = false;
			$('.alert').removeClass( "hide" ).addClass( "show" );
			console.log('getJSON request failed! ' + textStatus);
		});

	}
};



//scrolling will auto load next set of movies to show
$(window).scroll(function () {
    if (thisModel.currentScrollPageStop >= thisModel.pageToFetch) {
        if ((moviesContainer.offset().top + moviesContainer.height()) <= ($(window).scrollTop() + $(window).height() + 100)  && !thisModel.fetchInProgress) {
            scrollLoadMoreButton.hide();
            thisModel.fetchPopularMoviesNext();
        }
    }
});
 


