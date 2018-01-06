var injectionStatus = "inactive";
var activateButton = document.querySelector("#bot-content a");
var selectedTimeSlots = new Object();
var selectedTimeSlotsLength = 0;
// var timeslot_re = /.*,([0-9]+)\)\;/;
var timeslot_re = /"(.*)".*"(.*)".*,([0-9]*)\)/

document.querySelector("#time_slots").addEventListener('DOMSubtreeModified', resetActivateButton);

function resetActivateButton(){
    if(!document.querySelector("#time_slots li input")) {
        injectionActive = false;
        activateButton.innerHTML = "Activate Hack";
        selectedTimeSlots = new Object();
        selectedTimeSlotsLength = 0;
        injectionStatus = "inactive"
    }
}

function activateBot(e) {
	if(injectionStatus == "inactive") {
		injectionStatus = "active";

		insertCheckboxes();
		
		activateButton.innerHTML = "Start Bot";
	}
	else {

        injectionStatus = "running";

        var checkedBoxed = document.querySelectorAll("#time_slots input:checked");

        if(!checkedBoxed.length)
            return;

        for(var i=0; i<checkedBoxed.length; i++) {
            console.log(checkedBoxed[i]);
            var link = checkedBoxed[i].parentElement.querySelector("a");

            var match = String(link.onclick).match(timeslot_re);

            var timeslot = {
                slotID: parseInt(match[3]),
                booking_date: match[1],
                booking_time: match[2]
            }

            selectedTimeSlots[timeslot.slotID] = timeslot;
            selectedTimeSlotsLength++;
            

            modGetAvailableSlotsByTime(timeslot);
        }

	}
}

function insertCheckboxes() {
    var items = document.querySelectorAll('#time_slots li');
    var links = document.querySelectorAll('#time_slots a');
    checkCount = 0;

	for(var i=0;i<items.length;i++) {
		var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
		items[i].appendChild(checkbox);
	}
}

function ajaxResponse(requestFunction, response, slotID) {
    
    console.log(response);

    switch(requestFunction) {
        case "getAvailableSlotsByTime":
            if(response.error == 0 && injectionStatus == "running") {
                if(response.slots.Status != 0) {
                    delete selectedTimeSlots[response.slots.slotID];
                    selectedTimeSlotsLength--;
                }
                else {
                    injectionStatus = "booking"
                    modStartBookingSession(response);
                }
            }
            else {
                setTimeout(function() {modGetAvailableSlotsByTime(selectedTimeSlots[slotID])}, 10);
            }

            break;
    }
}