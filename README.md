# Ti Device Push Module 

## DESCRIPTION

Titanium Appcelerator integration with Device Push Notifications
Ti-Device Push module allows register and receive Push Notifications from Device Push Notifications APIs

### Contents

- [Automatic Installation](#automatic_installation)
- [Module API](#module_api)
- [Testing](#testing)
- [LICENSE](#license)

### Supported Platforms

- Android
- iOS

### Get the module

**Find the newest version in the dist folder**

##<a name="automatic_installation"></a> Referencing the module in your Ti mobile application 

Simply add the following lines to your `tiapp.xml` file:
```xml
<modules>
    <module platform="commonjs">ti-devicepush</module>
</modules>
```

##<a name="module_api"></a> Module API
```js
    var devicePush = require('ti-devicepush');
    devicePush.register({
        idUser: 'USER_ID',    				// Your User ID in Device Push
        idApplication: 'APPLICATION_ID',	// Aplication ID in Device Push
        additionalData: {} 					// Currently in development
	});
```

#### To get id or token device
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

#### To manager a notification received
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

## Community Driven

I encourage everyone to send Pull Requests - keeping this module flying with new features.

## Reference

For more detailed code examples take a look into the example app

## Changelog

* v1.1  
* init

You can see more information about this at: http://www.devicepush.com/documentation-push-notification/

Looking at the above message handling code for Android, a few things bear explanation. Your app may receive a notification while it is active (INLINE). If you background the app by hitting the Home button on your device, you may later receive a status bar notification. Selecting that notification from the status will bring your app to the front and allow you to process the notification (BACKGROUND). Finally, should you completely exit the app by hitting the back button from the home page, you may still receive a notification. Touching that notification in the notification tray will relaunch your app and allow you to process the notification (COLDSTART). In this case the **coldstart** flag will be set on the incoming event. You can look at the **foreground** flag on the event to determine whether you are processing a background or an in-line notification. You may choose, for example to play a sound or show a dialog only for inline or coldstart notifications since the user has already been alerted via the status bar.

Since the Android notification data models are much more flexible than that of iOS, there may be additional elements beyond **message**. You can access those elements and any additional ones via the **payload** element. This means that if your data model should change in the future, there will be no need to change and recompile the plugin.

##<a name="testing"></a> Testing
The notification system consists of several interdependent components.

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