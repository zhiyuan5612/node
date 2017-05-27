// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var device = require('./device.js')
var aes = require('./aes.js');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));


let devmap = new Map();

io.on('connection', function (socket) {

    console.log("connection");

    socket.recvIndex = 0;

    socket.on('dev', function (data) {
            console.log("dev=> "+ JSON.stringify(data));
            let msg = data;
            let id = msg.id;
            let tag = msg.tag;
            let status = msg.status;


            if(socket.dev == undefined){
                socket.dev = new device(id,tag);
                socket.dev.sock = socket;
                devmap[tag] = socket.dev;
            }else{
                let dev = devmap[tag];
                if(dev != socket.dev){
                    dev.sock.disconnect();
                    return;
                }
            }

            socket.dev.status = status;
            socket.dev.count++;
        try{
            console.log("dev=> "+ JSON.stringify(data));
            let msg = data;
            let id = msg.id;
            let tag = msg.tag;
            let status = msg.status;


            if(socket.dev == undefined){
                socket.dev = new device(id,tag);
                socket.dev.sock = socket;
                devmap[tag] = socket.dev;
            }else{
                let dev = devmap[tag];
                if(dev != socket.dev){
                    dev.sock.disconnect();
                    return;
                }
            }

            socket.dev.status = status;
            socket.dev.count++;

        }
        catch(err)
        {
            console.error("dev=> "+err);

        }

    });

    socket.on('usr', function (data) {
        console.log("usr=> "+ JSON.stringify(data));
        let msg = data;
        let sendmsg = {};
        let uid = msg.uid;
        let tag = msg.tag;
        

        if(socket.uid == undefined)
        {
            socket.uid = uid;
        }
        else{
            if(socket.uid != uid){
                socket.disconnect();
                return;
            }
        
        }

        let dev = devmap[tag];
        if(!dev)
        {
            sendmsg.status = "offline";
            socket.emit("usr",sendmsg);
            return;
        }

        socket.dev = dev;

        sendmsg.status = "online";
        sendmsg.url = dev.play(uid);

        socket.emit("usr",sendmsg);

    });


    socket.on('disconnect', function () {
        console.log("disconnect");

        if(socket.uid && socket.dev){
            socket.dev.stop(socket.uid);
            socket.dev = null;
            socket.uid = null;
            return;
        }

        if(socket.dev){

            devmap.delete(socket.dev.tag);
            socket.dev.sock = null;
            socket.dev.status = null;
            socket.dev = null;

        }

    });
});
