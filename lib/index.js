var http = require('http');
var xml = require('xml2js').parseString;

var Foscam = (function() {
    function Foscam(args) {
        this._hostname = args.host || 'localhost';
        this._port = args.port || 80;
        this._usr = args.usr || 'admin';
        this._pwd = args.pwd || 'root';
    }
    Foscam.prototype.ptzMoveUp = function(time) {
        this._sendOrder('ptzMoveUp');
        if (time) {
            setTimeout(this.ptzStopRun, time);
        }
    };
    Foscam.prototype.ptzMoveDown = function() {
        this._sendOrder('ptzMoveDown');
    };
    Foscam.prototype.ptzMoveRight = function(time) {
        this._sendOrder('ptzMoveRight');
        var self = this;
        if (time) {
            setTimeout(function() {
                self.ptzStopRun.call(self);
            }, time);
        }
    };
    Foscam.prototype.ptzMoveLeft = function() {
        this._sendOrder('ptzMoveLeft');
    };
    Foscam.prototype.ptzMoveTopLeft = function() {
        this._sendOrder('ptzMoveTopLeft');
    };
    Foscam.prototype.ptzMoveTopLeft = function() {
        this._sendOrder('ptzMoveTopRight');
    };
    Foscam.prototype.ptzMoveBottomLeft = function() {
        this._sendOrder('ptzMoveBottomLeft');
    };
    Foscam.prototype.ptzMoveBottomRight = function() {
        this._sendOrder('ptzMoveBottomRight');
    };
    Foscam.prototype.ptzStopRun = function() {
        this._sendOrder('ptzStopRun');
    };
    Foscam.prototype.ptzReset = function() {
        this._sendOrder('ptzReset');
    };
    Foscam.prototype._sendOrder = function(cmd) {
        var self = this;
        return new Promise(function(resolve, reject) {
            http
                .request({
                    hostname: self._hostname,
                    port: self._port,
                    path: self._buildPath(cmd),
                    method: 'GET'
                }, function(res) {
                    var answer = '';
                    res.on('data', function(data) {
                        answer += data.toString();
                    });
                    res.on('end', function() {
                        var result = self._xmlParse(answer);
                        if (result) {
                            resolve(result);
                        } else {
                            reject(result);
                        }
                    });
                })
                .on('error', function(err) {
                    reject(err);
                })
                .end();
        });
    };
    Foscam.prototype._buildPath = function(cmd) {
        var path = '/cgi-bin/CGIProxy.fcgi?cmd=';
        var end = '&usr=' + this._usr + '&pwd=' + this._pwd;
        return path + cmd + end;
    };
    Foscam.prototype._xmlParse = function(answer) {
        xml(answer, function(err, result) {
           return result.CGI_Result.result[0];
        });
    };
    return Foscam;
})();

module.exports = Foscam;