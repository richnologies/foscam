'use strict'

/* eslint-env mocha */

const Promise = require('bluebird')

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const proxyquire = require('proxyquire')

const http = require('http')
const querystring = require('querystring')
const xml = require('xml2js')

const Foscam = proxyquire('../src/foscam', {
  http,
  querystring,
  xml
})

describe('Foscam module', () => {
  let error = new Error('Test Error!')
  describe('Options values', () => {
    it('should use the default values is none is provided', () => {
      let camera = new Foscam()
      expect(camera._hostname).to.be.equal('localhost')
      expect(camera._port).to.be.equal(80)
      expect(camera._usr).to.be.equal('admin')
      expect(camera._pwd).to.be.equal('root')
    })
    it('should use the provided values if so', () => {
      let options = {
        host: '127.0.0.1',
        port: 8080,
        usr: 'user',
        pwd: '123456'
      }
      let camera = new Foscam(options)
      expect(camera._hostname).to.be.equal(options.host)
      expect(camera._port).to.be.equal(options.port)
      expect(camera._usr).to.be.equal(options.usr)
      expect(camera._pwd).to.be.equal(options.pwd)
    })
  })
  describe('API', () => {
    it('should fulfill the PTZ interface', () => {
      expect(Foscam.prototype).to.have.property('ptzMoveUp')
      expect(Foscam.prototype).to.have.property('ptzMoveDown')
      expect(Foscam.prototype).to.have.property('ptzMoveRight')
      expect(Foscam.prototype).to.have.property('ptzMoveLeft')
      expect(Foscam.prototype).to.have.property('ptzMoveTopLeft')
      expect(Foscam.prototype).to.have.property('ptzMoveTopRight')
      expect(Foscam.prototype).to.have.property('ptzMoveTopRight')
      expect(Foscam.prototype).to.have.property('ptzMoveBottomLeft')
      expect(Foscam.prototype).to.have.property('ptzMoveBottomRight')
      expect(Foscam.prototype).to.have.property('ptzStopRun')
      expect(Foscam.prototype).to.have.property('ptzReset')
      expect(Foscam.prototype).to.have.property('getPTZSpeed')
      expect(Foscam.prototype).to.have.property('setPTZSpeed')
    })
    it('should fulfill the zoom interface', () => {
      expect(Foscam.prototype).to.have.property('zoomIn')
      expect(Foscam.prototype).to.have.property('zoomOut')
      expect(Foscam.prototype).to.have.property('zoomStop')
      expect(Foscam.prototype).to.have.property('getZoomSpeed')
      expect(Foscam.prototype).to.have.property('setZoomSpeed')
    })
    it('should fulfill the preset points interface', () => {
      expect(Foscam.prototype).to.have.property('getPTZPresetPointList')
      expect(Foscam.prototype).to.have.property('ptzAddPresetPoint')
      expect(Foscam.prototype).to.have.property('ptzDeletePresetPoint')
      expect(Foscam.prototype).to.have.property('ptzGotoPresetPoint')
    })
    it('should fulfill the cruise interface', () => {
      expect(Foscam.prototype).to.have.property('ptzStartCruise')
      expect(Foscam.prototype).to.have.property('ptzStopCruise')
    })
  })
  describe('PT move methods', () => {
    let camera = new Foscam({})
    let time = 25
    beforeEach(() => {
      sinon.stub(Foscam.prototype, '_ptz', (cmd, time) => Promise.resolve())
    })
    it('should call the _ptz for move up', () => {
      return camera.ptzMoveUp(time)
        .then(() => {
          expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveUp')
          expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time)
        })
    })
    it('should call the _ptz for move down', () => {
      return camera.ptzMoveDown(time)
        .then(() => {
          expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveDown')
          expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time)
        })
    })
    it('should call the _ptz for move right', () => {
      return camera.ptzMoveRight(time)
        .then(() => {
          expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveRight')
          expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time)
        })
    })
    it('should call the _ptz for move left', () => {
      return camera.ptzMoveLeft(time)
        .then(() => {
          expect(Foscam.prototype._ptz.args[0][0]).to.be.equal('ptzMoveLeft')
          expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time)
        })
    })
    it('should call the _ptz for move top left', () => {
      return camera.ptzMoveTopLeft(time)
        .then(() => {
          expect(Foscam.prototype._ptz.args[0][0])
            .to.be.equal('ptzMoveTopLeft')
          expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time)
        })
    })
    it('should call the _ptz for move top right', () => {
      return camera.ptzMoveTopRight(time)
        .then(() => {
          expect(Foscam.prototype._ptz.args[0][0])
            .to.be.equal('ptzMoveTopRight')
          expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time)
        })
    })
    it('should call the _ptz for move bottom left', () => {
      return camera.ptzMoveBottomLeft(time)
        .then(() => {
          expect(Foscam.prototype._ptz.args[0][0])
            .to.be.equal('ptzMoveBottomLeft')
          expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time)
        })
    })
    it('should call the _ptz for move bottom right', () => {
      return camera.ptzMoveBottomRight(time)
        .then(() => {
          expect(Foscam.prototype._ptz.args[0][0])
            .to.be.equal('ptzMoveBottomRight')
          expect(Foscam.prototype._ptz.args[0][1]).to.be.equal(time)
        })
    })
    afterEach(() => {
      Foscam.prototype._ptz.restore()
    })
  })
  describe('PTZ reset methods', () => {
    let camera = new Foscam({})
    beforeEach(() => {
      sinon.stub(Foscam.prototype, '_sendOrder', opts => Promise.resolve())
    })
    it('should call the _sendOrder for stop camera', () => {
      return camera.ptzStopRun()
        .then(() => {
          expect(Foscam.prototype._sendOrder.args[0][0].cmd)
            .to.be.equal('ptzStopRun')
        })
    })
    it('should call the _sendOrder for reset camera', () => {
      return camera.ptzReset()
        .then(() => {
          expect(Foscam.prototype._sendOrder.args[0][0].cmd)
            .to.be.equal('ptzReset')
        })
    })
    afterEach(() => Foscam.prototype._sendOrder.restore())
  })
  describe('#getPTZSpeed()', () => {
    let camera = new Foscam({})
    it('should resolve if the result is 0', () => {
      let speed = '2'
      let res = {
        result: ['0'],
        speed: [speed]
      }
      sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
      return expect(camera.getPTZSpeed())
        .to.eventually.equal(2)
    })
    it('should reject if the result is not 0', () => {
      let res = {result: ['1']}
      sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
      return expect(camera.getPTZSpeed()).to.be.rejected
    })
    afterEach(() => {
      Foscam.prototype._sendOrder.restore()
    })
  })
  describe('#setPTZSpeed()', () => {
    let camera = new Foscam({})
    it('should resolve if the result is 0 and the speed is right', () => {
      let res = {result: ['0']}
      sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
      return expect(camera.setPTZSpeed(0)).to.eventually.equal(res)
    })
    it('should reject if the speed is out of order', () => {
      let res = {result: ['0']}
      sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
      return expect(camera.setPTZSpeed(-1)).to.be.rejected
    })
    it('should reject if the result is not 0', () => {
      let res = {result: ['1']}
      sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
      return expect(camera.setPTZSpeed(0)).to.be.rejected
    })
    afterEach(() => {
      Foscam.prototype._sendOrder.restore()
    })
  })
  describe('Zoom methods', () => {
    let camera = new Foscam({})
    it('should call the _sendOrder for stop camera', () => {
      sinon.stub(Foscam.prototype, '_sendOrder', opts => Promise.resolve())
      return camera.zoomStop()
        .then(() => {
          expect(Foscam.prototype._sendOrder.args[0][0].cmd)
            .to.be.equal('zoomStop')
          Foscam.prototype._sendOrder.restore()
        })
    })
    it('should call the _zoom for stop camera', () => {
      let time = 100
      sinon.stub(Foscam.prototype, '_zoom', opts => Promise.resolve())
      return camera.zoomOut(time)
        .then(() => {
          expect(Foscam.prototype._zoom.args[0][0])
            .to.be.equal('zoomOut')
          expect(Foscam.prototype._zoom.args[0][1]).to.be.equal(time)
          Foscam.prototype._zoom.restore()
        })
    })
    it('should call the _zoom for stop camera', () => {
      let time = 100
      sinon.stub(Foscam.prototype, '_zoom', opts => Promise.resolve())
      return camera.zoomIn(time)
        .then(() => {
          expect(Foscam.prototype._zoom.args[0][0])
            .to.be.equal('zoomIn')
          expect(Foscam.prototype._zoom.args[0][1]).to.be.equal(time)
          Foscam.prototype._zoom.restore()
        })
    })
    describe('#getZoomSpeed()', () => {
      it('should resolve if the result is 0', () => {
        let speed = '2'
        let res = {
          result: ['0'],
          speed: [speed]
        }
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.getZoomSpeed())
          .to.eventually.equal(2)
      })
      it('should reject if the result is not 0', () => {
        let res = {result: ['1']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.getZoomSpeed()).to.be.rejected
      })
      afterEach(() => {
        Foscam.prototype._sendOrder.restore()
      })
    })
    describe('#setZoomSpeed()', () => {
      it('should resolve if the result is 0 and the speed is right', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.setZoomSpeed(0)).to.eventually.equal(res)
      })
      it('should reject if the speed is out of order', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.setZoomSpeed(-1)).to.be.rejected
      })
      it('should reject if the result is not 0', () => {
        let res = {result: ['1']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.setZoomSpeed(0)).to.be.rejected
      })
      afterEach(() => {
        Foscam.prototype._sendOrder.restore()
      })
    })
  })
  describe('Preset points methods', () => {
    let camera = new Foscam({})
    describe('#getPTZPresetPointList()', () => {
      it('should resolve if the result is 0', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.getPTZPresetPointList(''))
          .to.eventually.equal(res)
      })
      it('should reject if the result is not 0', () => {
        let res = {result: ['1']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.getPTZPresetPointList('')).to.be.rejected
      })
    })
    describe('#ptzAddPresetPoint()', () => {
      it('should resolve if the result is 0', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzAddPresetPoint('')).to.eventually.equal(res)
      })
      it('should reject if the result is not 0', () => {
        let res = {result: ['1']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzAddPresetPoint('')).to.be.rejected
      })
    })
    describe('#ptzDeletePresetPoint()', () => {
      it('should resolve if the result is 0', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzDeletePresetPoint('')).to.eventually.equal(res)
      })
      it('should reject if the result is not 0', () => {
        let res = {result: ['1']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzDeletePresetPoint('')).to.be.rejected
      })
    })
    describe('#ptzGotoPresetPoint()', () => {
      it('should resolve if the result is 0', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzGotoPresetPoint('')).to.eventually.equal(res)
      })
      it('should reject if the result is not 0', () => {
        let res = {result: ['1']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzGotoPresetPoint('')).to.be.rejected
      })
    })
    afterEach(() => {
      Foscam.prototype._sendOrder.restore()
    })
  })
  describe('Cruise methods', () => {
    let camera = new Foscam({})
    describe('#ptzStartCruise()', () => {
      it('should resolve if the result is 0', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzStartCruise('')).to.eventually.equal(res)
      })
      it('should reject if the result is not 0', () => {
        let res = {result: ['1']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzStartCruise('')).to.be.rejected
      })
    })
    describe('#ptzStopCruise()', () => {
      it('should resolve if the result is 0', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzStopCruise('')).to.eventually.equal(res)
      })
      it('should reject if the result is not 0', () => {
        let res = {result: ['1']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        return expect(camera.ptzStopCruise('')).to.be.rejected
      })
    })
    afterEach(() => {
      Foscam.prototype._sendOrder.restore()
    })
  })
  describe('Util methods', () => {
    describe('#_ptz()', () => {
      let camera = new Foscam({})
      it('should resolve if everything goes well', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        sinon.stub(Foscam.prototype, 'ptzStopRun', () => Promise.resolve(res))
        expect(camera._ptz('cmd')).to.eventually.equal(0)
        expect(Foscam.prototype.ptzStopRun.callCount).to.be.equal(0)
      })
      it.skip('should resolve if everything goes well with stop time', () => {
        let res = {
          result: ['0']
        }
        let time = 2
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        sinon.stub(Foscam.prototype, 'ptzStopRun', () => Promise.resolve(res))
        let promise = camera._ptz('cmd', time)
        return promise.then(result => {
          expect(result.result[0]).to.eventually.equal('0')
          expect(Foscam.prototype.ptzStopRun.callCount).to.be.equal(1)
        })
      })
      it('should reject if result is not 0', () => {
        let res = {
          result: ['1']
        }
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        sinon.stub(Foscam.prototype, 'ptzStopRun', () => Promise.resolve(res))
        return expect(camera._ptz('cmd', 2)).to.be.rejected
      })
      it('should reject if ptzStopRun fails', () => {
        let res = {
          result: ['0']
        }
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        sinon.stub(Foscam.prototype, 'ptzStopRun', () => Promise.reject(res))
        return expect(camera._ptz('cmd', 2)).to.be.rejected
      })
      it('should reject if _sendOrder fails', () => {
        let res = {
          result: ['0']
        }
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.reject(res))
        sinon.stub(Foscam.prototype, 'ptzStopRun', () => Promise.resolve(res))
        return expect(camera._ptz('cmd', 2)).to.be.rejected
      })
      afterEach(() => {
        Foscam.prototype._sendOrder.restore()
        Foscam.prototype.ptzStopRun.restore()
      })
    })
    describe('#_zoom()', () => {
      let camera = new Foscam({})
      it('should resolve if everything goes well', () => {
        let res = {result: ['0']}
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        sinon.stub(Foscam.prototype, 'zoomStop', () => Promise.resolve(res))
        expect(camera._zoom('cmd')).to.eventually.equal(0)
        expect(Foscam.prototype.zoomStop.callCount).to.be.equal(0)
      })
      it.skip('should resolve if everything goes well with stop time', () => {
        let res = {
          result: ['0']
        }
        let time = 2
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        sinon.stub(Foscam.prototype, 'zoomStop', () => Promise.resolve(res))
        let promise = camera._zoom('cmd', time)
        return promise.then((result) => {
          expect(promise.result).to.eventually.equal('0')
          expect(Foscam.prototype.zoomStop.callCount).to.be.equal(1)
        })
      })
      it('should reject if result is not 0', () => {
        let res = {
          result: ['1']
        }
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        sinon.stub(Foscam.prototype, 'zoomStop', () => Promise.resolve(res))
        return expect(camera._zoom('cmd', 2)).to.be.rejected
      })
      it('should reject if zoomStop fails', () => {
        let res = {
          result: ['0']
        }
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.resolve(res))
        sinon.stub(Foscam.prototype, 'zoomStop', () => Promise.reject(res))
        return expect(camera._zoom('cmd', 2)).to.be.rejected
      })
      it('should reject if _sendOrder fails', () => {
        let res = {
          result: ['0']
        }
        sinon.stub(Foscam.prototype, '_sendOrder', () => Promise.reject(res))
        sinon.stub(Foscam.prototype, 'zoomStop', () => Promise.resolve(res))
        return expect(camera._zoom('cmd', 2)).to.be.rejected
      })
      afterEach(() => {
        Foscam.prototype._sendOrder.restore()
        Foscam.prototype.zoomStop.restore()
      })
    })
    describe('#_sendOrder()', () => {
      let camera = new Foscam({})
      let data = `
        <CGI_Result>
            <result>7</result>
        </CGI_Result>
      `
      let res = {
        on: () => {},
        end: sinon.spy()
      }
      it('should resolve to the result if everything goes well', () => {
        sinon.stub(http, 'request', (opts, cb) => {
          cb(res)
          return res
        })
        sinon.stub(res, 'on', (ev, cb) => {
          switch (ev) {
            case 'error':
              break
            case 'data':
              cb(data)
              break
            case 'end':
              cb()
              break
            default:
              break
          }
          return res
        })
        return expect(camera._sendOrder()).to.eventually.eql({
          result: ['7']
        })
      })
      it('should reject if response object emits an error event', () => {
        sinon.stub(http, 'request', (opts, cb) => {
          cb(res)
          return res
        })
        sinon.stub(res, 'on', (ev, cb) => {
          switch (ev) {
            case 'error':
              cb(error)
              break
            case 'data':
            case 'end':
            default:
              break
          }
          return res
        })
        return expect(camera._sendOrder()).to.be.rejectedWith(error)
      })
      it.skip('should reject if the xmlParse fails', () => {
        sinon.stub(Foscam.prototype, '_xmlParse', () => Promise.reject(error))
        sinon.stub(http, 'request', (opts, cb) => {
          cb(res)
          return res
        })
        sinon.stub(res, 'on', (ev, cb) => {
          switch (ev) {
            case 'error':
              break
            case 'data':
              cb(data)
              break
            case 'end':
              cb()
              break
            default:
              break
          }
          return res
        })
        let promise = camera._sendOrder()
          .catch(() => {
            Foscam.prototype._xmlParse.restore()
          })
        return expect(promise).to.be.rejected
      })
      afterEach(() => {
        res.on.restore()
        http.request.restore()
      })
    })
    describe('#_buildPath()', () => {
      let camera = new Foscam({})
      it('should mount the path correctly when call with params', () => {
        let path = camera._buildPath({
          cmd: 'ptzStartCruise'
        })
        expect(path).to.be.equal(
          '/cgi-bin/CGIProxy.fcgi?cmd=ptzStartCruise&usr=admin&pwd=root')
      })
    })
    describe('#_xmlParse()', () => {
      let camera = new Foscam({})
      let cgi = 'result'
      let answer = 'answer'
      it('should return a Promise', () => {
        sinon.stub(xml, 'parseString', (answer, cb) => cb(null, true))
        expect(camera._xmlParse()).to.be.instanceof(Promise)
      })
      it('should resolve if the parseString method goes well', () => {
        let result = {
          CGI_Result: cgi // eslint-disable-line camelcase
        }
        sinon.stub(xml, 'parseString', (answer, cb) => cb(null, result))
        return expect(camera._xmlParse(answer)).to.eventually.equal(cgi)
      })
      it('should parse correctly the XML returned by the camera', () => {
        answer = `
          <CGI_Result>
              <result>7</result>
          </CGI_Result>
        `
        return expect(camera._xmlParse(answer)).to.eventually.eql({
          result: ['7']
        })
      })
      it('should resolve undefined if the result dont have GCI_Result', () => {
        let result = {}
        sinon.stub(xml, 'parseString', (answer, cb) => cb(null, result))
        return expect(camera._xmlParse(answer)).to.eventually.equal(undefined)
      })
      it('should reject if the parseString method fails', () => {
        sinon.stub(xml, 'parseString', (answer, cb) => cb(error, null))
        return expect(camera._xmlParse(answer)).to.be.rejectedWith(error)
      })
      afterEach(() => {
        if (xml.parseString.restore) {
          xml.parseString.restore()
        }
      })
    })
  })
})
