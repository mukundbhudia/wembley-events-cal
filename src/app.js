const Xray = require('x-ray')
const xray = Xray()
const ical = require('ical-generator')

const wembleyStadiumSourceUrl = 'https://www.brent.gov.uk/events-and-whats-on-calendar?eventCat=Wembley%20Stadium%20events'
const sseArenaSourceUrl = 'https://www.ssearena.co.uk/events'

xray(wembleyStadiumSourceUrl, {
  pageTitle: 'title',
    events: xray('div.brent_newEvent', [{
    title: 'a.heading',
    description: 'div.brent_newEventDetails',
    longDescription: 'div.brent_newEventRight',
  }])
})((err, content) => {
  if (content) {
    const events = []
    content.events.forEach(eventOnPage => {
      const eDateString = eventOnPage.description.split(',')
      const eDate = new Date(eDateString[0])
      const event = {
          start: eDate,
          // allDay: true,
          summary: eventOnPage.title,
          description: eventOnPage.longDescription,
          location: "Wembley Stadium"
      }
      events.push(event)
      console.log(event)  
    })
    console.log(events.length + " events found")
    const cal = ical({
      name: 'Wembley Stadium Events',
      timezone: 'Europe/London',
      location: "Wembley Stadium",
      description: "Wembley Stadium events calendar",
      events: events
    })
    cal.save('cals/stadium-cal.ics',(err, doc) => {
      if (err) {
        console.error(err)
      } else {
        console.log("Stadium calendar saved")
      }
    })
  } else if (err) {
    console.error(err)
  }
})

xray(sseArenaSourceUrl, {
  pageTitle: 'title',
    events: xray('div#list', [{
    title: 'h3',
    startDay: 'span.m-date__rangeFirst > span.m-date__day',
    endDay: 'span.m-date__rangeLast > span.m-date__day',
    month: 'span.m-date__month',
    year: 'span.m-date__year',
    description: 'Not Available'
  }])
})((err, content) => {
  if (content) {
    const events = []
    for (const eventListing of content.events) {
      for (let j = parseInt(eventListing.startDay); j <= parseInt(eventListing.endDay); j++) {
        const eDateString = j + " " + eventListing.month + " " + eventListing.year
        const eDate = new Date(eDateString)
        const event = {
          start: eDate,
          allDay: true,
          summary: eventListing.title.trim(),
          description: 'Not available',
          location: "SSE Arena Wembley"
        }
        events.push(event)
        console.log(event)
      }
    }
    console.log(events.length + " events found")
    const cal = ical({
      name: 'SSE Arena Wembley Events',
      timezone: 'Europe/London',
      location: "SSE Arena Wembley",
      description: "SSE Arena Wembley events calendar",
      events: events
    })
    cal.save('cals/arena-cal.ics', (err, doc) => {
      if (err) {
        console.error(err)
      } else {
        console.log("Arena calendar saved")
      }
    })
  } else if (err) {
    console.error(err)
  }
})
