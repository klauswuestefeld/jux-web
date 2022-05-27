'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var msal = require('@azure/msal-browser');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var msal__namespace = /*#__PURE__*/_interopNamespace(msal);

var getBrowserLanguage = function () {
    var result = (navigator.languages && navigator.languages.length)
        ? navigator.languages[0]
        : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    return result.substring(0, 2);
};
var OVERRIDE_KEY = 'jux.language.override';
var translations = {};
var chosenLanguage = localStorage.getItem(OVERRIDE_KEY) || getBrowserLanguage();
var reloadWithLanguageOverride = function (lang) {
    localStorage.setItem(OVERRIDE_KEY, lang);
    location.reload();
};
// @ts-ignore
var getTranslation = function (k) { return translations[k] || k; };
var initLanguage = function (translations_) {
    translations = translations_[chosenLanguage];
    document.title = getTranslation('title');
    document.documentElement.lang = chosenLanguage;
};

var THRESHOLD_WIDTH = 640;

var icons = {
    email: '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 64.000000 48.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M44 468 c-38 -18 -44 -51 -44 -228 0 -180 6 -210 47 -229 33 -15 513 -15 546 0 41 19 47 49 47 229 0 180 -6 210 -47 229 -31 14 -519 14 -549 -1z m516 -33 c0 -7 -232 -205 -240 -205 -8 0 -240 198 -240 205 0 3 108 5 240 5 132 0 240 -2 240 -5z m-406 -118 l59 -53 -87 -97 -86 -97 0 170 0 171 28 -20 c15 -11 54 -44 86 -74z m446 -77 l0 -170 -85 95 c-47 53 -85 98 -85 99 0 5 162 146 167 146 1 0 3 -77 3 -170z m-319 -31 l39 -31 40 32 39 31 33 -37 c18 -21 57 -65 87 -99 l53 -60 -126 -3 c-69 -1 -183 -1 -252 0 l-126 3 84 97 c46 53 85 97 87 97 2 1 21 -13 42 -30z"/>  </g> </svg>',
    google: '<svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>',
    linkedin: '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="100%" height="100%" viewBox="1.786 1.783 76.226652 76.248" version="1.1" id="svg72" sodipodi:docname="linkedin.svg" inkscape:version="0.92.4 (5da689c313, 2019-01-14)"> <metadata id="metadata78"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <defs id="defs76" /> <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1916" inkscape:window-height="1036" id="namedview74" showgrid="false" inkscape:zoom="0.79365665" inkscape:cx="428.70379" inkscape:cy="325.16058" inkscape:window-x="0" inkscape:window-y="20" inkscape:window-maximized="0" inkscape:current-layer="svg72" inkscape:pagecheckerboard="false" /> <path d="m 2.10821,7.2952417 c 0,-3.015 2.508,-5.462 5.6,-5.462 h 64.568 c 3.093,0 5.6,2.447 5.6,5.462 V 72.620242 c 0,3.016 -2.507,5.461 -5.6,5.461 h -64.568 c -3.092,0 -5.6,-2.445 -5.6,-5.46 V 7.2942417 Z" id="path64" inkscape:connector-curvature="0" style="fill:#0b78b7;fill-opacity:1" /> <path d="m 25.07621,65.660242 v -34.43 h -11.444 v 34.43 h 11.445 z m -5.72,-39.13 c 3.99,0 6.474,-2.644 6.474,-5.948 -0.075,-3.379 -2.484,-5.949 -6.398,-5.949 -3.917,0 -6.475,2.57 -6.475,5.949 0,3.304 2.483,5.948 6.324,5.948 h 0.074 z m 12.054,39.13 h 11.443 v -19.225 c 0,-1.028 0.075,-2.058 0.377,-2.792 0.827,-2.057 2.71,-4.186 5.872,-4.186 4.14,0 5.797,3.157 5.797,7.786 v 18.417 h 11.443 v -19.741 c 0,-10.575 -5.645,-15.496 -13.174,-15.496 -6.173,0 -8.884,3.45 -10.39,5.8 h 0.076 v -4.992 h -11.443 c 0.149,3.23 -0.001,34.43 -0.001,34.43 z" id="path70" inkscape:connector-curvature="0" style="fill:#ffffff" /> </svg>',
    microsoft: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 21 21"><title>MS-SymbolLockup</title><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>',
};
var applyComponentStyle = function (component) {
    component.style.alignItems = 'center';
    component.style.background = '#fff';
    component.style.border = 'thin solid #888';
    component.style.borderRadius = '5px';
    component.style.boxShadow = '1px 1px 1px grey';
    component.style.boxSizing = 'content - box';
    component.style.color = '#444';
    component.style.display = 'grid';
    component.style.gridTemplateColumns = '12% 1fr 4fr';
    component.style.height = '42px';
    component.style.marginTop = '16px';
    component.style.padding = '0 12px';
    component.style.whiteSpace = 'nowrap';
    component.style.width = '276px';
    component.style.boxSizing = 'content-box';
};
var applyLabelStyle = function (label) {
    label.style.display = 'inline-block';
    label.style.fontSize = '14px';
    label.style.fontWeight = '500';
    label.style.gridColumnStart = '3';
    label.style.marginRight = '34px';
    label.style.paddingLeft = '20px';
};
var loginButton = function (type, fn) {
    var loweredCasedType = type.toLowerCase();
    var result = document.createElement('login-button');
    applyComponentStyle(result);
    result.tabIndex = 0;
    result.setAttribute('data-cy', "".concat(loweredCasedType, "-button"));
    var icon = document.createElement('login-icon');
    icon.style.gridColumnStart = '2';
    icon.style.width = '28px';
    icon.style.height = '28px';
    icon.style.padding = '6px';
    icon.style.marginLeft = '4px';
    icon.style.boxSizing = 'content-box';
    icon.className = 'ico';
    // @ts-ignore
    icon.innerHTML = icons[loweredCasedType];
    var label = document.createElement('login-label');
    label.textContent = window.innerWidth <= THRESHOLD_WIDTH ? type : getTranslation("".concat(loweredCasedType, "-label"));
    applyLabelStyle(label);
    result.append(icon, label);
    result.addEventListener('click', fn);
    result.addEventListener('mouseenter', function () {
        result.style.cursor = 'pointer';
        result.style.boxShadow = '0 0 6px #808080';
    });
    result.addEventListener('mouseleave', function () {
        result.style.cursor = 'auto';
        result.style.boxShadow = '1px 1px 1px grey';
    });
    return result;
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var extractTokenFromWindowLocation = function (tokenParam, additionalParam) {
    if (additionalParam === void 0) { additionalParam = ''; }
    if (!tokenParam) {
        return;
    }
    var token = '';
    var tokenParameterName = "".concat(tokenParam, "=");
    var tokenParameterIndex = window.location.search.indexOf(tokenParameterName);
    if (tokenParameterIndex !== -1) {
        var tokenParameterNameLength = tokenParameterName.length;
        var nextParameterIndex = window.location.search.indexOf('&', tokenParameterIndex);
        token = (nextParameterIndex === -1) ?
            window.location.search.substring(tokenParameterIndex + tokenParameterNameLength) :
            window.location.search.substring(tokenParameterIndex + tokenParameterNameLength, nextParameterIndex);
        var searchWithoutToken = window.location.search.replace("".concat(tokenParam, "=") + token, '').replace(additionalParam, '').replace('\&cypress=true', '');
        if (searchWithoutToken === '?') {
            searchWithoutToken = '';
        }
        window.history.replaceState({}, document.title, window.location.pathname + searchWithoutToken);
    }
    return token;
};

var _a;
//@ts-ignore
var backendUrl = process.env.BACKEND_URL;
//@ts-ignore
var secondaryBackendUrl = (_a = process.env.STAGING_BACKEND_URL) !== null && _a !== void 0 ? _a : '';
var backendUrlToTry = backendUrl;
var apiUrl = backendUrl + 'api/';
var googleAuthUrl = backendUrl + 'auth-google?google-id-token=';
var microsoftAuthUrl = backendUrl + 'auth-microsoft?access-token=';
var magicAuthReqUrl = backendUrl + 'magic-link-request?email=';
var timeout;
var maxRetries = 20;
var retries = 0;
var applySpinnerStyle = function (spinner) {
    spinner.style.position = 'fixed';
    spinner.style.top = '50%';
    spinner.style.zIndex = '2147483647';
    spinner.style.border = '8px solid #bababa';
    spinner.style.borderTopColor = '#171f1c';
    spinner.style.height = '80px';
    spinner.style.width = '80px';
};
var renderOverlay = function () {
    var overlay = document.createElement('reconnect-overlay');
    var spinner = document.createElement('loading-spinner');
    spinner.className = 'reconnect-spinner';
    applySpinnerStyle(spinner);
    document.body.append(overlay, spinner);
};
var removeOverlay = function () {
    var _a, _b;
    (_a = document.querySelector('reconnect-overlay')) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = document.querySelector('.reconnect-spinner')) === null || _b === void 0 ? void 0 : _b.remove();
};
var backendHelpMessage = function (req) {
    return req.response && req.response.error || req.response || req;
};
var backendRequest = function (requestType, url, postContent, onJsonResponse, onHelpMessage) {
    if (url.includes(backendUrl)) {
        url = url.replace(backendUrl, backendUrlToTry);
    }
    else if (url.includes(secondaryBackendUrl)) {
        url = url.replace(secondaryBackendUrl, backendUrlToTry);
    }
    clearInterval(timeout);
    var req = new XMLHttpRequest();
    req.open(requestType, url, true);
    // @ts-ignore
    var backendToken = window.store.backendToken;
    if (backendToken) {
        req.setRequestHeader('auth', backendToken);
    }
    req.setRequestHeader('Content-Type', 'application/json');
    req.responseType = 'json';
    req.onerror = req.ontimeout = function () {
        if (req.status === 401) {
            localStorage.removeItem('token');
            alert(getTranslation('session-expired-msg'));
            location.reload();
            // googleAuthSignOut(); TODO
        }
        else if (req.status === 0) {
            if (retries >= maxRetries) {
                removeOverlay();
                // displayPage(Page.DISCONNECTED); TODO
                return;
            }
            retries++;
            if (!document.querySelector('reconnect-overlay')) {
                renderOverlay();
            }
            var backupBackendUrl = backendUrlToTry === backendUrl
                ? secondaryBackendUrl
                : backendUrl;
            url = url.replace(backendUrlToTry, backupBackendUrl);
            backendUrlToTry = backupBackendUrl;
            timeout = setTimeout(function () {
                backendRequest(requestType, url, postContent, onJsonResponse, onHelpMessage);
            }, 2000);
        }
        else {
            onHelpMessage(backendHelpMessage(req));
        }
    };
    req.onload = function () {
        retries = 0;
        removeOverlay();
        if (req.status === 200 || req.status === 202) {
            onJsonResponse(req.response);
        }
        else {
            if (req.onerror) {
                // @ts-ignore
                req.onerror();
            }
        }
    };
    req.timeout = 25000;
    req.send(postContent);
};
var backendGet = function (endpoint, onJsonResponse, onHelpMessage) {
    var api = apiUrl + endpoint;
    if (endpoint.includes(googleAuthUrl) || endpoint.includes(microsoftAuthUrl)) {
        api = endpoint;
    }
    backendRequest('GET', api, undefined, onJsonResponse, onHelpMessage);
};
var backendGetPromise = function (endpoint) { return new Promise(function (resolve, reject) {
    return backendGet(endpoint, resolve, reject);
}); };
var requestMagicLink = function (data, onJsonResponse) {
    backendRequest('GET', magicAuthReqUrl + encodeURIComponent(data.email) + '&destination=' + extractTokenFromWindowLocation('destination') + '&token=' + data.token, undefined, onJsonResponse, function () { });
};
var getMXData = function (domainName) { return __awaiter(void 0, void 0, void 0, function () {
    var records, recordsJson, answer, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://dns.google.com/resolve?name=".concat(domainName, "&type=MX"), {
                    method: 'GET',
                    mode: 'cors'
                })];
            case 1:
                records = _a.sent();
                return [4 /*yield*/, records.json()];
            case 2:
                recordsJson = _a.sent();
                answer = recordsJson.Answer;
                if (!answer) {
                    return [2 /*return*/, null];
                }
                data = Array.from(answer).map(function (a) { return a.data; });
                return [2 /*return*/, data];
        }
    });
}); };

