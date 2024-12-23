import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', deadline: '', assignedTo: '' });
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    // Fetch tasks and attendees on component mount
    fetchTasks();
    fetchAttendees();

    // Listen for real-time updates on tasks
    socket.on('task_updated', (data) => {
      console.log('Task updated:', data);
      fetchTasks(); // Refresh task list when a task is updated
    });

    // Clean up the socket listener on component unmount
    return () => {
      socket.off('task_updated');
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchAttendees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/attendees');
      setAttendees(response.data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      await axios.post('http://localhost:5000/api/tasks', newTask);
      setNewTask({ name: '', deadline: '', assignedTo: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTaskStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div>
      <h1>Task Management</h1>
      <div>
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
        />
        <select
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
        >
          <option value="">Assign to Attendee</option>
          {attendees.map((attendee) => (
            <option key={attendee._id} value={attendee._id}>
              {attendee.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.name} - {task.deadline} - {task.status}{' '}
            <button onClick={() => handleUpdateTaskStatus(task._id, 'Completed')}>
              Mark as Completed
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskPage;
