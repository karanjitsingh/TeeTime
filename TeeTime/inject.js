getAvailableSlotsByTime = function(date, time, slotID){
	
	$(".banner_right_cgc").show();
	
    $('#CountDownTimer').hide();
    $('#timer_msg').hide();
    $('#booking-area').html("");
    $('#slot_ID').val(slotID);
    $.ajax({
        url: "/../controller/golfcourse.php?action=getAvailableSlotsByTime",
        type: 'POST',
        data: {slot_date : date, time : time, slot_ID : slotID},
        dataType: "json",
        async :false,
        beforeSend: function(msg){
            block_screen();
        },
        success: function (resp) {

            window.postMessage({
                type:"getAvailableSlotsByTime",
                resp:resp
            },"*");

            if(resp.error == 0){
                
                //$(".banner_right_cgc").hide();
  
//                $('#upcomingSlotPrice').html(resp.slots.daysToShowHtml);
                var html ='<div class="row margin-btm">'+
                                    '<div class="col-md-4 col-xs-12">'+
                                        '<input type="Button" id="startBtn" name="startBtn" style="width:201px;" onclick=startBookingSession('+resp.slots.slotID+',\"'+date+'\",\"'+time+'\") class="form-control btn btn-primary" value="Start booking session">'+
                                    '</div>'+
                            '</div>'+
                            '<div id="start_msg" style="">'+
                                '<p style="text-align: left;">'+
                                '<br>'+
                                'In order to book this slot, please press the button above. '+
                                '<br>'+
                                'This will lock this slot for your booking to complete for the next 2 minutes.'+
                                '</p>'+
                            '</div>';
                var shovler ='<div class="col-md-12 margin-btm future_rates">'+
                               '<div id="slick_ele">'+
                                    resp.slots.daysToShowHtml+
                                '</div>'+
                            '</div>';
                if(guestBookingallowed == 1){
                    $('#datetimepicker1').hide();
                    $('.future_rates').remove();
                    $('#cal_or_shovler').append(shovler);
                    $('#cal_or_shovler').removeClass("col-md-3");
                    $('#cal_or_shovler').addClass("col-md-5");
                }
                $('#booking-area').append(html);
                bookingCount = 0;
                bookedCount = 0;
                for (var i = 1; i <=4; i++) {
                    var slotID = resp.slots.slotID;
                    var name = resp.slots.member[i];
                    
                    if(name == ""){
                        if(bookedCount < 3){
                            bookingCount++;
                            var bookingHtml = getBookingHtml(i, slotID, date, time, bookingCount);
                            $('#booking-area').append(bookingHtml);
                            setAutocomplForInp(i);
                        }
                    }else{
                        bookedCount++;
                        var bookedHtml = getBookedHtml(name, i);
                        $('#booking-area').append(bookedHtml);
                    }
                    $('.4slots').hide();
                }
                var bookButtonHtml = '';
                if(bookingCount > 0){
                    bookButtonHtml = '<div class="col-xs-2" style="">'+
                                        '<div class="input-group">'+
                                            '<input type="button" id="book_btn" class="btn btn-primary col-md-4" value="Book" onclick=saveBulkMemberBooking('+i+','+slotID+',\"'+date+'\",\"'+time+'\");>'+
                                    '</div>'+
                                '</div>';
                }
                html = '<div class="row margin-btm 4slots">'+
                           bookButtonHtml +
                            '<div class="col-xs-2" style="">'+
                                    '<div class="input-group">'+
                                        '<input type="button" id="" class="btn btn-primary col-md-4" value="Back" onclick=goBack('+i+','+slotID+',\"'+date+'\",\"'+time+'\");>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                    
                $('#booking-area').append(html);
                
                if(bookingCount == 0){
                    $('#startBtn').val("View Details");
                    $('#start_msg p').html('<span class="error">This slot is already booked.</sapn>');
                }
                $('.4slots').hide();
                clearError();
                $('#slick_ele').slick({
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }) ;
            }else{
                $('#booking-area').append("<span class='error'>"+resp.error_msg+"</span>");
            }
            
            $('#card_no_1').prop('readonly', true);
            $('#email_1').prop('readonly', true);
            unblock_screen();
        }
    });
}
