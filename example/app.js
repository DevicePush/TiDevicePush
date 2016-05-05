// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});

win.open();

function doClick(e) {
    alert($.label.text);
}

//
//iOS init
//
if (OS_IOS) 
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
      types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND],
      categories: [thumbUpDownCategory]
    };
    
    function registerForPush() {
    	
    	Ti.API.info('[TiDevicePush] Register for Push');
     
        Ti.Network.registerForPushNotifications({
	          success: deviceTokenSuccess,
	          error: deviceTokenError,
	          callback: receivePush
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
      types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND]
    };
    
	// For iOS 7 and earlier
	Ti.Network.registerForPushNotifications({
	    // Specifies which notifications to receive
	    types: pnOptions.types,
	    success: deviceTokenSuccess,
	    error: deviceTokenError,
	    callback: receivePush
	});
  }
}
else // Android init
{
	var gcm = require("nl.vanvianen.android.gcm");

	/* If the app is started or resumed act on pending data saved when the notification was received */
	var lastData = gcm.getLastData();
	if (lastData) {
		Ti.API.info("Last notification received " + JSON.stringify(lastData));
		gcm.clearLastData();
	}
	
	Ti.API.info("Android register");
		
	gcm.registerPush({
		/* It's the same as your Googpe API project id */
		senderId: 'XXXXXX',
		notificationSettings: {
			sound: 'default',
			largeIcon: 'appicon.png',  
			vibrate: true,  /* Whether the phone should vibrate */
			insistent: false,  /* Whether the notification should be insistent */
			group: 'MyNotificationGroup',  /* Name of group to group similar notifications together */
	        localOnly: false,  /* Whether this notification should be bridged to other devices */
	        priority: 0,  /* Notification priority, from -2 to +2 */
			bigText: false,
			ledOn: 200,
			ledOff: 300
		},
		success: function (event) {
			Ti.API.info("Push registration success: " + JSON.stringify(event));
			if(event.success) // We have the token. We'll send it to DevicePush
			{
				deviceTokenSuccess({deviceToken: event.registrationId});
			}
		},
		error: function (event) {
			Ti.API.info("Push registration error: " + JSON.stringify(event));
			alert(event.error);
		},
		callback: function (event) // Reveive a push on Android.
		{
			Ti.API.info("Push callback = " + JSON.stringify(event));
		}
	});
}

function deviceTokenSuccess(e){
	Ti.API.info('[TiDeviceToken] Device Token:', e.deviceToken);
    Alloy.Globals.devicePush.register({
      							idApplication: 'XXXXXXX',
      							idUser: 'XXXXXX',
      							token: e.deviceToken,
      							platformDP: OS_IOS ? 'iOS' : 'Android'
    }, onSuccess, onError);

}

function deviceTokenError(e){
	Ti.API.info('Error: Token not retrieved');	
}

function receivePush(e){
	
	Ti.API.info("[TiDeviceToken] onReceive Push callback =" + JSON.stringify(e));

    if (OS_IOS) {
      // Reset badge
      Titanium.UI.iPhone.appBadge = null;
    }

    Ti.API.info("[TiDeviceToken] Push notification received: " +  JSON.stringify(e.data));
}

function onSuccess(id){
	// Do some stuff when success with DevicePush id.
	Ti.API.info("[TiDeviceToken] Register ID: " +  JSON.stringify(id));
};

function onError(){
	// Do some stuff when fail.
	
};

if (OS_IOS)
{
	Ti.App.iOS.addEventListener('localnotificationaction', function(e) {
		// Switch for categories
		switch (e.category) {
		    case "THUMBUPDOWN_CATEGORY":
		        // Switch for actions
		        switch (e.identifier) {
		            case "THUMBUP_IDENTIFIER":
		                //if (e.userInfo && "url" in e.userInfo){
		                  //  httpGetRequest(e.userInfo.url);
		                //}
		             break;
		            // more actions...
		        }
		        break;
		    // more categories...
		    default:
		        break;
	    };
	});	

	Ti.App.iOS.addEventListener('remotenotificationaction', function(e) {
	    // Switch for categories
	    switch (e.category) {
	        case "DOWNLOAD_CATEGORY":
	            // Switch for actions
	            switch (e.identifier) {
	                case "THUMBUPDOWN_CATEGORY":
	                    //if (e.data && "url" in e.data){
	                      //  httpGetRequest(e.data.url);
	                    //}
	                    break;
	                // more actions...
	            }
	            break;
	        // more categories...
	        default:
	            break;
	    };
	});

}