var cleared = false;
var clearCookieValidation = function () {
    var _a;
    (_a = document.querySelector('#cookie-test-iframe')) === null || _a === void 0 ? void 0 : _a.remove();
    cleared = true;
};
var checkCookiesEnable = function (ev, onEnabled, onDisabled) {
    if (ev.data === 'MM:3PCunsupported') {
        clearCookieValidation();
        if (onDisabled) {
            onDisabled();
        }
    }
    else if (ev.data === 'MM:3PCsupported') {
        clearCookieValidation();
        onEnabled();
    }
};
var cookieTest = function () {
    var frame = document.createElement('iframe');
    frame.id = 'cookie-test-iframe';
    frame.src = 'https://mindmup.github.io/3rdpartycookiecheck/start.html';
    frame.style.display = 'none';
    document.body.appendChild(frame);
};
var validateThirdPartyCookies = function (onEnabled, onDisabled) {
    cleared = false;
    var listener = function (ev) { return checkCookiesEnable(ev, onEnabled, onDisabled); };
    window.addEventListener('message', listener);
    var timer = setInterval(function () {
        if (cleared) {
            window.removeEventListener('message', listener);
            clearInterval(timer);
        }
    }, 50);
    cookieTest();
};

var enableSignInLayout = function () {
    document.documentElement.style.cursor = 'progress';
    document.body.style.opacity = '0.5';
    document.body.style.pointerEvents = 'none';
};
var disableSignInLayout = function () {
    document.documentElement.style.cursor = 'default';
    document.body.style.opacity = '1';
    document.body.style.pointerEvents = 'auto';
};

