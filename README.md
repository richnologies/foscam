# foscam cgi

Implementation in Javascript of the Foscam IPCamera CGI Proxy API.
The aim is to be able to control the camera from NodeJS. 

## Usage

```js
var myCamera = new Foscam({
  host: 'your-camera-ip',
  port: 'your-camera-port',
  usr: 'your-user',
  pwd: 'your-password
});

foscam.ptzMoveRight(4000); //The camera will move right for 4 seconds and the it will stop

```
