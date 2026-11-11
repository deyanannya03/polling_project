require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const PollsRouter = require('./routes/poll');
const connectDB = require('./db.js');
// Connect to MongoDB
connectDB();

const app = express();
const httpServer = http.createServer(app);
//socket CORS
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
//middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
//REST API
app.use('/api/polls', PollsRouter);

app.get('/', (req, res) => {
    res.json({ status: 'Livepoll is working properly' });
});
//sockets events
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    //poll room join
    socket.on('joinPoll', (pollId) => {
        socket.join(pollId);
        console.log(`Client ${socket.id} joined poll room: ${pollId}`);
    });
    //handle poll submission by socket
    socket.on('submitVote', async ({ pollId, optionIndex }) => {
        try {
            const Poll = require('./models/poll.js');
            const poll = await Poll.findById(pollId);
            if (!poll) return;
            if (optionIndex < 0 || optionIndex >= poll.options.length) {
                return res.status(400).json({ message: 'Invalid option index' });
            }
            poll.options[optionIndex].votes += 1;
            poll.total_votes += 1;
            await poll.save();
            //broadcast
            io.to(pollId).emit('pollUpdate', poll);
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    });
    //handle disconnect
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Livepoll server is running ...`);
});