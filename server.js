import moment from 'moment';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from "http"
import {Server} from 'socket.io';
import { formatMessage } from './utils/format.js';

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

io.on('connection', (socket) => {
    socket.on('joinRoom', msg => {
        // Sending a welcome message to the client
        socket.emit('message', formatMessage(botName,'Welcome to SydneyConnect !'));
        

        //* Write utils to Scope Broadcast to a room

        // Broadcasting a message to all connected clients except the one that sent the message
        socket.broadcast.emit(formatMessage(botName,'A user has entered the chat'));        

        // Echo back messages to the client with label Chat Message
        socket.on("Chat Message", (msg) => {
            console.log(msg)
            socket.emit("message", formatMessage("User",msg));
        })
    })


    socket.on("disconnect", (msg) => {
        io.emit("message",  formatMessage(botName,"A user has left the chat"));
    })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});