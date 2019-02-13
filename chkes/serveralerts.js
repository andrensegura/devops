var tikopen   = "https://support.icertified.net/staff/index.php?/Tickets/Manage/Filter/28/4/-1";
var tikonhold = "https://support.icertified.net/staff/index.php?/Tickets/Manage/Filter/28/5/-1";


RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
    
RegExp.dblescape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\\\$&");
};

function addNodeToTicketBar(aNode) {
    document.querySelectorAll('div#gridtoolbar > div.gridtoolbarsub > ul')[0].appendChild(aNode);
}

function setupClickFunc(id, func) {
    document.getElementById (id).addEventListener (
        "click", func, false
    );
}

function newTicketBarButton(name, func, color) {
    var xNode       = document.createElement ('li');
    var zNode       = document.createElement ('a');
    var idstr = 'gw' + name ;
    zNode.id = idstr;
    zNode.innerHTML = name;
    xNode.appendChild(zNode);
    if(color) {
        zNode.style.backgroundImage = 'none';
        zNode.style.backgroundColor = color;
    }
    addNodeToTicketBar(xNode);
    setupClickFunc(idstr, func);
}

    function newTicketBarInput(name, color) {
    var xNode       = document.createElement ('li');
    var zNode       = document.createElement('input');
    var idstr = 'gw-input' + name ;
    zNode.id = idstr;
    zNode.type = "text";
    xNode.appendChild(zNode);
    if(color) {
        zNode.style.backgroundImage = 'none';
        zNode.style.backgroundColor = color;
    }
    addNodeToTicketBar(xNode);
}

function checkTicketsThatMatchString(searchstring, color) {
    var rows = document.querySelectorAll('tbody.gridcontents_ticketmanagegrid_parent tr');
    var i;
    for(i = 0; i < rows.length; ++i) {
        var cols = rows[i].getElementsByTagName("td");
        var title = cols[4].getElementsByTagName('a')[0].innerHTML;
        if (new RegExp('^.*' + searchstring + '.*$', "i").test(RegExp.escape(title))) {
                rows[i].querySelectorAll( 'input[type=checkbox]' )[0].checked=!rows[i].querySelectorAll( 'input[type=checkbox]' )[0].checked;
                if (color) rows[i].style.backgroundColor = color;
        }
    }
}

function runTicketSearch(box, color) {
    var searchstring = document.getElementById('gw-input' + box).value;
    if(searchstring)
        checkTicketsThatMatchString(searchstring, color);
}

function sort_unique(arr) {
    if (arr.length === 0) return arr;
    arr = arr.sort();
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
        if (arr[i-1] !== arr[i]) {
            ret.push(arr[i]);
        }
    }
    return ret;
}

function getSmartAlertHostnames() {
    var hostnames = [];
    var rows = document.querySelectorAll('tbody.gridcontents_ticketmanagegrid_parent tr');
    var i;
    for(i = 0; i < rows.length; ++i) {
        var cols = rows[i].getElementsByTagName("td");
        var title = cols[4].getElementsByTagName('a')[0].innerHTML;
        if (new RegExp('SMART', "g").test(RegExp.escape(title))) {
            // SMART error (OfflineUncorrectableSector) detected on host: e31230v2-1023.icertified.net
            var thehost = title.match(/^.*SMART.*detected.*host: ([a-zA-z0-9\-\.]+).*$/);
            if(thehost[1]) {
                console.log("found smart alert for hostname: " + thehost[1] + " ! \n");
                hostnames.push(thehost[1]);
            }
        }
    }
    var sortednames = sort_unique(hostnames);
    console.log("debug array output: " + sortednames.toString() );
    return sortednames;
}

function find_duplicates(arr) {
    var len=arr.length,
    out=[],
    counts={};

    for (var i=0;i<len;i++) {
        var item = arr[i];
        counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
        if (counts[item] === 2) {
            out.push(item);
        }
    }

    return out;
}

function getDuplicateSmartAlertHostnames() {
    var hostnames = [];
    var rows = document.querySelectorAll('tbody.gridcontents_ticketmanagegrid_parent tr');
    var i;
    for(i = 0; i < rows.length; ++i) {
        var cols = rows[i].getElementsByTagName("td");
        var title = cols[4].getElementsByTagName('a')[0].innerHTML;
        if (new RegExp('SMART', "g").test(RegExp.escape(title))) {
            // SMART error (OfflineUncorrectableSector) detected on host: e31230v2-1023.icertified.net
            var thehost = title.match(/^.*SMART.*detected.*host: ([a-zA-z0-9\-\.]+).*$/);
            if(thehost[1]) {
                console.log("found smart alert for hostname: " + thehost[1] + " ! \n");
                hostnames.push(thehost[1]);
            }
        }
    }
    var sortednames = hostnames.sort();
    var onlydups = find_duplicates(sortednames);
    console.log("debug array output: " + sortednames.toString() );
    console.log("debug array output: " + onlydups.toString() );
    return onlydups;
}

