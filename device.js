function device(id,tag){
    this.id     = id;
    this.tag    = tag;
    this.users  = new Set();
    this.playurl = null;
    this.pushurl = null;
};

device.prototype.beginlive = function(){
};
device.prototype.stoplive = function(){
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


function devmgr(){
    this.devmap = new Map();
};

devmgr.prototype.adddev = function(id,tag){
   let dev = new device(id,tag) ;
    this.devmap[tag]=dev;
    return dev;
};
devmgr.prototype.deldev = function(tag){
    let dev = this.devmap[tag];
    this.devmap.delete(tag);
    return dev;
};
devmgr.prototype.getdev = function(tag){
    return this.devmap[tag];
};

