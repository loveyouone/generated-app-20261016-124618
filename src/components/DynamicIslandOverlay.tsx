import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Sparkles, Palette, Shield, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { PRESET_THEME_COLORS } from '../theme/colors';

export const DynamicIslandOverlay: React.FC = () => {
  const { activeColor, setActiveColor, isDark } = useTheme();
  const [expanded, setExpanded] = useState<boolean>(false);

  const islandWidth = useSharedValue(180);
  const islandHeight = useSharedValue(38);

  const toggleExpand = () => {
    const nextState = !expanded;
    setExpanded(nextState);

    if (nextState) {
      islandWidth.value = withSpring(320, { damping: 14, stiffness: 180 });
      islandHeight.value = withSpring(160, { damping: 14, stiffness: 180 });
    } else {
      islandWidth.value = withSpring(180, { damping: 14, stiffness: 180 });
      islandHeight.value = withSpring(38, { damping: 14, stiffness: 180 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: islandWidth.value,
    height: islandHeight.value,
  }));

  return (
    <View style={styles.topContainer} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.islandCapsule,
          {
            borderColor: activeColor.hex,
            shadowColor: activeColor.hex,
          },
          animatedStyle,
        ]}
      >
        <BlurView
          intensity={95}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.innerOverlay,
            {
              backgroundColor: isDark
                ? 'rgba(6, 8, 15, 0.75)'
                : 'rgba(255, 255, 255, 0.75)',
            },
          ]}
        >
          {/* 紧凑状态 Head */}
          <Pressable onPress={toggleExpand} style={styles.headerPressable}>
            <View style={[styles.dot, { backgroundColor: activeColor.hex }]} />
            <Text
              numberOfLines={1}
              style={[
                styles.titleText,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              {expanded ? '系统悬浮控制中心' : 'Liquid Glass 灵动岛'}
            </Text>
            <Sparkles size={14} color={activeColor.hex} />
          </Pressable>

          {/* 展开状态 Body */}
          {expanded && (
            <View style={styles.expandedContent}>
              <Text
                style={[
                  styles.subText,
                  { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)' },
                ]}
              >
                快捷配色切换 (System Overlay Window):
              </Text>

              <View style={styles.colorRow}>
                {PRESET_THEME_COLORS.map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => setActiveColor(c)}
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: c.hex,
                        borderColor: activeColor.id === c.id ? '#FFFFFF' : 'transparent',
                        borderWidth: activeColor.id === c.id ? 2 : 0,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.badgeRow}>
                  <Shield size={12} color={activeColor.hex} />
                  <Text style={[styles.badgeText, { color: activeColor.hex }]}>
                    TYPE_APPLICATION_OVERLAY 运行中
                  </Text>
                </View>

                <Pressable onPress={toggleExpand} style={styles.collapseBtn}>
                  <ChevronUp size={16} color={isDark ? '#E2E8F0' : '#1E293B'} />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  islandCapsule: {
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 16,
  },
  innerOverlay: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 22,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  expandedContent: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  subText: {
    fontSize: 11,
    fontWeight: '500',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  colorDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  collapseBtn: {
    padding: 2,
  },
});
