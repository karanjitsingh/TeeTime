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


var automate = false;

function botClick(e) {
	if(!automate) {
		automate = true;
		InsertCheckboxes();
		e.target.innerHTML = "Continue...";
	}
	else {

	}
}

function InsertCheckboxes() {
	var items = document.querySelectorAll('#time_slots li');

	for(var i=0;i<items.length;i++) {
		var checkbox = document.createElement('input');
		checkbox.type = 'checkbox'
		items[i].appendChild(checkbox);
	}
}