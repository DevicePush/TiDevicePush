function doClick(e) {
    alert($.label.text);
}

$.index.open();

var devicePush = require('ti-devicepush');

devicePush.register({
    idApplication: 'xxxx-xxxx-xxxx-xxxx',
    idUser: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    additionaldata: {}
});  

Ti.App.addEventListener('deviceRegistered', function(evt){
    Ti.API.info("[TiDeviceId] onReceive Push callback = " + evt.devicePushId);
    var id = evt.devicePushId;
    Ti.API.info("[TiDeviceToken] onReceive Push callback = " + evt.devicePushToken);
    var tokenDevice = evt.devicePushToken;
});

Ti.App.addEventListener('notificationReceived', function(evt){
	Ti.API.info("[TiDeviceToken] onReceive Push callback =" + JSON.stringify(evt.data));
    alert(evt.data.alert);
});