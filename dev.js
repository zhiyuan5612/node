var io = require('socket.io-client'); 
var crypto = require('crypto');
var aes = require('./aes.js');


var socket = io('ws://127.0.0.1:3000');
var index =0;
var timer;

socket.sendmsg = function(id,obj){
    let msg={};
    //msg.rand = crypto.randomBytes(16).toString("hex");
    msg.index = index++;
    msg.obj  = obj;
    let str = aes.encryption(JSON.stringify(msg),"12345678123456781234567812345678");
    console.log(str);
    socket.emit(id,str);

};

socket.on('connect', function () {
    index = 1;
    timer = setInterval(function(){
    let dev = {};
    dev.id = 'ajdjjfe';
    dev.tag = '1001';

    socket.sendmsg("dev",dev);

},1000);
    
    console.log("connection");

});

socket.on('dev', function (data) {
    console.log("recv dev => "+data);
});


socket.on('disconnect', function () {
    clearInterval(timer);
    console.log('you have been disconnected');
});

socket.on('reconnect', function () {
    console.log('you have been reconnected');
});

socket.on('reconnect_error', function () {
    console.log('attempt to reconnect has failed');
});


