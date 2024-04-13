// Create web server
const express = require('express');
const app = express();
// Create server
const server = require('http').Server(app);
// Create socket
const io = require('socket.io')(server);
// Create connection with mongoDB
const mongoose = require('mongoose');
const Comment = require('./model/Comment');
// Connect with mongoDB
mongoose.connect('mongodb://localhost/comment', {
    useNewUrlParser: true
});
// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');
// Set public folder
app.use(express.static('public'));
// Get all comments
app.get('/', async (req, res) => {
    const comments = await Comment.find();
    res.render('home', {
        comments
    });
});
// Listen port
server.listen(3000, () => console.log('Server is running'));
// Create socket
io.on('connection', (socket) => {
    console.log('User connected');
    // Listen event from client
    socket.on('client-send-comment', async (data) => {
        const { username, comment } = data;
        // Create new comment
        const newComment = new Comment({
            username,
            comment
        });
        // Save comment to database
        await newComment.save();
        // Send comment to client
        io.sockets.emit('server-send-comment', data);
    });
});