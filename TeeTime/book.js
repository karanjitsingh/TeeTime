var div = document.createElement("div");
div.style.height = "60px";
div.style.width = "200px";
div.style.position = "fixed";
div.style.bottom = "20px";
div.style.right = "20px";

document.body.appendChild(div);

var select1 = document.createElement("select");
var select2 = document.createElement("select");
select1.style.width = select2.style.width = "200px";
select2.style.marginTop = select2.style.marginBottom = "10px";

select2.innerHTML = "<option>Player3</option>";
select1.innerHTML = "<option>Player2</option>";

div.appendChild(select1);
div.appendChild(select2);

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4 && xhr.status == 200) {
		populateSelect(JSON.parse(xhr.responseText));
	}
};

xhr.open("GET", chrome.extension.getURL('./list.json'), true);
xhr.send();

select1.onchange = selectPlayer2;
select2.onchange = selectPlayer3;

function selectPlayer2() {
	if(select1.selectedIndex==0) {
		if(document.getElementById("Player2"))
			document.getElementById("Player2").value = "";
		return;
	}

	if(document.getElementById("Player2"))
		document.getElementById("Player2").value = select1.options[select1.selectedIndex].value;
	else {
		alert("No booking slot selected.");
		select1.selectedIndex = 0;
	}
}

function selectPlayer3() {
	if(select2.selectedIndex==0) {
		if(document.getElementById("Player3"))
			document.getElementById("Player3").value = "";
		return;
	}

	if(document.getElementById("Player3"))
		document.getElementById("Player3").value = select2.options[select2.selectedIndex].value;
	else {
		alert("No booking slot selected.");
		select2.selectedIndex = 0;
	}
}

function populateSelect(list) {
	for(var i=0;i<list.length;i++) {
		select1.innerHTML += "<option value=\"" +  list[i].key + "\">" + list[i].name + " - " + list[i].id + "</option>";
		select2.innerHTML += "<option value=\"" +  list[i].key + "\">" + list[i].name + " - " + list[i].id + "</option>";
	}
}

function resetFields() {
	select1.selectedIndex = 0;
	select2.selectedIndex = 0;
}