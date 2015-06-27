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

myCamera
  .ptzMoveRight(4000)
  .then(function(){
    //DO SOMETHING AFTER THE CAMERA HAS MOVED FOR 4 SECONDS
  });




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

Most of the methos are based on promises. To move the camera, you just call the corresponding method, optionally indicating for how long you want the camera to move

name | type   | default       | description
-----|--------|---------------|----------------------
time | int    |               | Value in miliseconds before stop


```js

//The camera will move Up for 2 seconds
myCamera
  .ptzMoveUp(2000)
  .then(function() {
    //THE CAMERA ALREDY MOVES FOR 2 SECONDS
  );

```

Next methods are equivalent, just change the action they send to the camera. I think names are self explanatory.

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

Update the speed of the camera. Valid values comes from 0 to 4, being 0 the slowest and 4 the fastest. 

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

### getPTZPresetPointList ( )

Returns the count of how many presets the camera has and a list with the names of all of the points

```js

//The camera will move Up for 2 seconds
myCamera
  .getPTZPresetPointList()
  .then(function(results) {
    //DO WHAT YOU NEED WITH THE RESULTS
  });

```

### ptzAddPresetPoint ( name )

Add a new preset point with the given name. The preset point is the current position of the camera, including its pan/tilt/zoom. 

name  | type   | default       | description
------|--------|---------------|----------------------
name  | string |               | The name for the preset point


```js

myCamera
  .ptzAddPresetPoint('MyPresetPoint')
  .then(function() {
    //YOUR POINT HAS BEEN ADDED
  });

```

### ptzDeletePresetPoint ( name )

Deletes the preset with the given name

name  | type   | default       | description
------|--------|---------------|----------------------
name  | string |               | The name for the preset point


```js

myCamera
  .ptzDeletePresetPoint('MyPresetPoint')
  .then(function() {
    //YOUR POINT HAS BEEN DELETED
  });

```

### ptzGotoPresetPoint ( name )

The camera moves to the preset with the given name

name  | type   | default       | description
------|--------|---------------|----------------------
name  | string |               | The name for the preset point


```js

myCamera
  .ptzGotoPresetPoint('MyPresetPoint')
  .then(function() {
    //WARNING! AT THIS POINT THE CAMERA IS NOT AT THE PRESET POINT
    //ITS JUST MOVING TOWARD IT
  });

```
