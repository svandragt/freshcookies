const _browser = browser || chrome;

_browser.cookies.onChanged.addListener(cookieChanged);

function cookieChanged(changeInfo) {
    if (changeInfo.cause == "expired" || changeInfo.cause == "evicted" || changeInfo.removed) {
        return;
    }

    const cookie = changeInfo.cookie;
    const maxCookieAge = 15; // days

    const maxAllowedExpiration = Math.round((new Date).getTime() / 1000) + (maxCookieAge * 3600 * 24);

    if (cookie.expirationDate != undefined && cookie.expirationDate > maxAllowedExpiration + 600 && !cookie.session) {
        var newCookie = {};
        //If no real url is available use: "https://" : "http://" + domain + path
        newCookie.url = "http" + ((cookie.secure) ? "s" : "") + "://" + cookie.domain + cookie.path;
        newCookie.name = cookie.name;
        newCookie.value = cookie.value;
        if (!cookie.hostOnly) {
            if (console) {
                console.debug(cookie.hostOnly, cookie.domain, newCookie.url);
            }
            // This causes errors on Firefox
            if (chrome) {
                newCookie.domain = cookie.domain;
            }
        }
        newCookie.path = cookie.path;
        newCookie.secure = cookie.secure;
        newCookie.httpOnly = cookie.httpOnly;
        newCookie.storeId = cookie.storeId;

        newCookie.expirationDate = maxAllowedExpiration;
        let thenCookieSet = _browser.cookies.set(newCookie).then(cookie => {
            console.info("Cookie Shortened! Name:'" + cookie.name + "' to '" + maxAllowedExpiration + "'");
            return cookie;
        }, reason => {
            console.error(reason); // Error!
        });
    }
}