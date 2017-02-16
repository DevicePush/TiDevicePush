var _DP_urlApi = "http://api.devicepush.com/mobile/";
function _DP_init (obj){

  //if (OS_IOS) 
  Ti.API.info("name: " + Ti.Platform.name);

  if(Ti.Platform.name != 'android')
  { 
    // Sets interactive notifications as well if iOS8 and above. Interactive notifications is optional.
    if (parseInt(Ti.Platform.version.split(".")[0], 10) >= 8) {
      var thumbUpAction = Ti.App.iOS.createUserNotificationAction({
        identifier: "THUMBUP_IDENTIFIER",
        title: "Agree",
        activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
        destructive: false,
        authenticationRequired: false
      });

      var thumbDownAction = Ti.App.iOS.createUserNotificationAction({
        identifier: "THUMBDOWN_IDENTIFIER",
        title: "Disagree",
        activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
        destructive: false,
        authenticationRequired: false
      });

      var thumbUpDownCategory = Ti.App.iOS.createUserNotificationCategory({
        identifier: "THUMBUPDOWN_CATEGORY",
        // The following actions will be displayed for an alert dialog
        actionsForDefaultContext: [thumbUpAction, thumbDownAction],
        // The following actions will be displayed for all other notifications
        actionsForMinimalContext: [thumbUpAction, thumbDownAction]
      });

      var pnOptions = {
        types: [
          Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
          Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, 
          Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
        ],
        categories: [thumbUpDownCategory]
      };
      
      function registerForPush() {
        Ti.API.info('[TiDevicePush] Register for Push');
          Ti.Network.registerForPushNotifications({
              success: function(e){
                Ti.API.info(e);
                _DP_reg({
                  idApplication: obj.idApplication,
                  idUser: obj.idUser,
                  additionaldata: obj.additionaldata,
                  token: e.deviceToken
                });
              },
              error: function(){
                Ti.API.info("Push registration");
                Ti.App.fireEvent('errorRegister');
              },
              callback: function(event){
                Ti.UI.iOS.setAppBadge(0);
                Ti.API.info("Push callback = " + JSON.stringify(event));
                Ti.App.fireEvent('notificationReceived', event);
              }
            });
          // Remove event listener once registered for push notifications
        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
    }

    // Wait for user settings to be registered before registering for push notifications
    Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);
    
    // Register notification types to use
      Ti.App.iOS.registerUserNotificationSettings({
          types: pnOptions.types,
          categories: pnOptions.categories
      });

    } 
    else { //No support for interactive notifications, omit categories
      var pnOptions = {
        types: [
          Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
          Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, 
          Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
        ]
      };
      
    // For iOS 7 and earlier
    Ti.Network.registerForPushNotifications({
        types: pnOptions.types,
        success: function(e){
          Ti.API.info(e);
          _DP_reg({
            idApplication: obj.idApplication,
            idUser: obj.idUser,
            additionaldata: obj.additionaldata,
            token: e.deviceToken
          });
        },
        error: function(){
          Ti.API.info("Push registration");
          Ti.App.fireEvent('errorRegister');
        },
        callback: function(event){
          Ti.UI.iOS.setAppBadge(0);
          Ti.API.info("Push callback = " + JSON.stringify(event));
          Ti.App.fireEvent('notificationReceived', event);
        }
    });
    }
  }
  else // Android init
  {
    var gcm = require("nl.vanvianen.android.gcm");

    var lastData = gcm.getLastData();
    if (lastData) {
      Ti.API.info("Last notification received " + JSON.stringify(lastData));
      gcm.clearLastData();
    }
    
    Ti.API.info("Android register");
      
    gcm.registerPush({
      senderId: obj.senderId,
      notificationSettings: {
        sound: 'default',
        largeIcon: 'appicon.png',  
        vibrate: true,  // Whether the phone should vibrate
        insistent: false,  // Whether the notification should be insistent
        group: 'MyNotificationGroup',  // Name of group to group similar notifications together 
            localOnly: false,  // Whether this notification should be bridged to other devices 
            priority: 0,  // Notification priority, from -2 to +2
        bigText: false,
        ledOn: 200,
        ledOff: 300
      },
      success: function (event) {
        Ti.API.info("Push registration success: " + JSON.stringify(event));
        if(event.success){
          _DP_reg({
            idApplication: obj.idApplication,
            idUser: obj.idUser,
            additionaldata: obj.additionaldata,
            token: event.registrationId
          });
        }
      },
      error: function (event) {
        Ti.API.info("Push registration error: " + JSON.stringify(event));
        Ti.App.fireEvent('errorRegister');
      },
      callback: function (event) // Reveive a push on Android.
      {
        Ti.API.info("Push callback = " + JSON.stringify(event));
        Ti.App.fireEvent('notificationReceived', event);
      }
    });
  }

}

