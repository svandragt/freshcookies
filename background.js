chrome.cookies.onChanged.addListener( function(changeInfo) {

	var cookie = changeInfo.cookie;
	
	var name = cookie.name;
	var domain = cookie.domain;
	var value = cookie.value;

	var maxCookieAge = 10; // days


 	if(changeInfo.cause == "expired" || changeInfo.cause == "evicted" || changeInfo.removed) {
		return;
 	}
	
	var maxAllowedExpiration = Math.round((new Date).getTime()/1000) + (maxCookieAge * 3600 * 24);

	if(cookie.expirationDate != undefined && cookie.expirationDate > maxAllowedExpiration+60) {

		var newCookie = {};
		//If no real url is available use: "https://" : "http://" + domain + path
		newCookie.url = "http" + ((cookie.secure) ? "s" : "") + "://" + cookie.domain + cookie.path;
		newCookie.name = cookie.name;
		newCookie.value = cookie.value;
		if(!cookie.hostOnly) {
		    newCookie.domain = cookie.domain;
		}
		newCookie.path = cookie.path;
		newCookie.secure = cookie.secure;
		newCookie.httpOnly = cookie.httpOnly;
		if(!cookie.session) {
		    newCookie.expirationDate = cookie.expirationDate;
		}
		newCookie.storeId = cookie.storeId;

		if(!cookie.session) {
			newCookie.expirationDate = maxAllowedExpiration;
		}
		chrome.cookies.set(newCookie);
		console.log("Cookie Shortened! Name:'"+cookie.name+"' from '"+cookie.expirationDate+"' to '"+maxAllowedExpiration+"'");
	}
});