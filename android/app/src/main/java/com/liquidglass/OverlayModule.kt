package com.liquidglass

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class OverlayModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "OverlayModule"

    @ReactMethod
    fun checkPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val hasPermission = Settings.canDrawOverlays(reactContext)
            promise.resolve(hasPermission)
        } else {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun requestPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(reactContext)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + reactContext.packageName)
            ).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
        }
    }

    @ReactMethod
    fun startOverlay(themeColor: String) {
        val intent = Intent(reactContext, OverlayService::class.java).apply {
            action = "ACTION_SHOW_OVERLAY"
            putExtra("themeColor", themeColor)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent)
        } else {
            reactContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopOverlay() {
        val intent = Intent(reactContext, OverlayService::class.java).apply {
            action = "ACTION_HIDE_OVERLAY"
        }
        reactContext.stopService(intent)
    }

    @ReactMethod
    fun updateThemeColor(themeColor: String) {
        val intent = Intent(reactContext, OverlayService::class.java).apply {
            action = "ACTION_UPDATE_THEME"
            putExtra("themeColor", themeColor)
        }
        reactContext.startService(intent)
    }
}