function _DP_reg (obj){
  Ti.API.info("[TiDeviceToken] _DP_reg" + obj);
  var device = '';
  if(Ti.Platform.name != 'android'){
    device = 'iOS';
  }else{
    device = 'Android';
  }
  var xhr = Ti.Network.createHTTPClient({
    onload: function() {
      Ti.API.info("[TiDeviceToken] Token sent to our backend");
      Ti.API.info("[TiDeviceToken] Token send status: " + xhr.responseText);  
      Ti.App.Properties.setString('_DP_devicePushId', JSON.parse(xhr.responseText)._id);
      Ti.App.Properties.setString('_DP_devicePushToken', obj.token);
      Ti.App.fireEvent('deviceRegistered', {
        devicePushId: JSON.parse(xhr.responseText)._id,
        devicePushToken: obj.token
      });      
    },
    onerror: function() {
      Ti.API.info("[TiDeviceToken] Can't send token to our backend");
      Ti.App.fireEvent('errorRegister');
    }
  });
  xhr.open("POST", _DP_urlApi + obj.idApplication + '/');
  xhr.setRequestHeader("token", obj.idUser);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({
      token: obj.token,
      device: device,
      additionaldata: obj.additionaldata
  }));
}

module.exports = {
    register: function(obj){
      Ti.App.Properties.setString('_DP_idUser', obj.idUser);
      Ti.App.Properties.setString('_DP_idApplication', obj.idApplication);
      var xmlhttpSinc = Ti.Network.createHTTPClient({
        onload: function() {
          Ti.API.info("[TiDeviceToken] Sender id Backend: " + xmlhttpSinc.responseText);   
          var dataXmlhttpSinc = JSON.parse(xmlhttpSinc.responseText);
          Ti.App.Properties.setString('_DP_senderId', dataXmlhttpSinc.senderid);
          _DP_init({
            idApplication: obj.idApplication,
            idUser: obj.idUser,
            additionaldata: obj.additionaldata,
            senderId: dataXmlhttpSinc.senderid
          });
        },
        onerror: function() {
          Ti.API.info("[TiDeviceToken] Can´t read Sender id Backend");
          Ti.App.fireEvent('errorRegister');
        }
      });
      xmlhttpSinc.open("GET", _DP_urlApi + obj.idApplication + '/senderid/');
      xmlhttpSinc.setRequestHeader("token", obj.idUser);
      xmlhttpSinc.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xmlhttpSinc.send();
  },
  putAdditionalData: function(obj){
      var xmlhttpPutAdditionalData = Ti.Network.createHTTPClient({
        onload: function() {
          Ti.API.info("[TiDeviceToken] Set new additional data: " + xmlhttpPutAdditionalData.responseText);   
        },
        onerror: function() {
          Ti.API.info("[TiDeviceToken] Can´t set additional data");
        }
      });
      xmlhttpPutAdditionalData.open("POST", _DP_urlApi + 'additionaldata/update/');
      xmlhttpPutAdditionalData.setRequestHeader("token", Ti.App.Properties.getString('_DP_idUser'));
      xmlhttpPutAdditionalData.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xmlhttpPutAdditionalData.send(JSON.stringify({
        idDevice: Ti.App.Properties.getString('_DP_devicePushId'),
			  additionaldata: obj
    }));
  }
};