function injectScript(src) {
	var injection = document.createElement('script');
	injection.setAttribute('type', 'text/javascript');
	injection.setAttribute('src', chrome.extension.getURL(src));
	document.body.appendChild(injection);
}

injectScript("./src/teetime.js");
injectScript("./src/modscript.js");

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var div = document.createElement('div');
        div.innerHTML = this.responseText;
		document.body.appendChild(div);
		document.querySelector("#bot-content a").setAttribute('onclick','activateBot(event)');
    }
};
xhttp.open("GET", chrome.extension.getURL("./extension.html"), true);
xhttp.send();