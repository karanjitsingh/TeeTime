var injectionStatus = "inactive";
var activateButton = document.querySelector("#bot-content a");
var selectedTimeSlots = [];
var selectedTimes = [];
var dateSlot = new URLSearchParams(document.location.search).get("stdt");
var timeTerm = new URLSearchParams(document.location.search).get("timeterm");

function activateBot(e) {
	if(injectionStatus == "inactive") {
		injectionStatus = "active";

        document.querySelectorAll(".booking-check-list").forEach((elem) => {
            elem.className = "booking-check-list";
        });

		insertCheckboxes();
		
		activateButton.innerHTML = "Start Bot";
	}
	else if(injectionStatus == "active") {
        var checkedBox = document.querySelectorAll(".booking-check-list input:checked");

        if(!checkedBox.length)
            return;

        log("Starting bot, clicking stop bot will cause the page to refresh.")
        document.querySelector("#console-log").style.display = "block";
    

        activateButton.innerHTML = "Stop Bot"
        injectionStatus = "running";

        log("");
        log("Looking for following timeslots:")

        // Get slot ids
        for(var i=0; i<checkedBox.length; i++) {
            console.log(checkedBox[i]);
            
            var slotId = parseInt(checkedBox[i].parentElement.parentElement.getAttribute("rel"));
            var time = checkedBox[i].parentElement.querySelector(".date").innerText;

            selectedTimeSlots.push(slotId);
            selectedTimes.push(time);

            log("Time: " + time + "&nbsp&nbsp" + "Slot ID: " + slotId);
            tryBookSlot(slotId);
            
            // modGetAvailableSlotsByTime(timeslot);
        }
    }
    
    else if(injectionStatus == "running") {
        injectionStatus = "stopped";

        location.reload();
    }
}

function insertCheckboxes() {
    var items = document.querySelectorAll('.booking-check-list li');
    checkCount = 0;

	for(var i=0;i<items.length;i++) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        items[i].querySelector("label").appendChild(checkbox);
        $(items[i]).unbind();
	}
}

function log(msg) {
    document.querySelector("#console-log").innerHTML += msg + "<br />";
}

function tryBookSlot(timeslot) {
    if(!bookingComplete) {
        modBookingSessionStart(timeslot);
    }
}

var bookingComplete = false;

function bookRequestSuccess(timeslot) {
    if(!bookingComplete) {
        bookingComplete = true;
        log("");

        var i = selectedTimeSlots.indexOf(timeslot);

        log("Request success for time: " + selectedTimes[i] + " with slot ID: " + timeslot + ".");

        setTimeout(() => {showBookingForm(timeslot) }, 500);

        return true;
    }

    return false;
}

function showBookingForm(timeslot) {
    document.querySelector("#console-log").style.display = "none";

    var counterId = new Date();

    // update booking form with slot id, date and counterid

    
    var bookingDiv = document.querySelector('.mod-booking-div');

    bookingDiv.parentElement.removeChild(bookingDiv);
    
    bookingDiv.querySelector("form").setAttribute("action", "http://booking.chandigarhgolfclub.in/index.php?m=account&v=Booking&timeterm=" + timeTerm + "&stdt=" + dateSlot + "&action=FinalBooking");
    
    bookingDiv.querySelector("#SlotID").setAttribute("value", timeslot);
    bookingDiv.querySelector("#CounterID").setAttribute("value", counterId);

    bookingDiv.querySelectorAll("select").forEach((elem) => {
        $(elem).select2();
    })
    
    var bookingArea = document.querySelector(".booking-row").children[1];
    
    while(bookingArea.childElementCount) {
        bookingArea.removeChild(bookingArea.firstElementChild);
    }
    
    bookingArea.appendChild(bookingDiv);
    bookingDiv.style.display = "block";

    // continue website's code
    $(".BookingStep").hide();
    $("#DivAlertMessage").hide();
    $("#DivCreateBooking").show();
    BookingCounterStart();
}

