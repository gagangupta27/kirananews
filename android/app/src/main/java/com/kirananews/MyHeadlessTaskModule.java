package com.kirananews;

import android.content.ContentResolver;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.provider.Telephony;
import androidx.annotation.NonNull;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.HeadlessJsTaskService;

public class MyHeadlessTaskModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public MyHeadlessTaskModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "HeadlessTask";
    }

    @ReactMethod
    public void startHeadlessTask() {
        Intent service = new Intent(reactContext, MyTaskService.class);
        Bundle bundle = new Bundle();
        service.putExtras(bundle);
        HeadlessJsTaskService.acquireWakeLockNow(reactContext);
        reactContext.startService(service);
    }
}
