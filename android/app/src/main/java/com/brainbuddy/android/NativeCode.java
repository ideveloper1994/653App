package com.brainbuddy.android;

/**
 * Created on 30/04/18.
 */

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.util.Log;
import android.widget.Toast;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import java.util.TimeZone;

import com.facebook.react.bridge.Callback;

public class NativeCode extends ReactContextBaseJavaModule {

    public NativeCode(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void getInstallDate(Callback errorCallback, Callback successCallback) {
        try {
            long installed = getReactApplicationContext().getApplicationContext().getPackageManager().getPackageInfo("com.brainbuddy.android", 0).firstInstallTime;
            Log.e("d", String.valueOf(installed));
            successCallback.invoke(String.valueOf(installed));

        } catch (PackageManager.NameNotFoundException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void isAppInDebug(Callback errorCallback, Callback successCallback) {
        if(!BuildConfig.DEBUG) {
            successCallback.invoke("NO");
        }else{
            successCallback.invoke("YES");
        }
    }

    @ReactMethod
    public void showThemeAlert(String title, String messageText, String btnLeft, String btnRight,
                               boolean lightTheme,
                               final Callback letBtnPress, final Callback rightButtonPress) {
        try {
//            Toast.makeText(getReactApplicationContext(), ob   jAlert, Toast.LENGTH_LONG).show();
            AlertDialog.Builder builder = new AlertDialog.Builder(this.getCurrentActivity(),android.R.style.Theme_DeviceDefault_Light_Dialog);
//            AlertDialog.Builder builder = null;
//            if(lightTheme){
//                builder = new AlertDialog.Builder(this.getCurrentActivity(),android.R.style.Theme_DeviceDefault_Dialog);
//            }else{
//                builder = new AlertDialog.Builder(this.getCurrentActivity(),android.R.style.Theme_DeviceDefault_Light_Dialog);
//            }
            builder.setTitle(title);
            builder.setMessage(messageText);
            if(btnRight.length() > 0){
                builder.setPositiveButton(btnRight, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        rightButtonPress.invoke(i);
                    }
                });
            }

            if(btnLeft.length() > 0){
                builder.setNegativeButton(btnLeft, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        letBtnPress.invoke(i);
                    }
                });
            }
            builder.setCancelable(false);
            builder.show();
        } catch (Exception e) {
            //Error
            //letBtnPress.invoke("error");
        }
    }

    @ReactMethod
        public void isEuropeanCountry(Callback successCallback) {
        try{
            String locale = getReactApplicationContext().getResources().getConfiguration().locale.getCountry();
            successCallback.invoke(locale);
        }catch (Exception e) {
            successCallback.invoke("NO");
        }
    }

    @ReactMethod
    public void getTimeZone(Callback successCallback) {
        try{
            TimeZone tz = TimeZone.getDefault();
            successCallback.invoke(tz.getID());
        }catch (Exception e) {
            successCallback.invoke("NULL");
        }
    }

    @Override
    public String getName() {
        return "AndroidNativeModule";
    }
}