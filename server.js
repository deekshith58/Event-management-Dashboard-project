const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const eventRoutes = require('./routes/eventRoutes'); // Ensure this file exists and is correctly implemented

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// REST API Routes
app.use('/api/events', eventRoutes); // Example: Event Routes

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for task updates
    socket.on('update_task', (data) => {
        console.log('Task updated:', data);
        io.emit('task_updated', data); // Broadcast the updated task to all connected clients
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
