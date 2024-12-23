import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AttendeePage() {
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/attendees');
      setAttendees(response.data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  const handleAddAttendee = async () => {
    try {
      await axios.post('http://localhost:5000/api/attendees', newAttendee);
      setNewAttendee({ name: '', email: '' });
      fetchAttendees();
    } catch (error) {
      console.error('Error adding attendee:', error);
    }
  };

  const handleDeleteAttendee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/attendees/${id}`);
      fetchAttendees();
    } catch (error) {
      console.error('Error deleting attendee:', error);
    }
  };

  return (
    <div>
      <h1>Attendee Management</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newAttendee.name}
          onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newAttendee.email}
          onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
        />
        <button onClick={handleAddAttendee}>Add Attendee</button>
      </div>
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee._id}>
            {attendee.name} - {attendee.email}{' '}
            <button onClick={() => handleDeleteAttendee(attendee._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendeePage;
