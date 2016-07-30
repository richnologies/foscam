'use strict';

const Promise = require('bluebird');

const http = require('http');
const querystring = require('querystring');
const xml = require('xml2js');

class Foscam {

  constructor(options = {}) {
    this._hostname = options.host || 'localhost';
    this._port = options.port || 80;
    this._usr = options.usr || 'admin';
    this._pwd = options.pwd || 'root';
  }

  ptzMoveUp(time) {
    return this._ptz('ptzMoveUp', time);
  }

  ptzMoveDown(time) {
    return this._ptz('ptzMoveDown', time);
  }

  ptzMoveRight(time) {
    return this._ptz('ptzMoveRight', time);
  }

  ptzMoveLeft(time) {
    return this._ptz('ptzMoveLeft', time);
  }

  ptzMoveTopLeft(time) {
    return this._ptz('ptzMoveTopLeft', time);
  }

  ptzMoveTopRight(time) {
    return this._ptz('ptzMoveTopRight', time);
  }

  ptzMoveBottomLeft(time) {
    return this._ptz('ptzMoveBottomLeft', time);
  }

  ptzMoveBottomRight(time) {
    return this._ptz('ptzMoveBottomRight', time);
  }

  ptzStopRun() {
    return this._sendOrder({cmd: 'ptzStopRun'});
  }

  ptzReset() {
    return this._sendOrder({cmd: 'ptzReset'});
  }

  getPTZSpeed() {
    return new Promise((resolve, reject) => {
      this._sendOrder({cmd: 'getPTZSpeed'})
        .then(Foscam.response(
          resolve, reject, res => parseInt(res.speed[0], 10)));
    });
  }

  setPTZSpeed(speed) {
    return new Promise((resolve, reject) => {
      if (speed > 4 || speed < 0) {
        reject('Not valid speed');
      } else {
        this
          ._sendOrder({
            cmd: 'setPTZSpeed',
            speed: speed
          })
          .then(Foscam.response(resolve, reject));
      }
    });
  }

  zoomIn(time) {
    return this._zoom('zoomIn', time);
  }

  zoomOut(time) {
    return this._zoom('zoomOut', time);
  }

  zoomStop() {
    return this._sendOrder({cmd: 'zoomStop'});
  }

  getZoomSpeed() {
    return new Promise((resolve, reject) => {
      this
        ._sendOrder({cmd: 'getZoomSpeed'})
        .then(Foscam.response(
          resolve, reject, res => parseInt(res.speed[0], 10)));
    });
  }

  setZoomSpeed(speed) {
    return new Promise((resolve, reject) => {
      if (speed > 2 || speed < 0) {
        reject('Not valid speed');
      } else {
        this
          ._sendOrder({
            cmd: 'setZoomSpeed',
            speed: speed
          })
          .then(Foscam.response(resolve, reject));
      }
    });
  }

  getPTZPresetPointList() {
    return new Promise((resolve, reject) => {
      this
        ._sendOrder({cmd: 'getPTZPresetPointList'})
        .then(Foscam.response(resolve, reject));
    });
  }

  ptzAddPresetPoint(name) {
    return new Promise((resolve, reject) => {
      this
        ._sendOrder({
          cmd: 'ptzAddPresetPoint',
          name: name
        })
        .then(Foscam.response(resolve, reject));
    });
  }

  ptzDeletePresetPoint(name) {
    return new Promise((resolve, reject) => {
      this
        ._sendOrder({
          cmd: 'ptzDeletePresetPoint',
          name: name
        })
        .then(Foscam.response(resolve, reject));
    });
  }

  ptzGotoPresetPoint(name) {
    return new Promise((resolve, reject) => {
      this
        ._sendOrder({
          cmd: 'ptzGotoPresetPoint',
          name: name
        })
        .then(Foscam.response(resolve, reject));
    });
  }

  ptzStartCruise(mapName) {
    return new Promise((resolve, reject) => {
      this
        ._sendOrder({
          cmd: 'ptzStartCruise',
          mapName: mapName
        })
        .then(Foscam.response(resolve, reject));
    });
  }

  ptzStopCruise() {
    return new Promise((resolve, reject) => {
      this
        ._sendOrder({cmd: 'ptzStopCruise'})
        .then(Foscam.response(resolve, reject));
    });
  }

  _ptz(cmd, time) {
    return this._ptzTimer(cmd, time, this.ptzStopRun);
  }

  _zoom(cmd, time) {
    return this._ptzTimer(cmd, time, this.zoomStop);
  }

  _ptzTimer(cmd, time, after) {
    return new Promise((resolve, reject) => {
      this
        ._sendOrder({cmd: cmd})
        .then(results => {
          let result = parseInt(results.result[0], 10);
          if (result === 0) {
            if (time) {
              setTimeout(() => {
                after()
                  .then(resolve)
                  .catch(reject);
              }, time);
            } else {
              resolve(result);
            }
          } else {
            reject(result);
          }
        })
        .catch(reject);
    });
  }

  _sendOrder(params) {
    return new Promise((resolve, reject) => {
      http
        .request({
          hostname: this._hostname,
          port: this._port,
          path: this._buildPath(params),
          method: 'GET'
        }, res => {
          let answer = '';
          res.on('data', data => {
            answer += data.toString();
          });
          res.on('end', () => {
            this._xmlParse(answer)
              .then(resolve)
              .catch(reject);
          });
        })
        .on('error', reject)
        .end();
    });
  }

  _buildPath(params) {
    let path = '/cgi-bin/CGIProxy.fcgi?';
    let end = '&usr=' + this._usr + '&pwd=' + this._pwd;
    return path + querystring.stringify(params) + end;
  }

  _xmlParse(answer) {
    return new Promise((resolve, reject) => {
      xml.parseString(answer, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.CGI_Result);
        }
      });
    });
  }

  static response(resolve, reject, map = res => res) {
    return function(results) {
      if (parseInt(results.result[0], 10) === 0) {
        resolve(map(results));
      } else {
        reject(results);
      }
    };
  }

}

module.exports = Foscam;
