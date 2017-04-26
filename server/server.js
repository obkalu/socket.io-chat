/* This is the chat server */

// load the 'express.js' module
var express = require("express");
// create an instance of an express server app by invoking the express() function
var expressAppInstance = express();
// create the chatServer by loading the 'http' module and call createServer with the expressInstance
var chatServer = require("http").createServer(expressAppInstance);
var socketIO = require("socket.io").listen(chatServer);

// Users and Connections
var users = [];
var connections = [];

chatServer.listen(process.env.PORT || 3000);

console.log("Chat Server started successfully ...");
console.log("Listening on:\n host: localhost \n port: 3000");
console.log("Launch open your browser and go to http://localhost:3000, to view the chat app.");

// Setup the default route(s)
expressAppInstance.get("/", function(request, response) {
    response.sendFile(process.cwd() + "\\client\\index.html");
});

// setup client connection/disconnection event-handlers
socketIO.sockets.on("connection", function(socket) {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    // Disconnect
    socket.on("disconnect", function(data) {
        // if(!socket.username) {
        //     return; 
        // }
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets connected", connections.length);
    });

    // Send message
    socket.on("send message", function(data) {
        console.log(data);
        socketIO.sockets.emit("new message", {messageText: data, username: socket.username});
    });

    // New User connect
    socket.on("new user connect", function(data, callback){
        // pass boolean value, true, to the callback function
        callback(true);
        // assign the (username) data received to the socket's username property
        socket.username = data;
        // add the (username) data to the users array
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        socketIO.sockets.emit("update users list", users);
    }

});

