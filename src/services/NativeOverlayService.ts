import { NativeModules, Platform, ToastAndroid } from 'react-native';

const { OverlayModule } = NativeModules;

export class NativeOverlayService {
  public static async checkPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !OverlayModule) {
      return true; // Simulate true in iOS / Web Preview
    }
    try {
      return await OverlayModule.checkPermission();
    } catch (e) {
      console.warn('NativeOverlayService.checkPermission error:', e);
      return false;
    }
  }

  public static async requestPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !OverlayModule) {
      return true; // Simulate true in iOS / Web Preview
    }
    try {
      return await OverlayModule.requestPermission();
    } catch (e) {
      console.warn('NativeOverlayService.requestPermission error:', e);
      return false;
    }
  }

  public static async startOverlay(themeColorHex: string): Promise<boolean> {
    if (Platform.OS !== 'android' || !OverlayModule) {
      console.log(`[Web/iOS Mode] 灵动岛悬浮窗模拟已启动 (配色: ${themeColorHex})`);
      return true;
    }
    try {
      await OverlayModule.startOverlay(themeColorHex);
      if (Platform.OS === 'android') {
        ToastAndroid.show('系统级灵动岛悬浮窗已启动', ToastAndroid.SHORT);
      }
      return true;
    } catch (e) {
      console.warn('NativeOverlayService.startOverlay error:', e);
      return false;
    }
  }

  public static async stopOverlay(): Promise<boolean> {
    if (Platform.OS !== 'android' || !OverlayModule) {
      console.log('[Web/iOS Mode] 灵动岛悬浮窗模拟已关闭');
      return true;
    }
    try {
      await OverlayModule.stopOverlay();
      if (Platform.OS === 'android') {
        ToastAndroid.show('系统级灵动岛悬浮窗已关闭', ToastAndroid.SHORT);
      }
      return true;
    } catch (e) {
      console.warn('NativeOverlayService.stopOverlay error:', e);
      return false;
    }
  }
}
