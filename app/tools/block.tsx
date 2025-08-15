import React, { useEffect, useState } from 'react';
import { Platform, View, Text, Alert, ScrollView } from 'react-native';
// Temporarily disabled for Expo Go testing
// import {
//   requestAuthorization,
//   onAuthorization,
//   onShieldError,
//   applyBlock,
//   clearAllBlocks,
//   openApplePicker,
//   startMonitoring,
//   stopMonitoring,
//   presentUsageReport,
//   getTodayMinutesTotal,
//   SHIELD_AVAILABLE,
//   PORN_DOMAINS, GAMBLING_DOMAINS, GAMING_DOMAINS, SOCIAL_BUNDLES
// } from '../../modules/taru-shield';

// Temporary mock for Expo Go testing
const SHIELD_AVAILABLE = false;
const PORN_DOMAINS: string[] = [];
const GAMBLING_DOMAINS: string[] = [];
const GAMING_DOMAINS: string[] = [];
const SOCIAL_BUNDLES: string[] = [];

// Mock functions for Expo Go testing
const onAuthorization = (cb: (authorized: boolean) => void) => () => {};
const onShieldError = (cb: (msg: string) => void) => () => {};
const requestAuthorization = async () => false;
const applyBlock = (opts: any) => {};
const clearAllBlocks = () => {};
const openApplePicker = async () => false;
const startMonitoring = async (opts: any) => false;
const stopMonitoring = async () => false;
const getTodayMinutesTotal = async () => 0;
const presentUsageReport = (opts: any) => {};
import { Screen } from '../../src/ui/Screen';
import { Card } from '../../src/ui/Card';
import { NeonButton } from '../../src/ui/NeonButton';
import { GradientText } from '../../src/ui/GradientText';
import { useTaruTheme } from '../../src/theme/TaruProvider';
import { taruSpace } from '../../src/theme/taruTheme';

