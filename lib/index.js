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
        return this._ptz('ptzMoveUp', time);
    };
    Foscam.prototype.ptzMoveDown = function(time) {
        return this._ptz('ptzMoveDown', time);
    };
    Foscam.prototype.ptzMoveRight = function(time) {
        return this._ptz('ptzMoveRight', time);
    };
    Foscam.prototype.ptzMoveLeft = function(time) {
        return this._ptz('ptzMoveLeft', time);
    };
    Foscam.prototype.ptzMoveTopLeft = function(time) {
        return this._ptz('ptzMoveTopLeft', time);
    };
    Foscam.prototype.ptzMoveTopRight = function(time) {
        return this._ptz('ptzMoveTopRight', time);
    };
    Foscam.prototype.ptzMoveBottomLeft = function(time) {
        return this._ptz('ptzMoveBottomLeft', time);
    };
    Foscam.prototype.ptzMoveBottomRight = function(time) {
        return this._ptz('ptzMoveBottomRight', time);
    };
    Foscam.prototype.ptzStopRun = function() {
        return this._sendOrder('ptzStopRun');
    };
    Foscam.prototype.ptzReset = function() {
        return this._sendOrder('ptzReset');
    };
    Foscam.prototype._ptz = function(cmd, time) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self._sendOrder(cmd)
                .then(function(result) {
                    if (time) {
                        setTimeout(function() {
                            self.ptzStopRun()
                                .then(function(result) {
                                    resolve(result);
                                })
                                .catch(function(result) {
                                    reject(result);
                                });
                        }, time);
                    } else {
                        resolve(result);
                    }
                })
                .catch(function(result) {
                    console.log('rejecting...', result);
                    reject(result);
                });
        });
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
                        self._xmlParse(answer)
                            .then(function(result) {
                                if (result === 0) {
                                    resolve(result);
                                } else {
                                    reject(result);
                                }
                            })
                            .catch(function(err) {
                                reject(err);
                            });
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
        return new Promise(function(resolve, reject) {
            xml(answer, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(parseInt(result.CGI_Result.result[0]));
                }
            });
        });
    };
    return Foscam;
})();

module.exports = Foscam;