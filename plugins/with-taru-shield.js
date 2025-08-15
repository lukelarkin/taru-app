const { withEntitlementsPlist, withInfoPlist } = require('@expo/config-plugins');

module.exports = function withTARUShield(config) {
  const APP_GROUP = 'group.com.taru.app';

  // Entitlements needed by FamilyControls/DeviceActivity
  config = withEntitlementsPlist(config, (c) => {
    c.modResults['com.apple.security.application-groups'] = [APP_GROUP];
    c.modResults['com.apple.developer.family-controls'] = true;
    c.modResults['com.apple.developer.device-activity'] = true;
    return c;
  });

  // Minimal Info.plist additions (local notifications for reset prompt)
  config = withInfoPlist(config, (c) => {
    c.modResults.UIBackgroundModes = Array.from(
      new Set([...(c.modResults.UIBackgroundModes ?? []), 'processing', 'fetch'])
    );
    c.modResults.NSUserTrackingUsageDescription = 'Used to improve your recovery experience.';
    c.modResults.UIApplicationSupportsIndirectInputEvents = true;
    return c;
  });

  return config;
};
