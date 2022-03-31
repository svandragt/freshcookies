const _browser = browser || chrome;

let _settings = {
    'maxExpiryDays': 15,
};

_browser.cookies.onChanged.addListener(cookieChanged);

function onError(error) {
    console.error(error);
}

function onGot(item) {
    if (item.maxExpiryDays) {
        _settings.maxExpiryDays = item.maxExpiryDays;
        console.info("Changed _settings.maxExpiryDays:" + _settings.maxExpiryDays);
    }
}

let getting = browser.storage.sync.get("maxExpiryDays");
getting.then(onGot, onError);

console.info('Fresh Cookies loaded.');

function isExpiredChangeEvent(changeInfo) {
    return changeInfo.cause == "expired" || changeInfo.cause == "evicted" || changeInfo.removed;
}

function cookieChanged(changeInfo) {
    if (isExpiredChangeEvent(changeInfo)) {
        return;
    }

    const cookie = changeInfo.cookie;
    const bufferTimeMinutes = 10;

    const maxAllowedExpiration = Math.round((new Date).getTime() / 1000) + (_settings.maxExpiryDays * 3600 * 24);

    if (!cookie.session && cookie.expirationDate != undefined && cookie.expirationDate > maxAllowedExpiration + (bufferTimeMinutes * 60)) {
        // TODO can I just clone cookie and amend?
        var newCookie = {};
        newCookie.name = cookie.name;
        newCookie.value = cookie.value;
        newCookie.path = cookie.path;
        newCookie.secure = cookie.secure;
        newCookie.httpOnly = cookie.httpOnly;
        newCookie.storeId = cookie.storeId;

        newCookie.expirationDate = maxAllowedExpiration;
        //If no real url is available use: "https://" : "http://" + domain + path
        newCookie.url = "http" + ((cookie.secure) ? "s" : "") + "://" + cookie.domain.substring(1) + cookie.path;

        if (!cookie.hostOnly) {
            newCookie.domain = cookie.domain;
        }

        let thenCookieSet = _browser.cookies.set(newCookie).then(ck => {
            console.info("Cookie Shortened! Name:'" + ck.name + "' to '" + ck.expirationDate + "'");
            return ck;
        }, reason => {
            console.error(reason); // Error!
        });
    }
}