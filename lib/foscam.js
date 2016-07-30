'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('http');
var querystring = require('querystring');
var xml = require('xml2js');

var Foscam = function () {
  function Foscam() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Foscam);

    this._hostname = options.host || 'localhost';
    this._port = options.port || 80;
    this._usr = options.usr || 'admin';
    this._pwd = options.pwd || 'root';
  }

  _createClass(Foscam, [{
    key: 'ptzMoveUp',
    value: function ptzMoveUp(time) {
      return this._ptz('ptzMoveUp', time);
    }
  }, {
    key: 'ptzMoveDown',
    value: function ptzMoveDown(time) {
      return this._ptz('ptzMoveDown', time);
    }
  }, {
    key: 'ptzMoveRight',
    value: function ptzMoveRight(time) {
      return this._ptz('ptzMoveRight', time);
    }
  }, {
    key: 'ptzMoveLeft',
    value: function ptzMoveLeft(time) {
      return this._ptz('ptzMoveLeft', time);
    }
  }, {
    key: 'ptzMoveTopLeft',
    value: function ptzMoveTopLeft(time) {
      return this._ptz('ptzMoveTopLeft', time);
    }
  }, {
    key: 'ptzMoveTopRight',
    value: function ptzMoveTopRight(time) {
      return this._ptz('ptzMoveTopRight', time);
    }
  }, {
    key: 'ptzMoveBottomLeft',
    value: function ptzMoveBottomLeft(time) {
      return this._ptz('ptzMoveBottomLeft', time);
    }
  }, {
    key: 'ptzMoveBottomRight',
    value: function ptzMoveBottomRight(time) {
      return this._ptz('ptzMoveBottomRight', time);
    }
  }, {
    key: 'ptzStopRun',
    value: function ptzStopRun() {
      return this._sendOrder({ cmd: 'ptzStopRun' });
    }
  }, {
    key: 'ptzReset',
    value: function ptzReset() {
      return this._sendOrder({ cmd: 'ptzReset' });
    }
  }, {
    key: 'getPTZSpeed',
    value: function getPTZSpeed() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._sendOrder({ cmd: 'getPTZSpeed' }).then(Foscam.response(resolve, reject, function (res) {
          return parseInt(res.speed[0], 10);
        }));
      });
    }
  }, {
    key: 'setPTZSpeed',
    value: function setPTZSpeed(speed) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (speed > 4 || speed < 0) {
          reject('Not valid speed');
        } else {
          _this2._sendOrder({
            cmd: 'setPTZSpeed',
            speed: speed
          }).then(Foscam.response(resolve, reject));
        }
      });
    }
  }, {
    key: 'zoomIn',
    value: function zoomIn(time) {
      return this._zoom('zoomIn', time);
    }
  }, {
    key: 'zoomOut',
    value: function zoomOut(time) {
      return this._zoom('zoomOut', time);
    }
  }, {
    key: 'zoomStop',
    value: function zoomStop() {
      return this._sendOrder({ cmd: 'zoomStop' });
    }
  }, {
    key: 'getZoomSpeed',
    value: function getZoomSpeed() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3._sendOrder({ cmd: 'getZoomSpeed' }).then(Foscam.response(resolve, reject, function (res) {
          return parseInt(res.speed[0], 10);
        }));
      });
    }
  }, {
    key: 'setZoomSpeed',
    value: function setZoomSpeed(speed) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (speed > 2 || speed < 0) {
          reject('Not valid speed');
        } else {
          _this4._sendOrder({
            cmd: 'setZoomSpeed',
            speed: speed
          }).then(Foscam.response(resolve, reject));
        }
      });
    }
  }, {
    key: 'getPTZPresetPointList',
    value: function getPTZPresetPointList() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5._sendOrder({ cmd: 'getPTZPresetPointList' }).then(Foscam.response(resolve, reject));
      });
    }
  }, {
    key: 'ptzAddPresetPoint',
    value: function ptzAddPresetPoint(name) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6._sendOrder({
          cmd: 'ptzAddPresetPoint',
          name: name
        }).then(Foscam.response(resolve, reject));
      });
    }
  }, {
    key: 'ptzDeletePresetPoint',
    value: function ptzDeletePresetPoint(name) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        _this7._sendOrder({
          cmd: 'ptzDeletePresetPoint',
          name: name
        }).then(Foscam.response(resolve, reject));
      });
    }
  }, {
    key: 'ptzGotoPresetPoint',
    value: function ptzGotoPresetPoint(name) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        _this8._sendOrder({
          cmd: 'ptzGotoPresetPoint',
          name: name
        }).then(Foscam.response(resolve, reject));
      });
    }
  }, {
    key: 'ptzStartCruise',
    value: function ptzStartCruise(mapName) {
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        _this9._sendOrder({
          cmd: 'ptzStartCruise',
          mapName: mapName
        }).then(Foscam.response(resolve, reject));
      });
    }
  }, {
    key: 'ptzStopCruise',
    value: function ptzStopCruise() {
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        _this10._sendOrder({ cmd: 'ptzStopCruise' }).then(Foscam.response(resolve, reject));
      });
    }
  }, {
    key: '_ptz',
    value: function _ptz(cmd, time) {
      return this._ptzTimer(cmd, time, this.ptzStopRun);
    }
  }, {
    key: '_zoom',
    value: function _zoom(cmd, time) {
      return this._ptzTimer(cmd, time, this.zoomStop);
    }
  }, {
    key: '_ptzTimer',
    value: function _ptzTimer(cmd, time, after) {
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        _this11._sendOrder({ cmd: cmd }).then(function (results) {
          var result = parseInt(results.result[0], 10);
          if (result === 0) {
            if (time) {
              setTimeout(function () {
                after().then(resolve).catch(reject);
              }, time);
            } else {
              resolve(result);
            }
          } else {
            reject(result);
          }
        }).catch(reject);
      });
    }
  }, {
    key: '_sendOrder',
    value: function _sendOrder(params) {
      var _this12 = this;

      return new Promise(function (resolve, reject) {
        http.request({
          hostname: _this12._hostname,
          port: _this12._port,
          path: _this12._buildPath(params),
          method: 'GET'
        }, function (res) {
          var answer = '';
          res.on('data', function (data) {
            answer += data.toString();
          });
          res.on('end', function () {
            _this12._xmlParse(answer).then(resolve).catch(reject);
          });
        }).on('error', reject).end();
      });
    }
  }, {
    key: '_buildPath',
    value: function _buildPath(params) {
      var path = '/cgi-bin/CGIProxy.fcgi?';
      var end = '&usr=' + this._usr + '&pwd=' + this._pwd;
      return path + querystring.stringify(params) + end;
    }
  }, {
    key: '_xmlParse',
    value: function _xmlParse(answer) {
      return new Promise(function (resolve, reject) {
        xml.parseString(answer, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result.CGI_Result);
          }
        });
      });
    }
  }], [{
    key: 'response',
    value: function response(resolve, reject) {
      var map = arguments.length <= 2 || arguments[2] === undefined ? function (res) {
        return res;
      } : arguments[2];

      return function (results) {
        if (parseInt(results.result[0], 10) === 0) {
          resolve(map(results));
        } else {
          reject(results);
        }
      };
    }
  }]);

  return Foscam;
}();

module.exports = Foscam;