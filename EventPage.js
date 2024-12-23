import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

function EventPage() {
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState(new Date());

    // Fetch events from the API
    useEffect(() => {
        axios.get('http://localhost:5000/api/events')
            .then((response) => setEvents(response.data))
            .catch((error) => console.error(error));
    }, []);

    // Filter events by the selected date
    const eventsOnDate = events.filter(
        (event) => new Date(event.date).toDateString() === date.toDateString()
    );

    return (
        <div>
            <h1>Event Management</h1>

            {/* Calendar View */}
            <Calendar onChange={setDate} value={date} />
            
            <h2>Events on {date.toDateString()}</h2>
            <ul>
                {eventsOnDate.length > 0 ? (
                    eventsOnDate.map((event) => (
                        <li key={event._id}>
                            {event.name} - {new Date(event.date).toLocaleTimeString()}
                        </li>
                    ))
                ) : (
                    <p>No events scheduled for this day.</p>
                )}
            </ul>

            {/* Full Event List */}
            <h2>All Events</h2>
            <ul>
                {events.map((event) => (
                    <li key={event._id}>
                        {event.name} - {new Date(event.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EventPage;
