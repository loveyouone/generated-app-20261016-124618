package com.liquidglass

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat

class OverlayService : Service() {

    private var windowManager: WindowManager? = null
    private var overlayView: View? = null
    private var params: WindowManager.LayoutParams? = null
    private var isExpanded = false
    private var currentThemeColor: String = "#00E5FF"

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        startForegroundServiceNotification()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        createOverlayView()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        val colorHex = intent?.getStringExtra("themeColor")
        
        if (colorHex != null) {
            currentThemeColor = colorHex
            updateOverlayColor(colorHex)
        }

        when (action) {
            "ACTION_SHOW_OVERLAY" -> showOverlay()
            "ACTION_HIDE_OVERLAY" -> hideOverlay()
            "ACTION_UPDATE_THEME" -> updateOverlayColor(currentThemeColor)
        }

        return START_STICKY
    }

    private fun startForegroundServiceNotification() {
        val channelId = "liquid_glass_overlay_channel"
        val channelName = "Liquid Glass System Dynamic Island"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            const channel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Liquid Glass Dynamic Island")
            .setContentText("System overlay floating active")
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        startForeground(1001, notification)
    }

    private fun createOverlayView() {
        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
            y = 50
        }

        val rootLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(32, 16, 32, 16)
            background = createGlassBackground(currentThemeColor, isExpanded = false)
        }

        val textView = TextView(this).apply {
            text = "Liquid Glass Dynamic Island"
            setTextColor(Color.WHITE)
            textSize = 12f
        }

        rootLayout.addView(textView)

        rootLayout.setOnClickListener {
            toggleExpandedState(rootLayout, textView)
        }

        // Drag to move functionality
        var initialY = 0
        var initialTouchY = 0f

        rootLayout.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialY = params?.y ?: 0
                    initialTouchY = event.rawY
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    params?.y = initialY + (event.rawY - initialTouchY).toInt()
                    windowManager?.updateViewLayout(overlayView, params)
                    true
                }
                else -> false
            }
        }

        overlayView = rootLayout
    }

    private fun toggleExpandedState(container: LinearLayout, textView: TextView) {
        isExpanded = !isExpanded
        if (isExpanded) {
            params?.flags = WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
            params?.width = 600
            container.setPadding(48, 32, 48, 32)
            textView.text = "Liquid Glass System Dynamic Island v2.6\nMode: Interactive Glass Overlay"
            container.background = createGlassBackground(currentThemeColor, isExpanded = true)
        } else {
            params?.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
            params?.width = WindowManager.LayoutParams.WRAP_CONTENT
            container.setPadding(32, 16, 32, 16)
            textView.text = "Liquid Glass Dynamic Island"
            container.background = createGlassBackground(currentThemeColor, isExpanded = false)
        }
        windowManager?.updateViewLayout(overlayView, params)
    }

    private fun createGlassBackground(strokeColorHex: String, isExpanded: Boolean): GradientDrawable {
        return GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = if (isExpanded) 60f else 40f
            setColor(Color.parseColor("#33000000")) // 20% dark glass base
            setStroke(3, Color.parseColor(strokeColorHex))
        }
    }

    private fun updateOverlayColor(colorHex: String) {
        overlayView?.let { view ->
            if (view is LinearLayout) {
                view.background = createGlassBackground(colorHex, isExpanded)
            }
        }
    }

    private fun showOverlay() {
        if (overlayView?.windowToken == null) {
            try {
                windowManager?.addView(overlayView, params)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun hideOverlay() {
        if (overlayView?.windowToken != null) {
            try {
                windowManager?.removeView(overlayView)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    override fun onDestroy() {
        hideOverlay()
        super.onDestroy()
    }
}
