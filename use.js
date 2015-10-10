var Foscam = require('./index');

var foscam = new Foscam({
    host: 'xxx.xxx.xxx.xxx',
    port: 0000,
    usr: '*****',
    pwd: '*****'
});

foscam.ptzStartCruise('Horizontal');