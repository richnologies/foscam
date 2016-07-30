const Foscam = require('./index');

var foscam = new Foscam({
  host: 'xxx.xxx.xxx.xxx',
  port: 88,
  usr: 'admin',
  pwd: 'root'
});

foscam.ptzStartCruise('Horizontal');
