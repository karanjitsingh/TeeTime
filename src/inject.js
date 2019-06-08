function injectScript(src) {
	var injection = document.createElement('script');
	injection.setAttribute('type', 'text/javascript');
	injection.setAttribute('src', chrome.extension.getURL(src));
	document.body.appendChild(injection);
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var div = document.createElement('div');
        div.innerHTML = this.responseText;
		document.body.appendChild(div);
		loadBookingHTML();
    }
};
xhttp.open("GET", chrome.extension.getURL("./src/extension.html"), true);
xhttp.send();

var loadingComplete = false;

function loadBookingHTML() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(!loadingComplete) {
			console.log(this.status, this.readyState)
			if (this.readyState == 4 && this.status == 200) {
				loadingComplete = true;
				
				var domparser = new DOMParser();
				bookingDiv = domparser.parseFromString(this.responseText, "text/html").body.children[0];

					
				var button = document.querySelector("#bot-content a");
				var buttonContainer = document.querySelector("#bot-content");

				bookingDiv.style.display = "none";
				bookingDiv.className += " mod-booking-div";
		
				button.setAttribute('onclick','activateBot(event)');
				button.innerHTML = "Activate Bot";
				buttonContainer.className = "enabled";

				document.body.appendChild(bookingDiv);
				
				injectScript("./src/teetime.js");
				injectScript("./src/modscript.js");
			}
	
		}
	};
	xhttp.open("GET", chrome.extension.getURL("./src/booking.html"), true);
	xhttp.send();
}
