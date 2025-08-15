import Foundation
import React
import UIKit

@objc(TARUShieldBridge)
class TARUShieldBridge: RCTEventEmitter, TARUShieldManagerObserver {

    override static func requiresMainQueueSetup() -> Bool { true }
    override func supportedEvents() -> [String]! { ["onAuthorization", "onError"] }

    @objc func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock,
                                    rejecter reject: @escaping RCTPromiseRejectBlock) {
        TARUShieldManager.shared.observer = self
        TARUShieldManager.shared.requestAuthorization { ok in
            ok ? resolve(true) : reject("E_AUTH", "Screen Time authorization failed or unavailable.", nil)
        }
    }

    @objc func applyBlock(_ bundleIds: [String], webDomains: [String], categories: [String]) {
        TARUShieldManager.shared.applyBlock(bundleIds: bundleIds, webDomains: webDomains, categoryTokens: categories)
    }

    @objc func clearAllBlocks() {
        TARUShieldManager.shared.clearAllBlocks()
    }

    @objc func getTodayUsageSeconds(_ bundleId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        TARUShieldManager.shared.getTodayUsageSeconds(forBundleId: bundleId) { seconds in
            resolve(seconds)
        }
    }

    // Present Apple's Family Activity Picker
    @objc func openFamilyActivityPicker(_ resolve: @escaping RCTPromiseResolveBlock,
                                        rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let root = TARUShieldBridge.topViewController() else {
            reject("E_NO_ROOT", "Unable to find root view controller.", nil); return
        }
        TARUShieldManager.shared.openFamilyActivityPicker(from: root) { ok in
            ok ? resolve(true) : reject("E_PICKER", "Picker not available (authorize first).", nil)
        }
    }

    // Start monitoring from RN
    @objc func startMonitoring(_ bundleIds: [String], webDomains: [String],
                               resolver resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) {
        TARUActivityScheduler().startMonitoring(bundleIds: bundleIds, webDomains: webDomains) { ok, err in
            ok ? resolve(true) : reject("E_MONITOR", err ?? "Failed to start monitoring", nil)
        }
    }

    // Stop monitoring
    @objc func stopMonitoring(_ resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) {
        TARUActivityScheduler().stopMonitoring { ok, err in
            ok ? resolve(true) : reject("E_MONITOR_STOP", err ?? "Failed to stop monitoring", nil)
        }
    }

    // Get today's usage JSON from App Group
    @objc func getTodayUsageJSON(_ resolve: @escaping RCTPromiseResolveBlock,
                                 rejecter reject: @escaping RCTPromiseRejectBlock) {
        TARUShieldManager.shared.readTodayUsageJSON { json in
            if let json = json { resolve(json) } else { resolve("{}") }
        }
    }

    // Present Apple's usage report UI for a given selection
    @objc func presentUsageReport(_ bundleIds: [String], webDomains: [String]) {
        TARUUsageReportHost.present(forBundleIds: bundleIds, webDomains: webDomains)
    }

    // Get today's minutes total from App Group
    @objc func getTodayMinutesTotal(_ resolve: @escaping RCTPromiseResolveBlock,
                                    rejecter reject: @escaping RCTPromiseRejectBlock) {
        TARUShieldManager.shared.getTodayMinutesTotal { n in resolve(n) }
    }

    // MARK: - Observer
    func onAuthorizationChanged(_ authorized: Bool) {
        sendEvent(withName: "onAuthorization", body: ["authorized": authorized])
    }
    func onError(_ message: String) {
        sendEvent(withName: "onError", body: ["message": message])
    }

    // Safely find the top-most view controller for presentation
    private static func topViewController(base: UIViewController? = {
        let scenes = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
        let window = scenes.first?.windows.first { $0.isKeyWindow }
        return window?.rootViewController
    }()) -> UIViewController? {
        if let nav = base as? UINavigationController { return topViewController(base: nav.visibleViewController) }
        if let tab = base as? UITabBarController, let selected = tab.selectedViewController { return topViewController(base: selected) }
        if let presented = base?.presentedViewController { return topViewController(base: presented) }
        return base
    }
}
