package com.brainbuddy.android;

import android.app.Application;
import android.content.Context;
import android.provider.Settings;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.horcrux.svg.SvgPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.RNRate.RNRatePackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.smixx.fabric.FabricPackage;
import com.chirag.RNMail.RNMail;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.BV.LinearGradient.LinearGradientPackage;

import fm.indiecast.rnaudiostreamer.RNAudioStreamerPackage;

import com.zmxv.RNSound.RNSoundPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;

import com.crashlytics.android.Crashlytics;

import io.fabric.sdk.android.Fabric;

public class MainApplication extends MultiDexApplication implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNGestureHandlerPackage(),
                    new SvgPackage(),
                    new ReactNativeOneSignalPackage(),
                    new LottiePackage(),
                    new FingerprintAuthPackage(),
                    new RNRatePackage(),
                    new InAppBillingBridgePackage(),
                    new BackgroundTimerPackage(),
                    new KCKeepAwakePackage(),
                    new FabricPackage(),
                    new RNMail(),
                    new ReactNativePushNotificationPackage(),
                    new LinearGradientPackage(),
                    new RNAudioStreamerPackage(),
                    new RNSoundPackage(),
                    new ReactVideoPackage(),
                    new VectorIconsPackage(),
                    new RegisterNativeModules()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (!BuildConfig.DEBUG) {
            Fabric.with(this, new Crashlytics());
        }
        SoLoader.init(this, /* native exopackage */ false);

        //String androidId = String.valueOf(UUID.randomUUID());
        //Log.e("MainApplication", "onCreate: " + " UUID:" + androidId);
    }

}