var authStatus;
var authError;
var highLevelUser = function (gUser) {
    var profile = gUser.getBasicProfile();
    return {
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl(),
        googletoken: gUser.getAuthResponse().id_token
    };
};
var onUserChanged = function (googleUser, onUserLogin) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                document.documentElement.classList.remove('progress');
                document.body.classList.remove('disabled');
                if (!googleUser) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, backendGetPromise(googleAuthUrl + googleUser.googletoken)
                        .then(function (res) {
                        var token = res.token;
                        // @ts-ignore
                        window.store.currentUser = res;
                        onTokenAcquired(token, onUserLogin);
                    })
                        .catch(function (error) { throw Error(error); })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                _a.sent();
                // logError(error); TODO
                // checkMixpanel(() => mixpanel.track('Login Error', { 'Login Type': 'Google', 'Error': error })); TODO
                return [2 /*return*/];
            case 4: return [3 /*break*/, 6];
            case 5:
                setBackendToken('');
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
var onGoogleUserChanged = function (gUser, onUserLogin) {
    onUserChanged(gUser.isSignedIn() ? highLevelUser(gUser) : null, onUserLogin);
};
var initGapiClient = function (callbackFn, onUserLogin) {
    // @ts-ignore
    var clientId = process.env.GOOGLE_CLIENT_ID;
    gapi.auth2.init({ client_id: clientId, prompt: 'select_account' }).then(function () {
        authStatus = 'LOADED';
        var currentUser = getAuth().currentUser;
        currentUser.listen(onGoogleUserChanged);
        callbackFn ? callbackFn(clientId) : onGoogleUserChanged(currentUser.get(), onUserLogin);
    }, onAuthError);
};
var onAuthError = function (error) {
    authError = error;
    // logError(error, authError); // TODO
};
var initGapi = function (callbackFn, onUserLogin) {
    if (callbackFn === void 0) { callbackFn = null; }
    if (!window.location.protocol.startsWith('http')) {
        onAuthError('To use Google Auth you must access this page using http(s), not ' + window.location.protocol);
        return;
    }
    if (typeof gapi === 'undefined') {
        onAuthError('Unable to load the Google API');
        return;
    }
    authStatus = 'LOADING';
    gapi.load('auth2', {
        callback: function () { return initGapiClient(callbackFn, onUserLogin); },
        onerror: onAuthError,
        ontimeout: onAuthError,
        timeout: 5000
    });
};
var authAlert = function (error) {
    alert('Google authentication is not working at this moment.\n\nPlease try again later or use a magic sign-in link.\n\nError: ' + JSON.stringify(error));
    location.reload();
};
var onSignInError = function (error) {
    disableSignInLayout();
    // logError(error); TODO
    if (error && error.error === 'popup_closed_by_user') {
        onUserChanged(null, function () { });
        return;
    }
    authAlert(error);
};
var getAuth = function () {
    if (typeof gapi === 'undefined') {
        // logError('gapi is undefined'); TODO
        return null;
    }
    return gapi.auth2 && gapi.auth2.getAuthInstance();
};
var googleSignIn = function () { return getAuth().signIn().catch(onSignInError); };
var authSignIn = function (onUserLogin) {
    if (authError) {
        authAlert(authError);
        return;
    }
    if (authStatus === 'LOADING') {
        setTimeout(authSignIn, 400);
    }
    else {
        try {
            googleSignIn();
        }
        catch (err) {
            try {
                initGapi(function () { return googleSignIn(); }, onUserLogin);
            }
            catch (error) {
                onSignInError(error);
            }
        }
    }
};

