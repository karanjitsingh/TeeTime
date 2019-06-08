var modBookingSessionStart = (timeslot) => {
    // ajax call start

    url = "http://booking.chandigarhgolfclub.in/index.php?m=account&v=Booking&action=CheckAndFreezeSlot&SlotID=" + timeslot + "&n=" + Math.random();
    //alert(url);
    if (typeof (booking_ajax) != 'undefined' && booking_ajax == "busy") {
        //$("#DivAlertMessage").html("<span>wait...</span>").show();
        //console.log("busy URL" + url);
        return false;

    }

    log(timeslot + ": Sending request");

    var jqxhr = $.ajax({
        dataType: "json",
        async: false,
        url: url,
        beforeSend: (xhr) => {
            booking_ajax = "busy";
            //$("#DivAlertMessage").hide();
            //console.log("booking_ajax = " + booking_ajax); 
            //console.log("beforeSend URL" + url); 

        }
    }).done((result) => {
        booking_ajax = "free";
        
        if(!result || !result.status) {
            log(timeslot + ": Invalid response, retrying");
            setTimeout(() => {
               tryBookSlot(timeslot); 
            }, 200);
            return;
        }

        log(timeslot + ": Success");

        if (result.status == true) {
            bookRequestSuccess(timeslot);
        }
    }).fail(() => {
        booking_ajax = "free";
        log(timeslot + ": Error with request");
        alert("An error occured please try again later");
    });
    // ajax call end
}