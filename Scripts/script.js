/**
 * Created by JetBrains WebStorm.
 * User: Rick.Garibay
 * Date: 3/22/12
 * Time: 7:36 PM
 * To change this template use File | Settings | File Templates.
 */


    // JQuery animation and original CSS credit: Marcofolio.net

//globals

// Set the Z-Index (used to display images on top while dragging)
var zindexnr = 1;

// boolean to check if the user is dragging
var dragging = false;

var tweet ="";

$(document).ready(function () {

    if (Modernizr.webjsockets) {
    $("#messages").append("WebSockets is supported!");
    }

if (!window.WebSocket && window.MozWebSocket) {
    window.WebSocket = window.MozWebSocket;
    }


//wire up button event
$('#buttonAddPolaroid').click(function () {

    var count;
    var connection;

    var host = "ws://localhost:88";
    //var host = "ws://vslivedemo320130320.cloudapp.net/";
    //var host = "ws://vslivestream.cloudapp.net/";


    //alert('Connecting to: ' + host);

    connection = new WebSocket(host);

    connection.onopen = function () {
    $(".btn").css("color", "green");
    };

connection.onmessage = function (message) {

    tweet = window.JSON.parse(message.data);
    var imgUrl;

if(tweet.entities.urls.length !==0){
        imgUrl= GetImgUrl(tweet,"twitpic");
}
else
{
    // Naive assumption that image service must be native twitter.
    imgUrl= GetImgUrl(tweet,"twitter");
}

   addNewPolaroid(imgUrl, 'Status from ' + tweet.user.screen_name, '@' + tweet.user.screen_name + ':' + tweet.text);

};
});
});

function GetImgUrl(status,type)
{
    if(type == "twitpic")
    {

        var fullUrl= status.entities.urls[0].display_url;
        return "http://twitpic.com/show/thumb/" + fullUrl.substring(12);
    }
    else
    {
        var fullUrl=status.entities.media[0].media_url;

        return fullUrl;
    }
}
function addNewPolaroid(src, alt, title) {

    $('#polaroidContainer').append('<div class="polaroid"><img src="' + src + '" alt="' + alt + '" /><p>' + title + '</p></div>');

    initailize();
    }

// Function to get random number upto m
// http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
function randomXToY(minVal, maxVal, floatVal) {
    var randVal = minVal + (Math.random() * (maxVal - minVal));
    return typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);
    }

function initailize() {


// Show the polaroid on top when clicked on
$(".polaroid").mouseup(function (e) {
    if (!dragging) {
    // Bring polaroid to the foreground
    zindexnr++;
    var cssObj = { 'z-index': zindexnr,
    'transform': 'rotate(0deg)',  // added in case CSS3 is standard
    '-webkit-transform': 'rotate(0deg)'
    };  // safari only
$(this).css(cssObj);
}
});


// Make the polaroid draggable & display a shadow when dragging
$(".polaroid").draggable({
    cursor: 'crosshair',
    start: function (event, ui) {
    dragging = true;
    zindexnr++;
    var cssObj = { 'box-shadow': '#888 5px 10px 10px', // added in case CSS3 is standard
    '-webkit-box-shadow': '#888 5px 10px 10px', // safari only
    'margin-left': '-10px',
    'margin-top': '-10px',
    'z-index': zindexnr
    };
$(this).css(cssObj);
},
stop: function (event, ui) {
    var tempVal = Math.round(Math.random());
    if (tempVal == 1) {
    var rotDegrees = randomXToY(330, 360); // rotate left
    } else {
    var rotDegrees = randomXToY(0, 30); // rotate right
    }
var cssObj = { 'box-shadow': '', // added in case CSS3 is standard
    '-webkit-box-shadow': '', // safari only
    'transform': 'rotate(' + rotDegrees + 'deg)', // added in case CSS3 is standard
    '-webkit-transform': 'rotate(' + rotDegrees + 'deg)', // safari only
    'margin-left': '0px',
    'margin-top': '0px'
    };
$(this).css(cssObj);
dragging = false;
}
});

}