var setBackendToken = function (token) {
    // @ts-ignore
    window.store.backendToken = token;
    if (token) {
        localStorage.setItem('token', token);
    }
};
var onTokenAcquired = function (token, onUserLogin) {
    setBackendToken(token);
    // setSuperToken();
    onUserLogin();
};
var onMicrosoftSignIn = function (onUserLogin) { return __awaiter(void 0, void 0, void 0, function () {
    var msalConfig, msalInstance, loginRequest, loginResponse, accessToken, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msalConfig = { auth: { clientId: process.env.MICROSOFT_CLIENT_ID } };
                msalInstance = new msal__namespace.PublicClientApplication(msalConfig);
                loginRequest = { scopes: ['user.read'] };
                enableSignInLayout();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, msalInstance.loginPopup(loginRequest)];
            case 2:
                loginResponse = _a.sent();
                accessToken = loginResponse.accessToken;
                return [4 /*yield*/, backendGetPromise(microsoftAuthUrl + accessToken)
                        .then(function (res) {
                        var token = res.token;
                        // @ts-ignore
                        window.store.currentUser = res;
                        onTokenAcquired(token, onUserLogin);
                    })
                        .catch(console.error)
                        .finally(function () { return disableSignInLayout(); })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                reportError(err_1);
                disableSignInLayout();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var onCookieError = function () {
    disableSignInLayout();
    // warning('cookie-error'); TODO
    return;
};
// TODO: import gapi library
var onGoogleSignIn = function (onUserLogin) {
    validateThirdPartyCookies(function () {
        enableSignInLayout();
        authSignIn(onUserLogin);
    }, onCookieError);
};
var handleMagicLinkRequest = function (token, email) {
    if (email === void 0) { email = ''; }
    if (!email) {
        var mailMagic = document.querySelector('#mail-magic');
        email = mailMagic.value;
    }
    var sandbox = window.location.hostname === 'localhost';
    var payload = { email: email, token: token, sandbox: sandbox };
    requestMagicLink(payload, function (_res) {
        // displayPage(Page.MAGIC_LOGIN);
        var magicLinkEmail = document.querySelector('#magic-link-email');
        if (!magicLinkEmail) {
            // logError('#magic-link-email não foi encontrado', 'generic-help-msg');
            return;
        }
        magicLinkEmail.textContent = email;
    });
};

var onKeyDown = function (ev, el, persitent, onClose) {
    if (ev.key === 'Escape') {
        if (persitent) {
            return;
        }
        close(el, onClose);
    }
    else if (ev.key === 'Enter') {
        if (ev.target.id === 'members-textarea') {
            return;
        }
        el.dispatchEvent(new CustomEvent('ok'));
    }
};
var close = function (el, onClose) {
    el.remove();
    if (onClose) {
        onClose();
    }
};
var attachEventHandlers = function (el, persitent, onClose) {
    var cancelButton = el.querySelector('.cancel');
    cancelButton === null || cancelButton === void 0 ? void 0 : cancelButton.addEventListener('click', function (_e) {
        el.dispatchEvent(new CustomEvent('cancel'));
        if (el.hasAttribute('dont-remove')) {
            return;
        }
        close(el, onClose);
    });
    var closeButton = el.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function (_e) {
            close(el, onClose);
        });
    }
    var okButton = el.querySelector('.ok');
    okButton === null || okButton === void 0 ? void 0 : okButton.addEventListener('click', function (_e) {
        el.dispatchEvent(new CustomEvent('ok'));
    });
    el.removeEventListener('keydown', function (ev) { return onKeyDown(ev, el, persitent, function () { return onClose; }); });
    el.addEventListener('keydown', function (ev) { return onKeyDown(ev, el, persitent, function () { return onClose; }); });
    el === null || el === void 0 ? void 0 : el.addEventListener('click', function (e) {
        if (e.target === el) {
            if (persitent) {
                return;
            }
            close(el, onClose);
        }
    });
};
// TODO: Mudar construtor para usar essa interface
// interface JuxModalOptions {
//   title?: string,
//   btns?: string[],
//   content?: string,
//   isPersistent?: boolean,
//   isBusy?: boolean,
//   body?: HTMLElement,
//   okTxt?: string,
//   cancelTxt?: string,
//   onClose?: any,
//   titleStyle?: string,
// }
var juxModal = function (title, btns, content, persistent, _busy, body, okTxt, cancelTxt, onClose, titleStyle) {
    if (btns === void 0) { btns = ['ok', 'cancel']; }
    if (content === void 0) { content = ''; }
    if (persistent === void 0) { persistent = false; }
    if (okTxt === void 0) { okTxt = getTranslation('alert-ok-btn-txt'); }
    if (cancelTxt === void 0) { cancelTxt = getTranslation('alert-cancel-btn-txt'); }
    var result = document.createElement('jux-modal');
    var wrapper = document.createElement('modal-wrapper');
    // START close
    var closeBtn = document.createElement('button');
    if (!persistent) {
        closeBtn.className = 'close';
        closeBtn.setAttribute('aria-label', getTranslation('close'));
    }
    // END close
    // START header
    var header = document.createElement('modal-header');
    if (title) {
        if (titleStyle) {
            header.classList.add(titleStyle);
        }
        var h3 = document.createElement('h3');
        h3.textContent = title;
        header.appendChild(h3);
    }
    // END header
    // START content
    var modalContent = document.createElement('jux-modal-content');
    if (content) {
        modalContent.innerHTML = content;
    }
    else if (body) {
        modalContent.appendChild(body);
    }
    // END content
    // START footer
    var footer = document.createElement('modal-footer');
    if (btns.includes('cancel')) {
        var cancelBtn = document.createElement('button');
        cancelBtn.classList.add('secondary-button', 'modal-button', 'action', 'cancel-btn', 'cancel');
        var cancelText = document.createElement('button-text');
        cancelText.textContent = cancelTxt;
        var cancelSpinner = document.createElement('loading-spinner');
        cancelBtn.append(cancelText, cancelSpinner);
        footer.appendChild(cancelBtn);
    }
    if (btns.includes('ok')) {
        var okBtn = document.createElement('button');
        okBtn.classList.add('primary-button', 'modal-button', 'action', 'ok');
        var okText = document.createElement('button-text');
        okText.textContent = okTxt;
        var okSpinner = document.createElement('loading-spinner');
        okBtn.append(okText, okSpinner);
        footer.appendChild(okBtn);
    }
    // END footer
    if (footer.hasChildNodes()) {
        wrapper.append(closeBtn, header, modalContent, footer);
    }
    else {
        wrapper.append(closeBtn, header, modalContent);
    }
    result.appendChild(wrapper);
    if (!persistent) {
        result.querySelector('.close').focus();
    }
    else {
        if (btns.includes('ok')) {
            result.querySelector('.ok').focus();
        }
    }
    attachEventHandlers(result, persistent, onClose);
    return result;
};

var googleCaptcha = function () {
    var result = document.createElement('google-captcha');
    // @ts-ignore
    window.submitCaptcha = function (token) { return result.setAttribute('token', token); };
    result.className = 'g-recaptcha';
    // @ts-ignore
    result.setAttribute('data-sitekey', process.env.GOOGLE_CAPTCHA_KEY);
    result.setAttribute('data-callback', 'submitCaptcha');
    grecaptcha.render(result);
    return result;
};

var socialLoginModal = function (userEmail, mailExchanger, token, onUserLogin) {
    var _a;
    var result = document.createElement('social-login-modal');
    var email = document.createElement('p');
    email.textContent = "\"".concat(userEmail, "\"");
    var msg = document.createElement('social-login-msg');
    msg.textContent = getTranslation('social-login-recommendation') + mailExchanger + '.' + getTranslation('social-login-advantage');
    var body = document.createElement('social-login-body');
    var socialLoginBtn = mailExchanger === 'Microsoft' ?
        loginButton('Microsoft', function () { return onMicrosoftSignIn(onUserLogin); }) :
        loginButton('Google', function () { return onGoogleSignIn(onUserLogin); });
    var proceedMagicLinkRequest = document.createElement('a');
    proceedMagicLinkRequest.textContent = getTranslation('proceed-magic-link-request');
    proceedMagicLinkRequest.addEventListener('click', function () {
        handleMagicLinkRequest(token, userEmail);
        result.remove();
    });
    body.append(email, msg, socialLoginBtn, proceedMagicLinkRequest);
    var modal = juxModal(getTranslation("using-".concat(mailExchanger.toLowerCase(), "-email")), [], '', false, false, body, '', '', function () { return result.remove(); });
    modal.setAttribute('data-cy', 'social-login-modal');
    result.appendChild(modal);
    (_a = modal.querySelector('modal-wrapper')) === null || _a === void 0 ? void 0 : _a.setAttribute('style', 'max-width: 360px; width: 100%;');
    return result;
};

var isValidEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

var recommendSocialLogin = function (userEmail, mailExchanger, token, onUserLogin) {
    var _a;
    (_a = document.querySelector('magic-link-modal')) === null || _a === void 0 ? void 0 : _a.remove();
    document.body.appendChild(socialLoginModal(userEmail, mailExchanger, token, onUserLogin));
};
var hasProvider = function (data, provider) {
    return data.some(function (entry) { return entry.includes(provider); });
};
var getMailExchanger = function (domainName) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getMXData(domainName)];
            case 1:
                data = _a.sent();
                if (!data) {
                    return [2 /*return*/, null];
                }
                if (hasProvider(data, 'outlook.com')) {
                    return [2 /*return*/, 'Microsoft'];
                }
                if (hasProvider(data, 'google.com')) {
                    return [2 /*return*/, 'Google'];
                }
                return [2 /*return*/, null];
        }
    });
}); };
var onMagicLinkRequest$1 = function (token, input, onUserLogin) { return __awaiter(void 0, void 0, void 0, function () {
    var email, domain, mailExchanger, supportedMailExchanger;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = input.value;
                if (!email.includes('-test@') && !token) {
                    // logError('invalid-captcha-response');
                    return [2 /*return*/];
                }
                if (!isValidEmail(email)) return [3 /*break*/, 2];
                domain = email.split('@')[1] || '';
                return [4 /*yield*/, getMailExchanger(domain)];
            case 1:
                mailExchanger = _a.sent();
                supportedMailExchanger = mailExchanger !== null;
                if (supportedMailExchanger) {
                    recommendSocialLogin(email, mailExchanger, token, onUserLogin);
                    return [2 /*return*/];
                }
                _a.label = 2;
            case 2:
                handleMagicLinkRequest(token);
                return [2 /*return*/];
        }
    });
}); };
var magicEmailField = function (onUserLogin) {
    var result = document.createElement('magic-email-field');
    var captcha = googleCaptcha();
    var input = document.createElement('input');
    input.id = 'mail-magic';
    input.type = 'text';
    input.setAttribute('class', 'textfield');
    input.placeholder = 'e-mail';
    input.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') {
            onMagicLinkRequest$1(captcha.getAttribute('token'), input, onUserLogin);
        }
    });
    var btn = document.createElement('button');
    btn.id = 'send-magic';
    btn.setAttribute('class', 'primary-button');
    btn.addEventListener('click', function (_ev) { return onMagicLinkRequest$1(captcha.getAttribute('token'), input, onUserLogin); });
    btn.textContent = getTranslation('send-magic');
    result.append(input, captcha, btn);
    return result;
};

