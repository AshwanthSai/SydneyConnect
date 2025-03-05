import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from "http"
import {Server} from 'socket.io';
import { formatMessage } from './utils/format.js';
import { getCurrentUser, getRoomUsers, removeUserFromRoom, userJoin } from './utils/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
/* 
    - Picked these up from documentation 
*/
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

/* 
    - Our return messages are of the form
    {   
        user
        message: "message",
        time: "time"
    }

*/
let botName = "SydneyConnect";

//Each Connection has a socket ID
io.on('connection', (socket) => {
    socket.on('joinRoom', msg => {
        //* Creating a user object with socket id
        const user = userJoin(socket.id, msg.username, msg.room);
        //* Creating a socket namespace for the room
        socket.join(user.room);
        
        // Sending a welcome message to the client
        socket.emit('message', formatMessage(botName,'Welcome to SydneyConnect !'));

        //* Focussing Messages to a room from Backend
        // Broadcasting a message to all connected clients except the one that sent the message
        socket.broadcast.to(user.room).emit("message",formatMessage(botName,`${user.username} has entered the chat`));        
        
        io.emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // Echo back messages to the client with label Chat Message
        socket.on("Chat Message", (msg) => {
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit("message", formatMessage(user.username,msg));
        })
    })

    socket.on("disconnect", (msg) => {
        const user = getCurrentUser(socket.id);
        removeUserFromRoom(socket.id);
        io.emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        io.to(user.room).emit("message",  formatMessage(botName,`A ${user.username} has left the chat`));
    })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});