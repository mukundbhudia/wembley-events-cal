var Xray = require('x-ray');
var xray = Xray();

var URL = "https://www.brent.gov.uk/events-and-whats-on-calendar?eventCat=Wembley%20Stadium%20events";

xray(URL, {
    pageTitle: 'title',
        events: xray('div.brent_newEvent', [{
        title: 'a.heading',
        description: 'div.brent_newEventTimes',
        longDescription: 'div.brent_newEventRight',
    }])
})(function(err, content) {
    for (var i=0; i < content.events.length; i++) {
        var eDateString = content.events[i].description.split(',');
        var eDate = new Date(eDateString[0]);
        console.log(content.events[i].title + ' < on > ' + eDate);
        console.log(content.events[i].longDescription);
    }
});