
var crypto = require('crypto');
var URLSafeBase64 = require('urlsafe-base64');

    let curr = new Date()
    let path = "/hz-live/"+"ccc";
    let pathe = path+"?e=" + parseInt(curr.getTime()/1000 + 3600);

    let token = crypto.createHmac('sha1', 'bI0Hp_txB-dAg04W3J41CksFr3fBcAdbupKVqpMf').update(pathe).digest().toString('base64');
    console.log("token:" + token);
   token= token.replace('+','-');
    token = token.replace('/','_');

 

    let pushurl = 'rtmp://pili-publish.hzlive.shenzy.com.cn' + pathe + "&token="+"Ktd9GidrX9-M4NGSIfvuGoG_QnT3b5wtD0Lpy7Ul"+":"+ token;
    let playurl = 'rtmp://pili-live-rtmp.hzlive.shenzy.com.cn' + path;
    console.log("生成推流url " + pushurl);
