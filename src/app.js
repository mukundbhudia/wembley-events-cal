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
        cal.save('cals/stadium-cal.ics', function(err, doc) {
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
        events: xray('div#list', [{
        title: 'h3',
        startDay: 'span.m-date__rangeFirst > span.m-date__day',
        endDay: 'span.m-date__rangeLast > span.m-date__day',
        month: 'span.m-date__month',
        year: 'span.m-date__year',
        description: 'Not Available'
    }])
})(function(err, content) {
    if (content) {
        var events = [];
        for (const eventListing of content.events) {
                for (var j = parseInt(eventListing.startDay); j <= parseInt(eventListing.endDay); j++) {
                    var eDateString = j + " " + eventListing.month + " " + eventListing.year;
                    var eDate = new Date(eDateString);
                    var event = {
                        start: eDate,
                        allDay: true,
                        summary: eventListing.title.trim(),
                        description: 'Not available',
                        location: "SSE Arena Wembley"
                    };
                    events.push(event);
                    console.log(event)
                }
        }
        console.log(events.length + " events found");
        var cal = ical({
            name: 'SSE Arena Wembley Events',
            timezone: 'Europe/London',
            location: "SSE Arena Wembley",
            description: "SSE Arena Wembley events calendar",
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
