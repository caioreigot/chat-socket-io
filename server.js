const express = require('express');
const path = require('path');

const app = express();
const http = require('http');
const server = http.createServer(app);

/*Socket.IO*/
const { Server } = require('socket.io');
const io = new Server(server);

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(
        path.join(publicPath, 'index.html')
    );
});

const messages = [];

io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('disconnect', () => {
        console.log(`Socket desconectado: ${socket.id}`);
    });

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

const host = 'localhost';
const port = 3000;

server.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
});