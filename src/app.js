var Xray = require('x-ray');
var xray = Xray();
var ical = require('ical-generator');

var sourceUrl = "https://www.brent.gov.uk/events-and-whats-on-calendar?eventCat=Wembley%20Stadium%20events";

xray(sourceUrl, {
    pageTitle: 'title',
        events: xray('div.brent_newEvent', [{
        title: 'a.heading',
        description: 'div.brent_newEventDetails',
        longDescription: 'div.brent_newEventRight',
    }])
})(function(err, content) {
    if (content) {
        var events = [];
        for (var i = 0; i < content.events.length; i++) {
            var eDateString = content.events[i].description.split(',');
            var eDate = new Date(eDateString[0]);
            var event = {
                start: eDate,
                // allDay: true,
                summary: content.events[i].title,
                description: content.events[i].longDescription,
                location: "Wembley Stadium"
            };
            events.push(event);
            console.log(event);
        }
        console.log(events.length + " events found");
        var cal = ical({
            name: 'Wembley Stadium Events',
            timezone: 'Europe/London',
            location: "Wembley Stadium",
            description: "Wembley Stadium events calendar",
            events: events
        });
        cal.save('cals/wemb-cal.ics', function(err, doc) {
            if (err) {
                console.error(err);
            } else {
                console.log("Stadium calendar saved");
            }
        });
    } else if (err) {
        console.error(err);
    }
});

var sourceUrl = "https://www.ssearena.co.uk/events";

xray(sourceUrl, {
    pageTitle: 'title',
        events: xray('div.entry', [{
        title: 'h3',
        date: 'div.date',
        description: 'Not Available',
        longDescription: 'div.details',
    }])
})(function(err, content) {
    if (content) {
        var events = [];
        for (var i = 0; i < content.events.length; i++) {
            var eDateString = content.events[i].date.trim();
            var eDate = new Date(eDateString);
            var event = {
                start: eDate,
                allDay: true,
                summary: content.events[i].title.trim(),
                description: content.events[i].longDescription.trim().split('…')[0] + '...',
                location: "SSE Arena Wembley"
            };
            events.push(event);
            console.log(event)
        }
        console.log(events.length + " events found");
        var cal = ical({
            name: 'Wembley Stadium Events',
            timezone: 'Europe/London',
            location: "Wembley Stadium",
            description: "Wembley Stadium events calendar",
            events: events
        });
        cal.save('cals/arena-cal.ics', function(err, doc) {
            if (err) {
                console.error(err);
            } else {
                console.log("Arena calendar saved");
            }
        });
    } else if (err) {
        console.error(err);
    }
});
