import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, Clipboard, Play, Trash2, Terminal, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';

interface LogEntry {
  id: string;
  time: string;
  text: string;
  type?: 'info' | 'success' | 'warn' | 'exec';
}

const SAMPLE_LUA_SCRIPT = `-- YIy注入 Roblox 自定义 Lua 扩展
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

print("[YIy] 初始化神速与无敌挂载...")
LocalPlayer.Character.Humanoid.WalkSpeed = 64
LocalPlayer.Character.Humanoid.JumpPower = 120
print("[YIy] 脚本注入成功，参数已生效！")`;

export const ScriptsScreen: React.FC = () => {
  const { activeColor, isDark } = useTheme();
  const [scriptText, setScriptText] = useState<string>(SAMPLE_LUA_SCRIPT);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '12:00:01', text: '系统初始化完成...', type: 'info' },
    { id: '2', time: '12:00:02', text: '等待注入指令...', type: 'info' },
    { id: '3', time: '12:00:03', text: 'WindowManager 悬浮窗权限已获取', type: 'success' },
  ]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const addLog = (text: string, type: 'info' | 'success' | 'warn' | 'exec' = 'info') => {
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      time: getCurrentTime(),
      text,
      type,
    };
    setLogs((prev) => [...prev, newEntry]);
  };

  const handleCopy = () => {
    addLog(`[Copy] 脚本文本已复制 (字数: ${scriptText.length})`, 'info');
  };

  const handlePaste = () => {
    setScriptText(SAMPLE_LUA_SCRIPT);
    addLog('[Paste] 已成功粘贴示例 Roblox Lua 脚本', 'info');
  };

  const handleRun = () => {
    if (!scriptText.trim()) {
      addLog('[Error] 脚本文本为空，无法执行', 'warn');
      return;
    }

    addLog('[Exec] 正在解析与编译自定义脚本...', 'exec');
    setTimeout(() => {
      addLog('[Exec] 正在挂载代码至游戏主线程...', 'exec');
    }, 300);
    setTimeout(() => {
      addLog('[Success] 脚本执行成功！Hook 接口生效中', 'success');
    }, 600);
  };

  const handleClearLogs = () => {
    setLogs([
      { id: Date.now().toString(), time: getCurrentTime(), text: '日志已清空', type: 'info' },
    ]);
  };

  return (
    <SafeAreaView style={styles.flex1} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* 页头标题 */}
        <View style={styles.headerBox}>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            外部脚本注入
          </Text>
          <Text style={[styles.headerSub, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)' }]}>
            自定义 Lua / JS 脚本编写、一键挂载与控制台日志
          </Text>
        </View>

        {/* 中等大小 TextInput 输入框 */}
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: isDark
                ? 'rgba(10, 15, 28, 0.65)'
                : 'rgba(255, 255, 255, 0.65)',
            },
          ]}
        >
          <TextInput
            multiline
            value={scriptText}
            onChangeText={setScriptText}
            placeholder="在此输入或粘贴脚本文本..."
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}
            style={[
              styles.textInput,
              { color: isDark ? '#F1F5F9' : '#0F172A' },
            ]}
          />
        </View>

        {/* 3 个小按钮行: 复制, 粘贴, 运行 */}
        <View style={styles.btnRow}>
          <Pressable
            onPress={handleCopy}
            style={[
              styles.actionBtn,
              {
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(15, 23, 42, 0.2)',
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.6)',
              },
            ]}
          >
            <Copy size={14} color={activeColor.hex} />
            <Text style={[styles.btnText, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>
              复制
            </Text>
          </Pressable>

          <Pressable
            onPress={handlePaste}
            style={[
              styles.actionBtn,
              {
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(15, 23, 42, 0.2)',
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.6)',
              },
            ]}
          >
            <Clipboard size={14} color={activeColor.hex} />
            <Text style={[styles.btnText, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>
              粘贴
            </Text>
          </Pressable>

          <Pressable
            onPress={handleRun}
            style={[
              styles.actionBtn,
              styles.runBtn,
              {
                backgroundColor: activeColor.hex,
                borderColor: activeColor.hex,
              },
            ]}
          >
            <Play size={14} color="#FFFFFF" />
            <Text style={[styles.btnText, { color: '#FFFFFF', fontWeight: '800' }]}>
              运行
            </Text>
          </Pressable>
        </View>

        {/* 日志面板 */}
        <GlassCard style={styles.logsCard}>
          <View style={styles.logsHeaderRow}>
            <View style={styles.logsTitleGroup}>
              <View style={[styles.activeDot, { backgroundColor: activeColor.hex }]} />
              <Text style={[styles.logsTitleText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                日志 (Logs)
              </Text>
            </View>

            <Pressable onPress={handleClearLogs} style={styles.clearBtn}>
              <Trash2 size={13} color={isDark ? '#94A3B8' : '#64748B'} />
              <Text style={[styles.clearText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                清空
              </Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.logsScrollView}
            contentContainerStyle={styles.logsScrollContent}
          >
            {logs.map((log) => {
              let logColor = isDark ? '#CBD5E1' : '#334155';
              if (log.type === 'success') logColor = '#10B981';
              if (log.type === 'warn') logColor = '#EF4444';
              if (log.type === 'exec') logColor = activeColor.hex;

              return (
                <View key={log.id} style={styles.logLine}>
                  <Text style={styles.logTime}>[{log.time}]</Text>
                  <Text style={[styles.logText, { color: logColor }]}>
                    {log.text}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </GlassCard>

        {/* 底部避让 */}
        <View style={styles.bottomSpacer} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerBox: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  inputContainer: {
    height: 120,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'monospace',
    textAlignVertical: 'top',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  runBtn: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  logsCard: {
    flex: 1,
    padding: 14,
    marginBottom: 10,
  },
  logsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  logsTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logsTitleText: {
    fontSize: 13,
    fontWeight: '800',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  clearText: {
    fontSize: 11,
    fontWeight: '600',
  },
  logsScrollView: {
    flex: 1,
  },
  logsScrollContent: {
    gap: 6,
  },
  logLine: {
    flexDirection: 'row',
    gap: 8,
  },
  logTime: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#94A3B8',
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 1,
  },
  bottomSpacer: {
    height: 90,
  },
});