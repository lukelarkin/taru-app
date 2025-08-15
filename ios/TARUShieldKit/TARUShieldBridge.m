#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(TARUShieldBridge, RCTEventEmitter)

RCT_EXTERN_METHOD(requestAuthorization:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(applyBlock:(NSArray *)bundleIds
                  webDomains:(NSArray *)webDomains
                  categories:(NSArray *)categories)

RCT_EXTERN_METHOD(clearAllBlocks)

RCT_EXTERN_METHOD(getTodayUsageSeconds:(NSString *)bundleId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// New: Apple Family Activity Picker
RCT_EXTERN_METHOD(openFamilyActivityPicker:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// DeviceActivity monitoring
RCT_EXTERN_METHOD(startMonitoring:(NSArray *)bundleIds
                  webDomains:(NSArray *)webDomains
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopMonitoring:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getTodayUsageJSON:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Usage reporting
RCT_EXTERN_METHOD(presentUsageReport:(NSArray *)bundleIds
                  webDomains:(NSArray *)webDomains)

RCT_EXTERN_METHOD(getTodayMinutesTotal:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
