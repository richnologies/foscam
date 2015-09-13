/**
 * Created by Ricardo on 3/7/15.
 */
var Foscam = require('./index');

var foscam = new Foscam({
    host: '92.53.192.141',
    port: 80,
    usr: 'admin',
    pwd: 'batea1'
});

foscam.zoomOut(2000);