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

        try{
            socket.type ='dev';
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
            console.error("dev err=> "+err);

        }

    });

    socket.on('usr', function (data) {
        try{
            socket.type ='usr';
            console.log("usr=> "+ JSON.stringify(data));
            let sendmsg = {};
            let tag = data.tag;
            let cam = data.cam;

            let dev = devmap[tag];
            if(!dev)
            {
                sendmsg.status = "offline";
                socket.emit("usr",sendmsg);
                console.log("svr 2 usr "+tag+"=> " + JSON.stringify(sendmsg));
                return;
            }
            socket.dev = dev;

            sendmsg.status = "online";
            sendmsg.url = dev.play(socket.id,cam);

            socket.emit("usr",sendmsg);
            console.log("svr 2 usr "+tag+"=> " + JSON.stringify(sendmsg));
        }
        catch(err)
        {
            console.error("usr err => "+err);

        }

    });


    socket.on('disconnect', function () {
        try{
            if(socket.type == 'usr' && socket.dev){
                socket.dev.stop(socket.id);
                socket.dev = null;
                console.log("usr disconnect");
                return;
            }

            if(socket.type == 'dev' &&socket.dev){
                console.log("dev "+socket.dev.tag+" disconnect");

                devmap.delete(socket.dev.tag);
                socket.dev.sock = null;
                socket.dev.status = null;
                socket.dev = null;
                return;

            }
            console.log("disconnect");
        }catch(err){
            console.error("dis err => "+err);
        }


    });
});
