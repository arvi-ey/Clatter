require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const express = require('express')
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const cookie_parser = require("cookie-parser")
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const UserRouter = require("./Route/userRouter")
const AuthRouter = require("./Route/authRouter")
const ContactRouter = require("./Route/contactRouter")
const MassageRouter = require("./Route/massageRouter")




app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookie_parser())


const uri = "mongodb://127.0.0.1:27017/clatter";
mongoose.connect(uri)
    .then(() => {
        console.log("Successfully connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

const users = {};
const userStatus = {}

io.on('connection', (socket) => {
    console.log(`New client connected ${socket.id}`);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    
    socket.on('register', (userId) => {
        users[userId] = socket.id;
        userStatus[userId] = 'online';
        // console.log(`User ${userId} registered with socket ID ${socket.id}`);
        io.emit('userStatus', { userId, status: 'online' });
    });
    socket.on('typing', ({sender,recipient}) =>{
        const recipientSocketId = users[recipient];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('typing', {sender,status:"Typing"});
        }
    }  )


    socket.on('sendMessage', ({ sender, recipient, content }) => {
        const recipientSocketId = users[recipient];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receiveMessage', { sender, content, timestamp: Date.now() });
        }
    });



    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                userStatus[userId] = 'offline';
                io.emit('userStatus', { userId, status: 'offline' });
                break;
            }
        }
    });
});


app.use('/user', UserRouter)
app.use('/auth', AuthRouter)
app.use('/contact', ContactRouter)
app.use('/massage', MassageRouter)


server.listen(5000, () => {
    console.log(`server is listening on PORT:5000`)
})