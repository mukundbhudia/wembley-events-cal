var Xray = require('x-ray');
var xray = Xray();
var ical = require('ical-generator'),
    http = require('http');

var sourceUrl = "https://www.brent.gov.uk/events-and-whats-on-calendar?eventCat=Wembley%20Stadium%20events";

xray(sourceUrl, {
    pageTitle: 'title',
        events: xray('div.brent_newEvent', [{
        title: 'a.heading',
        description: 'div.brent_newEventTimes',
        longDescription: 'div.brent_newEventRight',
    }])
})(function(err, content) {
    if (content) {
        var events = [];
        for (var i=0; i < content.events.length; i++) {
            var eDateString = content.events[i].description.split(',');
            var eDate = new Date(eDateString[0]);
            var event = {
                start: eDate,
                allDay: true,
                summary: content.events[i].title,
                description: content.events[i].longDescription,
                location: "Wembley Stadium"
            };
            events.push(event);
        }
        console.log(events.length + " events found");
        var cal = ical({
            name: 'Wembley Stadium Events',
            timezone: 'Europe/London',
            events: events
        });
        cal.save('wemb-cal.ics', function(err, doc) {
            if (err) {
                console.error(err);
            } else {
                console.log("Calendar saved");
            }
        });
    } else if (err) {
        console.error(err);
    }
});