var magicLinkModal = function (onUserLogin) {
    var _a;
    var result = document.createElement('magic-link-modal');
    var subtitle = document.createElement('magic-link-request-subtitle');
    subtitle.textContent = getTranslation('magic-link-request-subtitle');
    var body = document.createElement('magic-link-request-body');
    body.append(subtitle, magicEmailField(onUserLogin));
    var modal = juxModal(getTranslation('magic-link-request-title'), [], '', false, false, body, '', '', function () { return result.remove(); });
    modal.setAttribute('data-cy', 'magic-link-modal');
    result.appendChild(modal);
    (_a = modal.querySelector('modal-wrapper')) === null || _a === void 0 ? void 0 : _a.setAttribute('style', 'max-width: 360px; width: 100%;');
    return result;
};

var applyContainerStyles = function (container) {
    container.style.backgroundColor = '#ffffffdd';
    container.style.borderRadius = '16px';
    container.style.inset = '50% 50% 50% 0';
    container.style.position = 'relative';
    container.style.transform = 'translateY(-50%)';
    container.style.width = '620px';
    container.style.alignItems = 'center';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.fontSize = '16px';
    container.style.height = '100%';
    container.style.justifyContent = 'center';
    container.style.margin = '0 auto';
    container.style.paddingTop = '0';
};
var applyPageStyles = function (page) {
    page.style.backgroundPosition = '50%';
    page.style.backgroundSize = 'cover';
    page.style.display = 'block';
    page.style.height = '100%';
};
var onMagicLinkRequest = function (page, onUserLogin) {
    page.appendChild(magicLinkModal(onUserLogin));
};
var loginPage = function (backgroundImg, onUserLogin, text) {
    if (text === void 0) { text = getTranslation('sign-in-msg-general'); }
    var result = document.createElement('login-page');
    applyPageStyles(result);
    var section = document.createElement('section');
    applyContainerStyles(section);
    var salutation = document.createElement('sign-in-salutation');
    salutation.textContent = getTranslation('sign-in-salutation');
    var explanation = document.createElement('sign-in-explanation');
    explanation.textContent = getTranslation('sign-in-explanation');
    var msg = document.createElement('sign-in-msg');
    msg.textContent = text;
    var google = loginButton('Google', function () { return onGoogleSignIn(onUserLogin); });
    var microsoft = loginButton('Microsoft', function () { return onMicrosoftSignIn(onUserLogin); });
    var linkedin = loginButton('LinkedIn', function () { return console.log('login with Linkedin'); });
    var email = loginButton('Email', function () { return onMagicLinkRequest(result, onUserLogin); });
    result.style.backgroundImage = "url(".concat(backgroundImg, ")");
    section.append(salutation, explanation, msg, google, microsoft, linkedin, email);
    result.appendChild(section);
    return result;
};

exports.chosenLanguage = chosenLanguage;
exports.getTranslation = getTranslation;
exports.initLanguage = initLanguage;
exports.loginButton = loginButton;
exports.loginPage = loginPage;
exports.onMicrosoftSignIn = onMicrosoftSignIn;
exports.reloadWithLanguageOverride = reloadWithLanguageOverride;
