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

### ptzMoveUp ( [time] )

In order to connect to the camera you first need to provide its access details. This will create an object for that particular camera. You can create as much objects as you need, so you can control multiple cameras. 

name | type   | default       | description
-----|--------|---------------|----------------------
time | int    |               | Value in miliseconds before stop


```js

//The camera will move Up for 2 seconds
myCamera.ptzMoveUp(2000);

```

### ptzMoveDown ( [time] )
### ptzMoveRight ( [time] )
### ptzMoveLeft ( [time] )
### ptzMoveTopLeft ( [time] )
### ptzMoveTopRight ( [time] )
### ptzMoveBottomLeft ( [time] )
### ptzMoveBottomRight ( [time] )
### ptzStopRun ( )
### ptzReset ( )

### getPTZSpeed ( )

Returns the current of pan/tilt speed of the camera. They are 5 possible values

  - 0 -> Very Slow
  - 1 -> Slow
  - 2 -> Normal
  - 3 -> Fast
  - 4 -> Very Fast

```js

//The camera will move Up for 2 seconds
myCamera
  .getPTZSpeed()
  .then(function(speed) {
    //DO WHAT YOU NEED WITH THE SPEED
  });

```

### setPTZSpeed ( speed )

This method allow you to set the speed of the camera. Valid values comes from 0 to 4, being 0 the slowest and 4 the fastest speed. 

name  | type   | default       | description
------|--------|---------------|----------------------
speed | int    |               | Speed you want for the camera


```js

//The camera will move Up for 2 seconds
myCamera
  .setPTZSpeed(2)
  .then(function() {
    //NOW THE SPEED IS NORMAL
  });

```
