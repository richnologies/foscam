var http = require('http');
var querystring = require('querystring');
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
        return this._sendOrder({
            cmd: 'ptzStopRun'
        });
    };
    Foscam.prototype.ptzReset = function() {
        return this._sendOrder({
            cmd: 'ptzReset'
        });
    };
    Foscam.prototype._ptz = function(cmd, time) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self
                ._sendOrder({
                    cmd: cmd
                })
                .then(function(results) {
                    var result = parseInt(results.result[0]);
                    if (result === 0) {
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
                    } else {
                        reject(result);
                    }
                })
                .catch(function(result) {
                    reject(result);
                });
        });
    };
    Foscam.prototype.getPTZSpeed = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self
                ._sendOrder({
                    cmd: 'getPTZSpeed'
                })
                .then(function(results) {
                    if (parseInt(results.result[0]) === 0) {
                        resolve(parseInt(results.speed[0]));
                    } else {
                        reject(results);
                    }
                });
        });
    };
    Foscam.prototype.setPTZSpeed = function(speed) {
        var self = this;
        return new Promise(function(resolve, reject) {
            if (speed > 4 || speed < 0) {
                reject('Not valid speed');
            } else {
                self
                    ._sendOrder({
                        cmd: 'setPTZSpeed',
                        speed: speed
                    })
                    .then(function(results) {
                        if (parseInt(results.result[0]) === 0) {
                            resolve();
                        } else {
                            reject(results);
                        }
                    });
            }
        });
    };
    Foscam.prototype._sendOrder = function(params) {
        var self = this;
        return new Promise(function(resolve, reject) {
            http
                .request({
                    hostname: self._hostname,
                    port: self._port,
                    path: self._buildPath(params),
                    method: 'GET'
                }, function(res) {
                    var answer = '';
                    res.on('data', function(data) {
                        answer += data.toString();
                    });
                    res.on('end', function() {
                        self._xmlParse(answer)
                            .then(function(results) {
                                resolve(results);
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
    Foscam.prototype._buildPath = function(params) {
        var path = '/cgi-bin/CGIProxy.fcgi?';
        var end = '&usr=' + this._usr + '&pwd=' + this._pwd;
        return path + querystring.stringify(params) + end;
    };
    Foscam.prototype._xmlParse = function(answer) {
        return new Promise(function(resolve, reject) {
            xml(answer, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.CGI_Result);
                }
            });
        });
    };
    return Foscam;
})();

module.exports = Foscam;