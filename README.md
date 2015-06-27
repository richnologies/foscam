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

//The camera will move right for 4 seconds and the it will stop
myCamera.ptzMoveRight(4000);

```

## Methods

### constructor ( properties )

In order to connect to the camera you first need to provide its access details. This will create an object for that particular camera. You can create as much objects as you need, so you can control multiple cameras. 

name | type   | default       | description
-----|--------|---------------|----------------------
host | string | localhost     | Camera IP or hostname
port | number | 80            | Camera port number
usr  | string | admin         | Username
pwd  | string | root          | Password


```js

var myCamera = new Foscam({
  host: 'your-camera-ip',
  port: 80,
  usr: 'your-user',
  pwd: 'your-password
});

```
