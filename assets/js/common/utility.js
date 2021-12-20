
Utility = function () {

	var _getCookie = function(cname, defaultValue) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		if (defaultValue != null) {
			return defaultValue;
		} else {
			return "";
		}
	}

	var _setCookie = function (cname, value, noOfDays) {
		var theDate = new Date()
		theDate.setDate(theDate.getDate() + noOfDays);
		document.cookie = cname + "=" + value + ";expires=" + theDate.toGMTString() + ";path=/"
	}

	return {

		getCookie: _getCookie,
		setCookie: _setCookie,

	}

}();