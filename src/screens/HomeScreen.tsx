import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Cpu, ChevronDown, Zap, ShieldAlert, CheckCircle2, Play, Activity, Terminal } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { HighlightButton } from '../components/HighlightButton';
import { GlassDrawer } from '../components/GlassDrawer';
import { NativeOverlayService } from '../services/NativeOverlayService';

interface HomeScreenProps {
  onNavigateTab: (tabKey: string) => void;
}

const AVAILABLE_SCRIPTS = [
  'Roblox 通用越狱 & 飞行 v2.4',
  'Roblox 穿墙与极速挂载',
  'Auto Farm Hub - 自动刷怪',
  '透视 ESP & 无敌机制',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateTab }) => {
  const { activeColor, isDark } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedScript, setSelectedScript] = useState<string>(AVAILABLE_SCRIPTS[0]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isInjected, setIsInjected] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleInject = async () => {
    // 权限检查
    const granted = await NativeOverlayService.checkPermission();
    if (!granted) {
      const requested = await NativeOverlayService.requestPermission();
      if (!requested) {
        Alert.alert(
          '权限不足',
          '启动系统悬浮窗灵动岛需要“显示在其他应用上”权限，已进行模拟注入启动。'
        );
      }
    }

    // 触发注入动效与状态
    setIsInjected(true);
    setIsRunning(true);
    await NativeOverlayService.startOverlay(activeColor.hex);
  };

  return (
    <SafeAreaView style={styles.flex1} edges={['top', 'left', 'right']}>
      {/* 侧滑抽屉 */}
      <GlassDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={onNavigateTab}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部 Header: Logo + App Name "YIy注入" */}
        <View style={styles.topNav}>
          <View style={styles.brandContainer}>
            <View
              style={[
                styles.appLogoBox,
                {
                  backgroundColor: activeColor.glowRgba,
                  borderColor: activeColor.hex,
                },
              ]}
            >
              <Cpu size={22} color={activeColor.hex} />
            </View>
            <View>
              <Text style={[styles.appName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                YIy注入
              </Text>
              <Text style={[styles.appSub, { color: activeColor.hex }]}>
                Roblox 核心控制台
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setDrawerOpen(true)}
            style={[
              styles.menuBtn,
              {
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'rgba(255, 255, 255, 0.7)',
                backgroundColor: isDark
                  ? 'rgba(15, 23, 42, 0.45)'
                  : 'rgba(255, 255, 255, 0.55)',
              },
            ]}
          >
            <Menu size={20} color={isDark ? '#FFFFFF' : '#0F172A'} />
          </Pressable>
        </View>

        {/* 主控制面板卡片 (核心注入卡片) */}
        <GlassCard glow style={styles.mainControlCard}>
          {/* Roblox 图标 + 选择脚本行 */}
          <Pressable
            onPress={() => setDropdownOpen(!dropdownOpen)}
            style={styles.robloxSelectorRow}
          >
            <View style={styles.robloxIconBadge}>
              <Text style={styles.robloxRLogo}>R</Text>
            </View>

            <View style={styles.scriptSelectCol}>
              <Text style={[styles.selectScriptLabel, { color: activeColor.hex }]}>
                选择脚本
              </Text>
              <Text style={[styles.selectedScriptText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {selectedScript}
              </Text>
            </View>

            <ChevronDown
              size={20}
              color={isDark ? '#94A3B8' : '#64748B'}
              style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }}
            />
          </Pressable>

          {/* 下拉选择脚本菜单 */}
          {dropdownOpen && (
            <View
              style={[
                styles.dropdownContainer,
                {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.18)'
                    : 'rgba(15, 23, 42, 0.18)',
                  backgroundColor: isDark
                    ? 'rgba(15, 23, 42, 0.9)'
                    : 'rgba(255, 255, 255, 0.95)',
                },
              ]}
            >
              {AVAILABLE_SCRIPTS.map((script) => (
                <Pressable
                  key={script}
                  onPress={() => {
                    setSelectedScript(script);
                    setDropdownOpen(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    script === selectedScript && {
                      backgroundColor: activeColor.glowRgba,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      {
                        color: script === selectedScript
                          ? activeColor.hex
                          : isDark
                          ? '#E2E8F0'
                          : '#1E293B',
                        fontWeight: script === selectedScript ? '800' : '500',
                      },
                    ]}
                  >
                    {script}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* 注入按钮 */}
          <HighlightButton
            title={isInjected ? '重新注入进程' : '注入'}
            icon={<Zap size={18} color="#FFF" />}
            onPress={handleInject}
            style={styles.injectBtn}
          />

          {/* 底部小字状态行 */}
          <View style={styles.statusFooterRow}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isInjected ? '#10B981' : '#EF4444' },
                ]}
              />
              <Text style={[styles.statusText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                注入状态: {isInjected ? '已成功注入' : '未注入'}
              </Text>
            </View>

            <Text style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
              |
            </Text>

            <View style={styles.statusItem}>
              <Activity size={12} color={isRunning ? activeColor.hex : '#94A3B8'} />
              <Text style={[styles.statusText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                运行状态: {isRunning ? '运行中' : '等待操作'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* 次要展示模块 */}
        <Text
          style={[
            styles.sectionHeader,
            { color: isDark ? '#FFFFFF' : '#0F172A' },
          ]}
        >
          核心系统与外部工具
        </Text>

        <GlassCard onPress={() => onNavigateTab('Scripts')}>
          <View style={styles.cardHeaderRow}>
            <View
              style={[
                styles.cardIconBg,
                { backgroundColor: activeColor.glowRgba },
              ]}
            >
              <Terminal size={20} color={activeColor.hex} />
            </View>
            <Text style={[styles.cardTag, { color: activeColor.hex }]}>
              外部脚本扩展
            </Text>
          </View>
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            外部脚本注入控制台
          </Text>
          <Text
            style={[
              styles.cardBody,
              { color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.75)' },
            ]}
          >
            支持粘贴自定义 Lua/JS 脚本文本，提供实时运行日志排错与系统级悬浮挂载。
          </Text>
        </GlassCard>

        <GlassCard onPress={() => onNavigateTab('Settings')}>
          <View style={styles.cardHeaderRow}>
            <View
              style={[
                styles.cardIconBg,
                { backgroundColor: 'rgba(16, 185, 129, 0.22)' },
              ]}
            >
              <ShieldAlert size={20} color="#10B981" />
            </View>
            <Text style={[styles.cardTag, { color: '#10B981' }]}>
              系统悬浮窗
            </Text>
          </View>
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            Android 原生悬浮灵动岛
          </Text>
          <Text
            style={[
              styles.cardBody,
              { color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.75)' },
            ]}
          >
            原生 WindowManager (TYPE_APPLICATION_OVERLAY) 悬浮卡片，支持跨应用调色与快捷菜单。
          </Text>
        </GlassCard>

        {/* 底部间距 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appLogoBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  appSub: {
    fontSize: 11,
    fontWeight: '800',
  },
  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainControlCard: {
    padding: 18,
    marginBottom: 20,
  },
  robloxSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 12,
  },
  robloxIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  robloxRLogo: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 20,
    transform: [{ rotate: '-12deg' }],
  },
  scriptSelectCol: {
    flex: 1,
  },
  selectScriptLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  selectedScriptText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  dropdownContainer: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  dropdownText: {
    fontSize: 13,
  },
  injectBtn: {
    marginTop: 16,
  },
  statusFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 100,
  },
});