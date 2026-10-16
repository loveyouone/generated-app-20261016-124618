import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Home, Terminal, SlidersHorizontal, Info } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

export interface TabItem {
  key: string;
  title: string;
  icon: any;
}

const TABS: TabItem[] = [
  { key: 'Home', title: '首页', icon: Home },
  { key: 'Scripts', title: '外部脚本注入', icon: Terminal },
  { key: 'Settings', title: '设置', icon: SlidersHorizontal },
  { key: 'About', title: '关于', icon: Info },
];

interface FloatingTabBarProps {
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { activeColor, isDark } = useTheme();
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(70);

  const handleTabLayout = (key: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    const newLayouts = { ...tabLayouts, [key]: { x, width } };
    setTabLayouts(newLayouts);

    if (key === activeTab) {
      indicatorX.value = withSpring(x, { damping: 18, stiffness: 240 });
      indicatorWidth.value = withSpring(width, { damping: 18, stiffness: 240 });
    }
  };

  const handlePress = (key: string) => {
    onTabChange(key);
    const layout = tabLayouts[key];
    if (layout) {
      indicatorX.value = withSpring(layout.x, { damping: 18, stiffness: 240 });
      indicatorWidth.value = withSpring(layout.width, { damping: 18, stiffness: 240 });
    }
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  return (
    <View style={styles.outerContainer}>
      <BlurView
        intensity={95}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.capsuleBorder,
          {
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.25)'
              : 'rgba(255, 255, 255, 0.75)',
            backgroundColor: isDark
              ? 'rgba(10, 15, 28, 0.65)'
              : 'rgba(255, 255, 255, 0.7)',
          },
        ]}
      >
        <View style={styles.tabsRow}>
          {/* Active Water-Drop Lens Sliding Indicator */}
          <Animated.View
            style={[
              styles.waterDropLens,
              {
                backgroundColor: activeColor.glowRgba,
                borderColor: activeColor.hex,
              },
              animatedIndicatorStyle,
            ]}
          >
            {/* Refractive Inner Rim Highlight */}
            <View style={[styles.lensHighlight, { backgroundColor: activeColor.hex }]} />
          </Animated.View>

          {/* Tab Buttons */}
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            const IconComponent = tab.icon;

            return (
              <Pressable
                key={tab.key}
                onLayout={(e) => handleTabLayout(tab.key, e)}
                onPress={() => handlePress(tab.key)}
                style={styles.tabButton}
              >
                <IconComponent
                  size={19}
                  color={
                    isActive
                      ? activeColor.hex
                      : isDark
                      ? 'rgba(255, 255, 255, 0.55)'
                      : 'rgba(15, 23, 42, 0.55)'
                  }
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive
                        ? activeColor.hex
                        : isDark
                        ? 'rgba(255, 255, 255, 0.55)'
                        : 'rgba(15, 23, 42, 0.55)',
                      fontWeight: isActive ? '800' : '500',
                    },
                  ]}
                >
                  {tab.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.38,
    shadowRadius: 20,
    elevation: 12,
  },
  capsuleBorder: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 1.5,
    padding: 4,
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  waterDropLens: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    zIndex: 1,
  },
  lensHighlight: {
    position: 'absolute',
    top: 2,
    left: '15%',
    width: '70%',
    height: 3,
    borderRadius: 2,
    opacity: 0.9,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    zIndex: 2,
    paddingHorizontal: 2,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.2,
  },
});