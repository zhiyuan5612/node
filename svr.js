// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var aes = require('./aes.js');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));



io.on('connection', function (socket) {

    console.log("connection");

    socket.recvIndex = 0;

    socket.on('dev', function (data) {
        socket.recvIndex++;
        console.log("recv dev =>" + data.toString());
        return;
        var str =   aes.decryption(data.toString(),'12345678123456781234567812345678');
        console.log(str);
        var msg = JSON.parse(str);
        if(msg.index != socket.recvIndex){
            socket.disconnect();
        };




    });

    socket.on('usr', function (data) {
        socket.recvIndex++;
        console.log("recv usr =>" + data.toString());
        var str =   aes.decryption(data.toString(),'12345678123456781234567812345678');
        console.log(str);
        var msg = JSON.parse(str);
        if(msg.index != socket.recvIndex){
            socket.disconnect();
        };

    });


    socket.on('disconnect', function () {
        console.log("disconnect");
    });
});
