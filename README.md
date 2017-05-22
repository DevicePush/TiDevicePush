# Ti Device Push Module 

## Description

Titanium Appcelerator integration with Device Push Notifications
Ti-Device Push module allows register and receive Push Notifications from Device Push Notifications APIs

* The Android implementation uses [FCM Firebase Cloud Messaging](http://firebase.google.com/).
* The iOS version is based on [APNS Notifications](https://developer.apple.com/notifications/).

## Contents

- [How to install the Plugin](#install_plugin)
- [Module API](#module_api)
- [License](#license)

### Supported Platforms

- Android
- iOS

## <a name="install_plugin"></a>How to install the Plugin

### Manual Installation

Download the latest distribution ZIP-file with latest [Android GCM module](https://github.com/morinel/gcmpush) and add the following lines to your `tiapp.xml` file:
```xml
<modules>
    <module platform="commonjs">ti-devicepush</module>
	<module platform="android">nl.vanvianen.android.gcm-android</module>
</modules>
```

### GitTio CLI Installation:

$ gittio install ti-devicepush

##<a name="module_api"></a> Module API
```js
var devicePush = require('ti-devicepush');
devicePush.register({
	idUser: 'USER_ID',    				// Your User ID in Device Push
	idApplication: 'APPLICATION_ID',	// Aplication ID in Device Push
	additionalData: {} 					// Add additional data to be able to segment
});
```

### To unregister a device
You must call the unregister function.
```js
devicePush.unregister();
```

### To get id or token device
You can get the device id or token of the device.
```js
Ti.App.addEventListener('deviceRegistered', function(evt){
	Ti.API.info("[TiDeviceId] onReceive Push callback = " + evt.devicePushId);
	var id = evt.devicePushId;
	Ti.API.info("[TiDeviceToken] onReceive Push callback = " + evt.devicePushToken);
	var tokenDevice = evt.devicePushToken;
});
```
With this ID you can send notification from your server.

### To manager a notification received
You can manage notifications received with the next method
```js
Ti.App.addEventListener('notificationReceived', function(evt){
	// evt.data.message, 
	// evt.data.title, 
	// evt.data.count, 
	// evt.data.sound, 
	// evt.data.additionalData
	Ti.API.info("[TiDeviceToken] onReceive Push callback = " + JSON.stringify(evt.data));
});
```

### When you unregister device
You can unregister device.
```js
Ti.App.addEventListener('deviceUnregistered', function(){
	Ti.API.info("[TiDevice] deviceUnregistered");
});
```

### To manager a error when device register
You can get if an error occurs
```js
Ti.App.addEventListener('errorRegister', function(evt){
	Ti.API.info("[TiDeviceToken] errorRegister");
});
```

### To update the additional data
Update the additional data to be able to segment
```js
devicePush.putAdditionalData({});
```

### When the additional data is updated
```js
Ti.App.addEventListener('additionalDataUpdated', function(){
	Ti.API.info("[TiDevice] additionalDataUpdated");
});
```

You can see more information about this at: https://www.devicepush.com/en/titanium-appcelerator/

Looking at the above message handling code for Android, a few things bear explanation. Your app may receive a notification while it is active (INLINE). If you background the app by hitting the Home button on your device, you may later receive a status bar notification. Selecting that notification from the status will bring your app to the front and allow you to process the notification (BACKGROUND). Finally, should you completely exit the app by hitting the back button from the home page, you may still receive a notification. Touching that notification in the notification tray will relaunch your app and allow you to process the notification (COLDSTART). In this case the **coldstart** flag will be set on the incoming event. You can look at the **foreground** flag on the event to determine whether you are processing a background or an in-line notification. You may choose, for example to play a sound or show a dialog only for inline or coldstart notifications since the user has already been alerted via the status bar.

Since the Android notification data models are much more flexible than that of iOS, there may be additional elements beyond **message**. You can access those elements and any additional ones via the **payload** element. This means that if your data model should change in the future, there will be no need to change and recompile the plugin.

##<a name="license"></a> LICENSE

	The MIT License

	Copyright (c) 2017 Device Push.
	portions Copyright (c) 2017 Device Push

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.