function device(id,tag){
    this.id     = id;
    this.tag    = tag;
    this.status = null;
    this.sock   = null;
    this.users  = new Set();
    this.playurl = null;
    this.pushurl = null;
    this.count   = 0;
};

device.prototype.beginlive = function(){
    this.playurl = 'http://playurl'
    this.pushurl = 'http://pushurl'
    if(this.sock){
      this.sock.emit("dev",{ctrl:'begin',url:this.playurl});
    
    }
};
device.prototype.stoplive = function(){
    if(this.sock){
      this.sock.emit("dev",{ctrl:'stop'});
    }
};

device.prototype.play = function(user){
    if(this.users.size == 0){
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
