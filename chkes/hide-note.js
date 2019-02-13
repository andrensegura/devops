//Kayako loads stuff dynamically. Swift/ajax, whatever. This means that if you aren't
//going to the page directly and are clicking on the link from within Kayako, then
//the DOM isn't completely reloaded, just the content. So, we need to check for any modification,
//not just a new page reload.
$(document).bind("DOMSubtreeModified", function() {
    if ( !$(".hideButton").length ) {
        hidepngURL = chrome.runtime.getURL("images/hide.png")
        $("#ticketnotescontainerdiv").before(
            `<a class='hideButton'>\
                <div class='hsnotebutton'>\
                <img src='${hidepngURL}'>Hide/Show Notes</div>\
            </a>`
            );

        $(".hideButton").click(function() {
            $(".bubble").each(function(index) {
                $(this).toggle();
            });
        });
    }
});