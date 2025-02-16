var socket = io();

const chatForm = document.getElementById('chat-form');
const urlParams = new URLSearchParams(window.location.search);

// Join the appropriate room as per the Query String
socket.emit('joinRoom', { username: urlParams.get('username'),
    room: urlParams.get('room')
});

chatForm.onsubmit = (e) => {
    // Prevent Page from reloading
    e.preventDefault();
    // Retrieve the message from the form
    // Input is of ID emit
    // The value of the input is the message
    const msg = e.target.elements.msg.value;
    // Emitting a message with Label - Chat Message.
    socket.emit('Chat Message', msg);
    e.target.elements.msg.value = '';
    const messages = document.getElementsByClassName('chat-messages')[0]
    //Code to scroll to the bottom of the div
    messages.scrollTop = messages.scrollHeight;
    document.getElementById('msg').focus();
}

// Catch any emitted message and print it to the console
socket.on('message', (msg) => {
    outputMessage(msg);
});

function outputMessage(message) {
    const chatMessage = document.createElement('div');
    // Every Message has a Div Class
    chatMessage.classList.add('message');
    chatMessage.innerHTML = `
    <p class="meta">${message.username} <span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>    
    `
    document.querySelector('.chat-messages').appendChild(chatMessage);
}

