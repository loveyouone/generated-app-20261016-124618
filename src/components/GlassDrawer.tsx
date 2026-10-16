import React from 'react';
import { StyleSheet, View, Text, Pressable, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Terminal, SlidersHorizontal, Info, X, Shield, Cpu } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

interface GlassDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabKey: string) => void;
}

export const GlassDrawer: React.FC<GlassDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { activeColor, isDark } = useTheme();

  if (!isOpen) return null;

  const menuItems = [
    { key: 'Home', title: '首页 (Explore)', icon: Home },
    { key: 'Scripts', title: '外部脚本注入 (Script Injector)', icon: Terminal },
    { key: 'Settings', title: '外观与材质设置 (Settings)', icon: SlidersHorizontal },
    { key: 'About', title: '关于 YIy注入 (About)', icon: Info },
  ];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />

        <View style={styles.drawerContainer}>
          <BlurView
            intensity={98}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />

          <View
            style={[
              styles.drawerInner,
              {
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.22)'
                  : 'rgba(255, 255, 255, 0.8)',
                backgroundColor: isDark
                  ? 'rgba(10, 15, 28, 0.88)'
                  : 'rgba(255, 255, 255, 0.88)',
              },
            ]}
          >
            {/* 抽屉头部 */}
            <View style={styles.headerRow}>
              <View style={styles.brandRow}>
                <View
                  style={[
                    styles.logoBox,
                    {
                      backgroundColor: activeColor.glowRgba,
                      borderColor: activeColor.hex,
                    },
                  ]}
                >
                  <Cpu size={22} color={activeColor.hex} />
                </View>
                <View style={styles.brandTextCol}>
                  <Text style={[styles.brandTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    YIy注入
                  </Text>
                  <Text style={[styles.brandSub, { color: activeColor.hex }]}>
                    Roblox 脚本注入器 v2.6
                  </Text>
                </View>
              </View>

              <Pressable onPress={onClose} style={styles.closeBtn}>
                <X size={20} color={isDark ? '#E2E8F0' : '#1E293B'} />
              </Pressable>
            </View>

            {/* 菜单列表 */}
            <View style={styles.menuList}>
              {menuItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => {
                      onNavigate(item.key);
                      onClose();
                    }}
                    style={[
                      styles.menuItem,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.06)'
                          : 'rgba(255, 255, 255, 0.5)',
                        borderColor: isDark
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'rgba(15, 23, 42, 0.12)',
                      },
                    ]}
                  >
                    <ItemIcon size={18} color={activeColor.hex} />
                    <Text
                      style={[
                        styles.menuText,
                        { color: isDark ? '#F1F5F9' : '#0F172A' },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* 抽屉页脚 */}
            <View style={styles.footerBox}>
              <View style={styles.statusPill}>
                <Shield size={14} color="#10B981" />
                <Text style={styles.statusPillText}>原生 WindowManager 模块已挂载</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  backdropPressable: {
    flex: 1,
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: -8, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  drawerInner: {
    flex: 1,
    borderLeftWidth: 1.5,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  brandSub: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuList: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerBox: {
    marginTop: 'auto',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusPillText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
});