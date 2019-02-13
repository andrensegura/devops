var done = 0;

$(document).bind("DOMSubtreeModified", function() {
    if (done == 0 && $(".ticketpostbottomcontents").length && !$(".tooltip").length ){
        // set the tooltip class over the email address
        $(".ticketpostbottomcontents").filter(function(){
            var html = $(this).html();
            var emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/;
            var matched_str = $(this).html().match(emailPattern);
            // matched email addresses will be used to find client data
            if (matched_str && !$(this).html().includes("@certifiedhosting.com")) {
                $(this).html("<span class='tooltip'>"+ matched_str + "<div class='tooltiptext'><div class='ttinfo'>Searching...</div><div class='ttclose'>Close</div></div>");

                var ticketpostbar = $(this).parent().parent().parent().find('.ticketpostbar');
                if ( ticketpostbar.find('.tooltiptext').length == 0){
                    $(this).parent().parent().parent().find('.ticketpostbar').append("<div class='tooltiptext'><div class='ttinfo'>Searching...</div></div>");
                    // secure internal api only available to the LAN
                    var infoURL = "https://api.staff.icertified.net/v1/acc/shared?query="+matched_str;
                    var client = new HttpClient();
                    client.get(infoURL, function(response) {
                        if (response.length) {
                            var jsoninfo = JSON.parse(response);
                            var infostr = '';
                            var i = 0;
                            for (i; i < jsoninfo['numaccounts']; i++){
                                ci = jsoninfo['accounts'][i];
                                infostr += `<div><b>user</b>: ${ci['user']}<br><b>domain</b>: <a href='http://${ci['domain']}' target='_blank'>${ci['domain']}</a><br><b>server</b>: <a href='https://${ci['server']}:2087' target='_blank'>${ci['server']}</a><br><b>plan</b>: ${ci['plan']}<br><b>ip</b>: ${ci['ip']}<br><b>email</b>: ${ci['email']}<br><b>suspendedreason</b>: ${ci['suspendedreason']}<br><b>billingstatus</b>: ${ci['billingstatus']}<br><b>billingnotes</b>: ${ci['billingnotes']}<br></div>`;
                            }
                            $('.tooltiptext .ttinfo').html(infostr);
                        }
                    });
                }
                return $(this);
            }
        })

        done = 1;
    } else if (!$(".ticketpostbottomcontents").length ){
        done = 0;
    }
});

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

