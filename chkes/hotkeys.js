var mandat = chrome.runtime.getManifest()

// keycode: link
var hotkeys =
    {'a': "https://support.icertified.net/staff/index.php?/Tickets/Manage/Filter/31/4/-1",
     's': "https://support.icertified.net/staff/index.php?/Tickets/Manage/Filter/28/4/-1",
     'd': "https://support.icertified.net/staff/index.php?/Tickets/Manage/Filter/4/4/-1"
    }

// create the menu element
$(document).bind("DOMSubtreeModified", function() {
    if (!document.getElementById("hotkeymenu")) {
        $("body").append("<div id='hotkeymenu'>");
        $("#hotkeymenu").load(chrome.runtime.getURL("hotkeymenu.html"));
    }
});

// handle menu hot keys
$(document).keypress(function(e){
    if (e.which == 'g'.charCodeAt(0) && !($(':focus').is('input') || $(':focus').is('textarea')) ) {
        $("#hotkeymenu").toggle();
    } else if ($("#hotkeymenu").css('display') != 'none' && hotkeys[String.fromCharCode(e.which)] != undefined) {
        var link = hotkeys[String.fromCharCode(e.which)];
        if (window.location != link){
            $("#hotkeymenu").toggle();
            // if theres a link to it on the page, click it
            // this way, ajax handles the transition.
            if ($(`a[href='${link}'`).length) {
                $(`a[href='${link}'`)[0].click();
            // if not, we have to just change location.
            } else {
                window.location = link;
            }
        }
    }
});