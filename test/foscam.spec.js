'use strict';

/* eslint-disable max-nested-callbacks */

var Promise = require('bluebird');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var proxyquire = require('proxyquire');

var http = require('http');
var querystring = require('querystring');
var xml = require('xml2js');

var Foscam = proxyquire('../index', {
  http: http,
  querystring: querystring,
  xml: xml
});

describe('Foscam module', function () {
  var error = new Error('Test Error!');
  describe('Options values', function () {
    it('should use the default values is none is provided', function () {
      var camera = new Foscam();
      expect(camera._hostname).to.be.equal('localhost');
      expect(camera._port).to.be.equal(80);
      expect(camera._usr).to.be.equal('admin');
      expect(camera._pwd).to.be.equal('root');
    });
    it('should use the provided values if so', function () {
      var options = {
        host: '127.0.0.1',
        port: 8080,
        usr: 'user',
        pwd: '123456'
      };
      var camera = new Foscam(options);
      expect(camera._hostname).to.be.equal(options.host);
      expect(camera._port).to.be.equal(options.port);
      expect(camera._usr).to.be.equal(options.usr);
      expect(camera._pwd).to.be.equal(options.pwd);
    });
  });
  describe('API', function () {
    it('should fulfill the PTZ interface', function () {
      expect(Foscam.prototype).to.have.property('ptzMoveUp');
      expect(Foscam.prototype).to.have.property('ptzMoveDown');
      expect(Foscam.prototype).to.have.property('ptzMoveRight');
      expect(Foscam.prototype).to.have.property('ptzMoveLeft');
      expect(Foscam.prototype).to.have.property('ptzMoveTopLeft');
      expect(Foscam.prototype).to.have.property('ptzMoveTopRight');
      expect(Foscam.prototype).to.have.property('ptzMoveTopRight');
      expect(Foscam.prototype).to.have.property('ptzMoveBottomLeft');
      expect(Foscam.prototype).to.have.property('ptzMoveBottomRight');
      expect(Foscam.prototype).to.have.property('ptzStopRun');
      expect(Foscam.prototype).to.have.property('ptzReset');
      expect(Foscam.prototype).to.have.property('getPTZSpeed');
      expect(Foscam.prototype).to.have.property('setPTZSpeed');
    });
    it('should fulfill the zoom interface', function () {
      expect(Foscam.prototype).to.have.property('zoomIn');
      expect(Foscam.prototype).to.have.property('zoomOut');
      expect(Foscam.prototype).to.have.property('zoomStop');
      expect(Foscam.prototype).to.have.property('getZoomSpeed');
      expect(Foscam.prototype).to.have.property('setZoomSpeed');
    });
    it('should fulfill the preset points interface', function () {
      expect(Foscam.prototype).to.have.property('getPTZPresetPointList');
      expect(Foscam.prototype).to.have.property('ptzAddPresetPoint');
      expect(Foscam.prototype).to.have.property('ptzDeletePresetPoint');
      expect(Foscam.prototype).to.have.property('ptzGotoPresetPoint');
    });
    it('should fulfill the cruise interface', function () {
      expect(Foscam.prototype).to.have.property('ptzStartCruise');
      expect(Foscam.prototype).to.have.property('ptzStopCruise');
    });
  });
  describe('PT move methods', function () {
    var camera = new Foscam({});
    var time = 25;
    beforeEach(function () {
      sinon.stub(Foscam.prototype, '_ptz', function (cmd, time) {
        return Promise.resolve();
      });
    });
    it('should call the _ptz for move up', function () {
      return camera.ptzMoveUp(time).then(function () {
        expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveUp');
        expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time);
      });
    });
    it('should call the _ptz for move down', function () {
      return camera.ptzMoveDown(time).then(function () {
        expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveDown');
        expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time);
      });
    });
    it('should call the _ptz for move right', function () {
      return camera.ptzMoveRight(time).then(function () {
        expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveRight');
        expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time);
      });
    });
    it('should call the _ptz for move left', function () {
      return camera.ptzMoveLeft(time).then(function () {
        expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveLeft');
        expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time);
      });
    });
    it('should call the _ptz for move top left', function () {
      return camera.ptzMoveTopLeft(time).then(function () {
        expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveTopLeft');
        expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time);
      });
    });
    it('should call the _ptz for move top right', function () {
      return camera.ptzMoveTopRight(time).then(function () {
        expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveTopRight');
        expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time);
      });
    });
    it('should call the _ptz for move bottom left', function () {
      return camera.ptzMoveBottomLeft(time).then(function () {
        expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveBottomLeft');
        expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time);
      });
    });
    it('should call the _ptz for move bottom right', function () {
      return camera.ptzMoveBottomRight(time).then(function () {
        expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveBottomRight');
        expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time);
      });
    });
    afterEach(function () {
      Foscam.prototype._ptz.restore();
    });
  });
  describe('PTZ reset methods', function () {
    var camera = new Foscam({});
    beforeEach(function () {
      sinon.stub(Foscam.prototype, '_sendOrder', function (opts) {
        return Promise.resolve();
      });
    });
    it('should call the _sendOrder for stop camera', function () {
      return camera.ptzStopRun().then(function () {
        expect(Foscam.prototype._sendOrder.args[0][0].cmd).to.be.equal('ptzStopRun');
      });
    });
    it('should call the _sendOrder for reset camera', function () {
      return camera.ptzReset().then(function () {
        expect(Foscam.prototype._sendOrder.args[0][0].cmd).to.be.equal('ptzReset');
      });
    });
    afterEach(function () {
      return Foscam.prototype._sendOrder.restore();
    });
  });
  describe('#getPTZSpeed()', function () {
    var camera = new Foscam({});
    it('should resolve if the result is 0', function () {
      var speed = '2';
      var res = {
        result: ['0'],
        speed: [speed]
      };
      sinon.stub(Foscam.prototype, '_sendOrder', function () {
        return Promise.resolve(res);
      });
      return expect(camera.getPTZSpeed()).to.eventually.equal(2);
    });
    it('should reject if the result is not 0', function () {
      var res = { result: ['1'] };
      sinon.stub(Foscam.prototype, '_sendOrder', function () {
        return Promise.resolve(res);
      });
      return expect(camera.getPTZSpeed()).to.be.rejected;
    });
    afterEach(function () {
      Foscam.prototype._sendOrder.restore();
    });
  });
  describe('#setPTZSpeed()', function () {
    var camera = new Foscam({});
    it('should resolve if the result is 0 and the speed is right', function () {
      var res = { result: ['0'] };
      sinon.stub(Foscam.prototype, '_sendOrder', function () {
        return Promise.resolve(res);
      });
      return expect(camera.setPTZSpeed(0)).to.eventually.equal(res);
    });
    it('should reject if the speed is out of order', function () {
      var res = { result: ['0'] };
      sinon.stub(Foscam.prototype, '_sendOrder', function () {
        return Promise.resolve(res);
      });
      return expect(camera.setPTZSpeed(-1)).to.be.rejected;
    });
    it('should reject if the result is not 0', function () {
      var res = { result: ['1'] };
      sinon.stub(Foscam.prototype, '_sendOrder', function () {
        return Promise.resolve(res);
      });
      return expect(camera.setPTZSpeed(0)).to.be.rejected;
    });
    afterEach(function () {
      Foscam.prototype._sendOrder.restore();
    });
  });
  describe('Zoom methods', function () {
    var camera = new Foscam({});
    it('should call the _sendOrder for stop camera', function () {
      sinon.stub(Foscam.prototype, '_sendOrder', function (opts) {
        return Promise.resolve();
      });
      return camera.zoomStop().then(function () {
        expect(Foscam.prototype._sendOrder.args[0][0].cmd).to.be.equal('zoomStop');
        Foscam.prototype._sendOrder.restore();
      });
    });
    it('should call the _zoom for stop camera', function () {
      var time = 100;
      sinon.stub(Foscam.prototype, '_zoom', function (opts) {
        return Promise.resolve();
      });
      return camera.zoomOut(time).then(function () {
        expect(Foscam.prototype._zoom.args[0][0]).to.be.equal('zoomOut');
        expect(Foscam.prototype._zoom.args[0][1]).to.be.equal(time);
        Foscam.prototype._zoom.restore();
      });
    });
    it('should call the _zoom for stop camera', function () {
      var time = 100;
      sinon.stub(Foscam.prototype, '_zoom', function (opts) {
        return Promise.resolve();
      });
      return camera.zoomIn(time).then(function () {
        expect(Foscam.prototype._zoom.args[0][0]).to.be.equal('zoomIn');
        expect(Foscam.prototype._zoom.args[0][1]).to.be.equal(time);
        Foscam.prototype._zoom.restore();
      });
    });
    describe('#getZoomSpeed()', function () {
      it('should resolve if the result is 0', function () {
        var speed = '2';
        var res = {
          result: ['0'],
          speed: [speed]
        };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.getZoomSpeed()).to.eventually.equal(2);
      });
      it('should reject if the result is not 0', function () {
        var res = { result: ['1'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.getZoomSpeed()).to.be.rejected;
      });
      afterEach(function () {
        Foscam.prototype._sendOrder.restore();
      });
    });
    describe('#setZoomSpeed()', function () {
      it('should resolve if the result is 0 and the speed is right', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.setZoomSpeed(0)).to.eventually.equal(res);
      });
      it('should reject if the speed is out of order', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.setZoomSpeed(-1)).to.be.rejected;
      });
      it('should reject if the result is not 0', function () {
        var res = { result: ['1'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.setZoomSpeed(0)).to.be.rejected;
      });
      afterEach(function () {
        Foscam.prototype._sendOrder.restore();
      });
    });
  });
  describe('Preset points methods', function () {
    var camera = new Foscam({});
    describe('#getPTZPresetPointList()', function () {
      it('should resolve if the result is 0', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.getPTZPresetPointList('')).to.eventually.equal(res);
      });
      it('should reject if the result is not 0', function () {
        var res = { result: ['1'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.getPTZPresetPointList('')).to.be.rejected;
      });
    });
    describe('#ptzAddPresetPoint()', function () {
      it('should resolve if the result is 0', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzAddPresetPoint('')).to.eventually.equal(res);
      });
      it('should reject if the result is not 0', function () {
        var res = { result: ['1'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzAddPresetPoint('')).to.be.rejected;
      });
    });
    describe('#ptzDeletePresetPoint()', function () {
      it('should resolve if the result is 0', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzDeletePresetPoint('')).to.eventually.equal(res);
      });
      it('should reject if the result is not 0', function () {
        var res = { result: ['1'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzDeletePresetPoint('')).to.be.rejected;
      });
    });
    describe('#ptzGotoPresetPoint()', function () {
      it('should resolve if the result is 0', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzGotoPresetPoint('')).to.eventually.equal(res);
      });
      it('should reject if the result is not 0', function () {
        var res = { result: ['1'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzGotoPresetPoint('')).to.be.rejected;
      });
    });
    afterEach(function () {
      Foscam.prototype._sendOrder.restore();
    });
  });
  describe('Cruise methods', function () {
    var camera = new Foscam({});
    describe('#ptzStartCruise()', function () {
      it('should resolve if the result is 0', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzStartCruise('')).to.eventually.equal(res);
      });
      it('should reject if the result is not 0', function () {
        var res = { result: ['1'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzStartCruise('')).to.be.rejected;
      });
    });
    describe('#ptzStopCruise()', function () {
      it('should resolve if the result is 0', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzStopCruise('')).to.eventually.equal(res);
      });
      it('should reject if the result is not 0', function () {
        var res = { result: ['1'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        return expect(camera.ptzStopCruise('')).to.be.rejected;
      });
    });
    afterEach(function () {
      Foscam.prototype._sendOrder.restore();
    });
  });
  describe('Util methods', function () {
    describe('#_ptz()', function () {
      var camera = new Foscam({});
      it('should resolve if everything goes well', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        sinon.stub(Foscam.prototype, 'ptzStopRun', function () {
          return Promise.resolve(res);
        });
        expect(camera._ptz('cmd')).to.eventually.equal('0');
        expect(Foscam.prototype.ptzStopRun.callCount).to.be.equal(0);
      });
      it('should resolve if everything goes well with stop time', function () {
        var res = {
          result: ['0']
        };
        var time = 2;
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        sinon.stub(Foscam.prototype, 'ptzStopRun', function () {
          return Promise.resolve(res);
        });
        var promise = camera._ptz('cmd', time);
        return promise.then(function () {
          expect(promise).to.eventually.equal('0');
          expect(Foscam.prototype.ptzStopRun.callCount).to.be.equal(1);
        });
      });
      it('should reject if result is not 0', function () {
        var res = {
          result: ['1']
        };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        sinon.stub(Foscam.prototype, 'ptzStopRun', function () {
          return Promise.resolve(res);
        });
        return expect(camera._ptz('cmd', 2)).to.be.rejected;
      });
      it('should reject if ptzStopRun fails', function () {
        var res = {
          result: ['0']
        };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        sinon.stub(Foscam.prototype, 'ptzStopRun', function () {
          return Promise.reject(res);
        });
        return expect(camera._ptz('cmd', 2)).to.be.rejected;
      });
      it('should reject if _sendOrder fails', function () {
        var res = {
          result: ['0']
        };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.reject(res);
        });
        sinon.stub(Foscam.prototype, 'ptzStopRun', function () {
          return Promise.resolve(res);
        });
        return expect(camera._ptz('cmd', 2)).to.be.rejected;
      });
      afterEach(function () {
        Foscam.prototype._sendOrder.restore();
        Foscam.prototype.ptzStopRun.restore();
      });
    });
    describe('#_zoom()', function () {
      var camera = new Foscam({});
      it('should resolve if everything goes well', function () {
        var res = { result: ['0'] };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        sinon.stub(Foscam.prototype, 'zoomStop', function () {
          return Promise.resolve(res);
        });
        expect(camera._zoom('cmd')).to.eventually.equal('0');
        expect(Foscam.prototype.zoomStop.callCount).to.be.equal(0);
      });
      it('should resolve if everything goes well with stop time', function () {
        var res = {
          result: ['0']
        };
        var time = 2;
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        sinon.stub(Foscam.prototype, 'zoomStop', function () {
          return Promise.resolve(res);
        });
        var promise = camera._zoom('cmd', time);
        return promise.then(function () {
          expect(promise).to.eventually.equal('0');
          expect(Foscam.prototype.zoomStop.callCount).to.be.equal(1);
        });
      });
      it('should reject if result is not 0', function () {
        var res = {
          result: ['1']
        };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        sinon.stub(Foscam.prototype, 'zoomStop', function () {
          return Promise.resolve(res);
        });
        return expect(camera._zoom('cmd', 2)).to.be.rejected;
      });
      it('should reject if zoomStop fails', function () {
        var res = {
          result: ['0']
        };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.resolve(res);
        });
        sinon.stub(Foscam.prototype, 'zoomStop', function () {
          return Promise.reject(res);
        });
        return expect(camera._zoom('cmd', 2)).to.be.rejected;
      });
      it('should reject if _sendOrder fails', function () {
        var res = {
          result: ['0']
        };
        sinon.stub(Foscam.prototype, '_sendOrder', function () {
          return Promise.reject(res);
        });
        sinon.stub(Foscam.prototype, 'zoomStop', function () {
          return Promise.resolve(res);
        });
        return expect(camera._zoom('cmd', 2)).to.be.rejected;
      });
      afterEach(function () {
        Foscam.prototype._sendOrder.restore();
        Foscam.prototype.zoomStop.restore();
      });
    });
    describe('#_sendOrder()', function () {
      var camera = new Foscam({});
      var data = '\n        <CGI_Result>\n            <result>7</result>\n        </CGI_Result>\n      ';
      var res = {
        on: function on() {},
        end: sinon.spy()
      };
      it('should resolve to the result if everything goes well', function () {
        sinon.stub(http, 'request', function (opts, cb) {
          cb(res);
          return res;
        });
        sinon.stub(res, 'on', function (ev, cb) {
          switch (ev) {
            case 'error':
              break;
            case 'data':
              cb(data);
              break;
            case 'end':
              cb();
              break;
            default:
              break;
          }
          return res;
        });
        return expect(camera._sendOrder()).to.eventually.eql({
          result: ['7']
        });
      });
      it('should reject if response object emits an error event', function () {
        sinon.stub(http, 'request', function (opts, cb) {
          cb(res);
          return res;
        });
        sinon.stub(res, 'on', function (ev, cb) {
          switch (ev) {
            case 'error':
              cb(error);
              break;
            case 'data':
            case 'end':
            default:
              break;
          }
          return res;
        });
        return expect(camera._sendOrder()).to.be.rejectedWith(error);
      });
      it('should reject if the xmlParse fails', function (done) {
        sinon.stub(Foscam.prototype, '_xmlParse', function () {
          return Promise.reject(error);
        });
        sinon.stub(http, 'request', function (opts, cb) {
          cb(res);
          return res;
        });
        sinon.stub(res, 'on', function (ev, cb) {
          switch (ev) {
            case 'error':
              break;
            case 'data':
              cb(data);
              break;
            case 'end':
              cb();
              break;
            default:
              break;
          }
          return res;
        });
        var promise = camera._sendOrder().catch(function () {
          Foscam.prototype._xmlParse.restore();
          done();
        });
        return expect(promise).to.be.rejected;
      });
      afterEach(function () {
        res.on.restore();
        http.request.restore();
      });
    });
    describe('#_buildPath()', function () {
      var camera = new Foscam({});
      it('should mount the path correctly when call with params', function () {
        var path = camera._buildPath({
          cmd: 'ptzStartCruise'
        });
        expect(path).to.be.equal('/cgi-bin/CGIProxy.fcgi?cmd=ptzStartCruise&usr=admin&pwd=root');
      });
    });
    describe('#_xmlParse()', function () {
      var camera = new Foscam({});
      var cgi = 'result';
      var answer = 'answer';
      it('should return a Promise', function () {
        sinon.stub(xml, 'parseString', function (answer, cb) {
          return cb(null, true);
        });
        expect(camera._xmlParse()).to.be.instanceof(Promise);
      });
      it('should resolve if the parseString method goes well', function () {
        var result = {
          CGI_Result: cgi // eslint-disable-line camelcase
        };
        sinon.stub(xml, 'parseString', function (answer, cb) {
          return cb(null, result);
        });
        return expect(camera._xmlParse(answer)).to.eventually.equal(cgi);
      });
      it('should parse correctly the XML returned by the camera', function () {
        answer = '\n          <CGI_Result>\n              <result>7</result>\n          </CGI_Result>\n        ';
        return expect(camera._xmlParse(answer)).to.eventually.eql({
          result: ['7']
        });
      });
      it('should resolve undefined if the result dont have GCI_Result', function () {
        var result = {};
        sinon.stub(xml, 'parseString', function (answer, cb) {
          return cb(null, result);
        });
        return expect(camera._xmlParse(answer)).to.eventually.equal(undefined);
      });
      it('should reject if the parseString method fails', function () {
        sinon.stub(xml, 'parseString', function (answer, cb) {
          return cb(error, null);
        });
        return expect(camera._xmlParse(answer)).to.be.rejectedWith(error);
      });
      afterEach(function () {
        if (xml.parseString.restore) {
          xml.parseString.restore();
        }
      });
    });
  });
});