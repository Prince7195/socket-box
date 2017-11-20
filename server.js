var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

users = [];
connections = [];
PORT = process.env.PORT || 3000;

server.listen(PORT);
console.log('server running');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log(`Connected: sockets connected ${connections.length}`);

    // disconnect
    socket.on('disconnect', (data) => {
        // if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: sockets connected ${connections.length}`)
    });

    // send message
    socket.on('send message', (data) => {
        io.sockets.emit("new message", {msg: data, user: socket.username});
    });

    // new user
    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

});