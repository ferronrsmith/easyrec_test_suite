//easy-rec REST-API url
var easyrecApiUrl = null;
var apiKey = null;
var tenantId = null;

var EASYREC_API_URL = {
	devApiUrl : "http://209.59.190.33:8081/easyrec-web/api/1.0/json/",
	baseApiUrl : "http://localhost:8080/easyrec-web/api/1.0/json/",
	localURL : "http://localhost:8080/easyrec-web-test-0.96/api/1.0/json/"
}

// api key for easy-rec
var KEY_LIBRARY = {
	dev : "6491d97a8a0c3f7d07b1df5d83a83521",
	local : "13f5b430e4839c0de230c6f8923fad76"
}

// Tenant ID for easy-rec
var EASYREC_TENANT_MODE = {
	prod : "OPTIN",
	dev  : "EASYREC_DEMO"
}

//debug mode - used when in development
var debugMode = true;
var verboseMode = true;
var jbossOn = false;


// the following sets the easyrec url based on the debug mode and if the user is using jboss/tomcat
if(debugMode) {
	easyrecApiUrl = EASYREC_API_URL.devApiUrl;
}
else if(jbossOn) {
	easyrecApiUrl = EASYREC_API_URL.localURL;
	apiKey = KEY_LIBRARY.local;
	tenantId = EASYREC_TENANT_MODE.dev;
}
else {
	easyrecApiUrl = EASYREC_API_URL.baseApiUrl;
}

// following function toggles verbose mode
function verbose(){
    if(!verboseMode)
        if(console.log) 
        	console.log = null;
        window.alert = null
}

//callback function
function myCustomDrawingCallback(json) {
	if(console.log)
		console.log(json);

	//render result to the output div
	drawRecommendationListToDiv(json,'output');

	// change offline style to online
	$('#status').removeClass('offline').addClass('online');	
 }

//check if a url is valid
function isUrl(s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(s);
}

// the following functionr returns a properly formatted url with the json api inclusion
function formatUrl(url) {
	if(url.indexOf('api/1.0/json/') > 0)
		return url;
	else {
		// check last character
		if(url.last() === '/') {
			return merge(url,'api/1.0/json/');
		}
		else {
			return merge(url,'/api/1.0/json/');
		}
	}
}

//poor mans stringbuilder - merge multiple strings together
function merge() {
	var output = [], len = arguments.length, i;
	for(i = 0; i < len; i++){
		if(typeof arguments[i] === 'string')
			output.push(arguments[i]);
	}
	return output.join('');
}

// the following func returnt the last character in a string
String.prototype.last = function() {
	if(this.length === 0) {
		return '';
	} else {
		return this[this.length-1];	
	}
}

// pull from recommendation engine
function pullSampleItemsFromEngine() {

	 // checking easy rec's ability to retrieve items users also viewed
	easyrec_otherUsersAlsoViewed({itemId:"42", drawingCallback:'myCustomDrawingCallback'});

	// checking easy rec's ability to retrieve related items
	easyrec_relatedItems({itemId:"43", drawingCallback:'myCustomDrawingCallback'});

	// checking easy rec's ability to retrieve the most viewed items
	easyrec_mostViewedItems({numberOfResults:10,
	                           timeRange:"DAY",
	                           drawingCallback:"myCustomDrawingCallback"});
}
