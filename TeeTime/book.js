var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var div = document.createElement('div');
        div.innerHTML = this.responseText;
		document.body.appendChild(div);
		document.querySelector("#bot-content a").onclick = botClick;
    }
};
xhttp.open("GET", chrome.extension.getURL("./extension.html"), true);
xhttp.send();

function injectScript() {
	var injection = document.createElement('script');
	injection.setAttribute('type', 'text/javascript');
	injection.setAttribute('src', chrome.extension.getURL('./inject.js'));
	document.body.appendChild(injection);
}

var automate = false;

function botClick(e) {
	if(!automate) {
		automate = true;

		injectScript()
		insertCheckboxes();
		
		e.target.innerHTML = "Continue...";
	}
	else {
		click();
	}
}

function click() {
	var s = document.createElement("script");
	s.innerHTML = "var item = document.querySelector('#time_slots a'); item.onclick();";
	document.body.appendChild(s);
}

function insertCheckboxes() {
	var items = document.querySelectorAll('#time_slots li');

	for(var i=0;i<items.length;i++) {
		var checkbox = document.createElement('input');
		checkbox.type = 'checkbox'
		items[i].appendChild(checkbox);
	}
}

window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type) {
		switch(event.data.type) {
			case "getAvailableSlotsByTime":
				var resp = event.data.resp;
				console.log(resp);
				if(resp.error == 0) {
					// check for status
					// if status is 0
					//  	if not already blocked
					// 			request book now button
				}
				else {
					click();
				}

				break;
		}
    }
});