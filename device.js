var crypto = require('crypto');

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
    let curr = new Date()
    let path = "/hz-live/"+this.tag;
    let pathe = path+"?e=" + parseInt(curr.getTime()/1000 + 600);

    let token = crypto.createHmac('sha1', 'bI0Hp_txB-dAg04W3J41CksFr3fBcAdbupKVqpMf').update(pathe).digest().toString('base64');
    token= token.replace(/\+/g,'-');
    token = token.replace(/\//g,'_');
 

    this.pushurl = 'rtmp://pili-publish.hzlive.shenzy.com.cn' + pathe + "&token="+"Ktd9GidrX9-M4NGSIfvuGoG_QnT3b5wtD0Lpy7Ul"+":"+ token;
    this.playurl = 'rtmp://pili-live-rtmp.hzlive.shenzy.com.cn' + path;
    console.log("生成推流url " + this.pushurl);

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