function mergeSmartAlerts(color) {
    var list = getSmartAlertHostnames();
    if(list){
        var dropobj = document.createElement("SELECT");
        var i;
        for(i = 0; i < list.length; i++) {
            var option = document.createElement("option");
            option.text = list[i];
            dropobj.add(option, i);
        }
        dropobj.id = "gw-inputsmarthostsmenu";
        addNodeToTicketBar(dropobj);
        newTicketBarButton('CheckSmart',
                   function() {
                          var yourSelect = document.getElementById('gw-inputsmarthostsmenu');
                          var searchstring = yourSelect.options[ yourSelect.selectedIndex ].value;
                          console.log("checking all that match: " + RegExp.dblescape(searchstring) + " !\n");
                          checkTicketsThatMatchString(RegExp.dblescape(searchstring), color);
                   } ,
                   color);
    }
}

function runAutoSmart(color) {
    var dups = getDuplicateSmartAlertHostnames();
    var searchstring = dups.shift();
    console.log("gonna check all that have: " + searchstring);
    if(searchstring)
        checkTicketsThatMatchString(RegExp.dblescape(searchstring), color);
}

function checkTicketsThatMatch(whitelist, blacklist, color) {
       // check if we even got an array
    if ( whitelist && whitelist.constructor === Array ) {
        // grab each row in the table that contains tickets
        var rows = document.querySelectorAll('tbody.gridcontents_ticketmanagegrid_parent tr');
        var i;
        for(i = 0; i < rows.length; ++i) {
            // pull cols out of row
            var cols = rows[i].getElementsByTagName("td");
            // get the name out of the fourth col
            // TODO: this only works on layouts where the subject is the 4th col. need to actually search the table header for 'Subject'
            var title = cols[4].getElementsByTagName('a')[0].innerHTML;
            // see if the title matches any of our strings.
            if (new RegExp('('+whitelist.join(')|(')+')', "g").test(RegExp.escape(title))) {
                // if we were provided a blacklist, be sure to make sure we don't match it
                if ( blacklist && blacklist.constructor === Array ) {
                    if (new RegExp('('+blacklist.join(')|(')+')', "g").test(RegExp.escape(title))) continue;
                }
                // check the checkbox and set the color ( if applicable ) of the row
                //rows[i].querySelectorAll( 'input[type=checkbox]' )[0].checked=true;
                rows[i].querySelectorAll( 'input[type=checkbox]' )[0].checked=!rows[i].querySelectorAll( 'input[type=checkbox]' )[0].checked;
                if (color) rows[i].style.backgroundColor = color;
            }
        }
    }
}

// put all the 'runtime' stuff here:

var AlertsToTrash = [
    'lfd',
    'FAILED',
    'RECOVERED',
    'Mail.*delivery',
    '\].*cPanel',
    'Acme',
    'The.*backup.*process.*completed'
    ];

var AlertsToNOTTrash = [
    'SSH',
    'RELAY',
    'Script.*Alert',
    'sshd',
    'check_mysql',
    'cxs.*Scan',
    'maldet',
    'DNS'
    ];

var AlertsToClose = [
    'New.*(a|A)(cc|dd)',
    '\].*Acc',
    '[UuDd](p|own)grade',
    'CPU.*and.*Memory',
    'Inode.*usage'
    ];
var AlertsSMART = [
    'SMART',
    'Hard.*Drive',
    '[Dd]egraded',
    '[Rr][Aa][Ii][Dd]'
    ];

var NeverTrash = AlertsToNOTTrash.concat(AlertsToClose, AlertsSMART);
var MatchAll = ['.*'];

$(document).bind("DOMSubtreeModified", function() {
    if ($("#gwCloseStuff").length || !(window.location.href == tikopen || window.location.href == tikonhold) ) { return; }
    newTicketBarButton('CloseStuff',
        function(){checkTicketsThatMatch(AlertsToClose, null, "rgba(0, 191, 255, 2.5)"); } ,
        "rgba(0, 191, 255, 0.18)");

    newTicketBarButton('TrashStuff',
        function(){checkTicketsThatMatch(AlertsToTrash, NeverTrash, "rgba(222, 0, 0, 0.18)"); } ,
        "rgba(222, 0, 0, 0.18)");

    newTicketBarButton('Smart',
        function(){checkTicketsThatMatch(AlertsSMART, null, "rgba(255, 255, 0, 0.38)"); } ,
        "rgba(255, 255, 0, 0.38)");

    newTicketBarButton('ALL',
        function(){checkTicketsThatMatch(MatchAll, NeverTrash, "rgba(255, 218, 185, 0.88)"); } ,
        "rgba(255, 218, 185, 0.88)");

    newTicketBarInput('find', "rgba(255,0,255,0.3)");

    newTicketBarButton('Find',
        function(){runTicketSearch('find', "rgba(255,0,255,0.3)"); } ,
        "rgba(255,0,255,0.3)");

    newTicketBarButton('FindSmart',
        function(){mergeSmartAlerts("rgba(255, 255, 0, 0.38)"); } ,
        "rgba(255, 255, 0, 0.38)");
    newTicketBarButton('FindSmartAuto',
        function(){runAutoSmart("rgba(0, 191, 255, 1.0)"); } ,
        "rgba(0, 191, 255, 0.18)");
});