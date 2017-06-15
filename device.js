var crypto = require('crypto');
var config = require('./config.js')
var Pili = require('piliv2');
var credentials = new Pili.Credentials(config.access, config.secret);
var hub = new Pili.Hub(credentials, config.space);

function device(id,tag){
    this.id     = id;
    this.tag    = tag;
    this.status = null;
    this.sock   = null;
    this.users  = new Set();
    this.playurl = null;
    this.pushurl = null;
    this.cam     = 0;
    this.count   = 0;
};

device.prototype.createUrl = function(){
    
    this.pushurl = Pili.publishURL(credentials,config.pushurl, config.space, this.tag, 10);
    this.playurl = Pili.rtmpPlayURL(config.playurl, config.space, this.tag);
    console.log("生成推流url " + this.pushurl);

    return;

    hub.createStream(this.tag, function(err, stream) {
        if (!err) {
            console.log(stream);
        } else {
            // Log error
            console.log(err, err.errorCode, err.httpCode);
        }
    });

}

device.prototype.beginlive = function(){
    this.createUrl();
    if(this.sock){
        let msg = {ctrl:'begin',url:this.pushurl,cam:this.cam};
        console.log("dev "+this.tag+" => ",JSON.stringify(msg));
        this.sock.emit("dev",msg);
    
    }
};
device.prototype.stoplive = function(){
    if(this.sock){
        let msg = {ctrl:'stop'};
        console.log("dev "+this.tag+" => ",JSON.stringify(msg));
      this.sock.emit("dev",{ctrl:'stop'});
    }
};

device.prototype.play = function(user,cam){
    
    if(cam != 1) cam = 0;
    
    if(this.users.size == 0){
        this.cam = cam;
        this.beginlive();
    }
    this.users.add(user);
    return this.playurl; 
};
device.prototype.stop = function(user){
    this.users.delete(user);
    if(this.users.size == 0){
        this.stoplive();
    }
};


module.exports = device;
