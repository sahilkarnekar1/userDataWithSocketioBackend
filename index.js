const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const { Server } = require('socket.io'); // Import socket.io
const http = require('http'); // Import http module
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Create an HTTP server
const server = http.createServer(app);

// Initialize socket.io with the server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust the origin based on your requirements
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
// Routes
// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
app.use('/api', userRoutes(io));  // Pass the `io` instance to the routes

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);


    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start server using http server, not app.listen
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
