TheMovieDb = function () {

	const _API_POSTER_URL = "https://image.tmdb.org/t/p/w185";
	const _API_POPULAR_URL = "https://api.themoviedb.org/3/movie/popular";

	const _API_KEY_COOKIE_NAME = "apiKey";

	var _apiKey = '';

	var _setApiKey = function(apiKey) {
		_apiKey = apiKey;
		Utility.setCookie(_API_KEY_COOKIE_NAME, apiKey, 30);
	}

	var _getApiKey = function () {
		if(_apiKey === ''){
			_apiKey = Utility.getCookie(_API_KEY_COOKIE_NAME,'');
		}
		return _apiKey;
	}

	var _fetchPopularMovies = function (page, successCallback, failCallback) {
		var api_url = TheMovieDb.API_POPULAR_URL + "?api_key=" + _apiKey + "&page=" + page;
	
		$.getJSON( api_url, function( data ) {
			if (successCallback && typeof (successCallback) === "function") {
				successCallback(data);
			}
			return data.results;
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 
			if (failCallback && typeof (failCallback) === "function") {
				failCallback(jqXHR, textStatus, errorThrown);
			}
			console.log('getJSON fetchPopularMovies request failed: ' + textStatus);
		 });
	}

	return {
		API_POSTER_URL: _API_POSTER_URL,
		API_POPULAR_URL: _API_POPULAR_URL,

		setApiKey: _setApiKey,
		getApiKey: _getApiKey,
		fetchPopularMovies: _fetchPopularMovies,
	}
}();