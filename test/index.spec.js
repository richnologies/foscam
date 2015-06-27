var Foscam = require('../lib/index');

var foscam = new Foscam({
    host: '192.168.0.19',
    port: 80,
    usr: 'admin',
    pwd: 'batea1'
});

foscam.ptzMoveRight(4000);