export default function BlockTab() {
  const [authorized, setAuthorized] = useState(false);
  const [todayMinutes, setTodayMinutes] = useState<number>(0);
  const isiOS = Platform.OS === 'ios';
  const { colors, fonts } = useTaruTheme();

  useEffect(() => {
    const offAuth = onAuthorization(setAuthorized);
    const offErr = onShieldError((msg) => Alert.alert('Screen Time', msg));
    return () => { offAuth?.(); offErr?.(); };
  }, []);

  const askAuth = async () => {
    if (!isiOS) return Alert.alert('Unavailable', 'Screen Time blocking is iOS-only.');
    if (!SHIELD_AVAILABLE) return Alert.alert('Development Build Required', 'Install the TARU development build to enable Screen Time features.');
    const ok = await requestAuthorization().catch(() => false);
    setAuthorized(!!ok);
    if (!ok) Alert.alert('Authorize Screen Time', 'Open Settings → Screen Time and ensure TARU is approved.');
  };

  const enableShield = async () => {
    if (!isiOS) return;
    if (!SHIELD_AVAILABLE) return Alert.alert('Development Build Required', 'Install the TARU development build to enable blocking features.');
    if (!authorized) return Alert.alert('Authorize first', 'Tap "Enable Screen Time" first.');
    applyBlock({
      bundleIds: SOCIAL_BUNDLES,
      webDomains: [...PORN_DOMAINS, ...GAMBLING_DOMAINS, ...GAMING_DOMAINS],
      categories: [],
    });
    Alert.alert('Shield Enabled', 'Selected apps & sites are now blocked.');
  };

  const disableShield = () => {
    if (!isiOS) return;
    if (!SHIELD_AVAILABLE) return Alert.alert('Development Build Required', 'Install the TARU development build to enable blocking features.');
    clearAllBlocks();
    Alert.alert('Shield Disabled', 'All TARU blocks cleared.');
  };

  const openPicker = async () => {
    if (!SHIELD_AVAILABLE) return Alert.alert('Development Build Required', 'Install the TARU development build to enable Apple Picker.');
    if (!authorized) return Alert.alert('Authorize first', 'Tap "Enable Screen Time" first.');
    const ok = await openApplePicker().catch(() => false);
    if (!ok) Alert.alert('Picker Unavailable', 'Could not open Apple\'s Family Activity Picker.');
  };

  const startDailyMonitoring = async () => {
    if (!SHIELD_AVAILABLE) return Alert.alert('Development Build Required', 'Install the TARU development build to enable monitoring features.');
    if (!authorized) return Alert.alert('Authorize first', 'Tap "Enable Screen Time" first.');
    const ok = await startMonitoring({ 
      bundleIds: SOCIAL_BUNDLES, 
      webDomains: [...PORN_DOMAINS, ...GAMBLING_DOMAINS, ...GAMING_DOMAINS] 
    }).catch(() => false);
    Alert.alert(ok ? 'Monitoring Started' : 'Monitor Error', ok ? 'Daily monitoring active.' : 'Could not start monitoring.');
  };

  const stopDailyMonitoring = async () => {
    if (!SHIELD_AVAILABLE) return Alert.alert('Development Build Required', 'Install the TARU development build to enable monitoring features.');
    const ok = await stopMonitoring().catch(() => false);
    Alert.alert(ok ? 'Monitoring Stopped' : 'Stop Error');
  };

  const refreshTodayMinutes = async () => {
    if (!SHIELD_AVAILABLE) return Alert.alert('Development Build Required', 'Install the TARU development build to enable usage tracking.');
    const minutes = await getTodayMinutesTotal().catch(() => 0);
    setTodayMinutes(minutes);
  };

  const showNativeUsageReport = () => {
    if (!SHIELD_AVAILABLE) return Alert.alert('Development Build Required', 'Install the TARU development build to enable usage reports.');
    presentUsageReport({
      bundleIds: SOCIAL_BUNDLES,
      webDomains: [...PORN_DOMAINS, ...GAMBLING_DOMAINS, ...GAMING_DOMAINS],
    });
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: "center", marginTop: 10, marginBottom: 20 }}>
          <GradientText style={{ fontFamily: fonts.display, fontSize: 28, letterSpacing: 0.5 }}>
            Device Protection
          </GradientText>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.ui, marginTop: 6, textAlign: 'center' }}>
            Block triggering apps & sites at the OS level. When you hit a block, tap "Take a Reset" to return here for a 60–90s reset.
          </Text>
        </View>

        {!SHIELD_AVAILABLE && (
          <Card glow="orange" style={{ marginBottom: taruSpace.lg }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.weight.semibold, fontSize: 18, marginBottom: 6 }}>
              Development Build Required
            </Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.ui, marginBottom: 12 }}>
              Install the TARU development build to enable Screen Time blocking and monitoring features.
            </Text>
            <NeonButton title="Install Dev Build" onPress={() => Alert.alert('Info', 'Run: npx expo run:ios --device')} />
          </Card>
        )}

        <Card glow="blue" style={{ marginBottom: taruSpace.lg }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.weight.semibold, fontSize: 18, marginBottom: 6 }}>
            Screen Time Status
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.ui, marginBottom: 12 }}>
            {isiOS ? (authorized ? 'Authorized' : 'Not Authorized') : 'iOS only'}
          </Text>
          <NeonButton title="Enable Screen Time (iOS)" onPress={askAuth} />
        </Card>

        <Card glow="purple" style={{ marginBottom: taruSpace.lg }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.weight.semibold, fontSize: 18, marginBottom: 6 }}>
            Shield Controls
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.ui, marginBottom: 12 }}>
            Block apps and websites that trigger cravings.
          </Text>
          <NeonButton title="Block Porn + Gambling + Gaming" onPress={enableShield} />
          <View style={{ marginTop: 8 }}>
            <NeonButton title="Open Apple Picker (optional)" onPress={openPicker} size="sm" />
          </View>
          <View style={{ marginTop: 8 }}>
            <NeonButton title="Clear All Blocks" onPress={disableShield} size="sm" />
          </View>
        </Card>

        <Card glow="cyan" style={{ marginBottom: taruSpace.lg }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.weight.semibold, fontSize: 18, marginBottom: 6 }}>
            Usage Monitoring
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.ui, marginBottom: 12 }}>
            Track daily usage of selected apps and websites. Data is stored locally and can be viewed in your dashboard.
          </Text>
          <NeonButton title="Start Daily Monitoring" onPress={startDailyMonitoring} />
          <View style={{ marginTop: 8 }}>
            <NeonButton title="Stop Monitoring" onPress={stopDailyMonitoring} size="sm" />
          </View>
        </Card>

        <Card glow="orange" style={{ marginBottom: taruSpace.lg }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.weight.semibold, fontSize: 18, marginBottom: 6 }}>
            Usage Reports
          </Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.ui, marginBottom: 12 }}>
            View detailed usage data and track your progress.
          </Text>
          <NeonButton title={`Today's Minutes: ${todayMinutes}m`} onPress={refreshTodayMinutes} />
          <View style={{ marginTop: 8 }}>
            <NeonButton title="View Detailed Report (Native)" onPress={showNativeUsageReport} size="sm" />
          </View>
        </Card>

        <Text style={{ marginTop: 12, fontSize: 12, opacity: 0.7, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.ui }}>
          Note: Test on a real iPhone (Simulator doesn't support Screen Time APIs).
        </Text>
      </ScrollView>
    </Screen>
  );
} 