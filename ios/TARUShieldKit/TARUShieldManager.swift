// TARUShieldKit
// Single point of contact for Screen Time auth, blocking, and usage queries.

import Foundation
import UIKit
import FamilyControls
import ManagedSettings
import DeviceActivity

@objc public protocol TARUShieldManagerObserver: AnyObject {
    func onAuthorizationChanged(_ authorized: Bool)
    func onError(_ message: String)
}

@objc public final class TARUShieldManager: NSObject {
    @objc public static let shared = TARUShieldManager()
    private override init() {}

    @objc public private(set) var isAuthorized: Bool = false
    @objc public weak var observer: TARUShieldManagerObserver?

    private let store = ManagedSettingsStore()
    private var selection = FamilyActivitySelection()
    private let appGroupId = "group.com.taru.app"

    // MARK: - Authorization
    @objc public func requestAuthorization(_ completion: @escaping (Bool) -> Void) {
        #if targetEnvironment(simulator)
        self.isAuthorized = false
        observer?.onError("Screen Time is unavailable in the iOS Simulator. Test on a real device.")
        completion(false)
        return
        #endif

        AuthorizationCenter.shared.requestAuthorization { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success():
                    let ok = (AuthorizationCenter.shared.authorizationStatus == .approved)
                    self?.isAuthorized = ok
                    self?.observer?.onAuthorizationChanged(ok)
                    completion(ok)
                case .failure(let err):
                    self?.observer?.onError("Authorization failed: \(err.localizedDescription)")
                    completion(false)
                }
            }
        }
    }

    @objc public func openFamilyActivityPicker(from viewController: UIViewController, _ completion: @escaping (Bool) -> Void) {
        guard AuthorizationCenter.shared.authorizationStatus == .approved else {
            completion(false); return
        }
        let picker = FamilyActivityPickerViewController()
        picker.delegate = self
        viewController.present(picker, animated: true)
        // completion will be triggered after selection saved; we call with true then.
        // For MVP, we immediate-resolve; refine later if you need exact signal.
        completion(true)
    }

    // MARK: - Blocking
    @objc public func applyBlock(bundleIds: [String], webDomains: [String], categoryTokens: [String]) {
        guard AuthorizationCenter.shared.authorizationStatus == .approved else { return }

        // Apps
        let appTokens = bundleIds.map { ApplicationToken(bundleIdentifier: $0) }
        let appSet = Set(appTokens)

        // Web
        let webSet = Set(webDomains.map { WebDomain(domain: $0) })

        // Categories
        let categories = Set(categoryTokens.compactMap { ApplicationCategoryToken(rawValue: $0) })

        var shield = ApplicationShieldConfiguration()
        if !categories.isEmpty { shield.applicationCategories = .specific(categories) }
        if !appSet.isEmpty { shield.applications = appSet }

        var webShield = WebDomainShieldConfiguration()
        if !webSet.isEmpty { webShield.webDomains = webSet }

        store.shield.applications = shield
        store.shield.webDomains = webShield
    }

    @objc public func clearAllBlocks() {
        store.shield.applications = nil
        store.shield.webDomains = nil
    }

    // MARK: - Usage (stub for MVP)
    @objc public func getTodayUsageSeconds(forBundleId bundleId: String, _ completion: @escaping (Double) -> Void) {
        completion(0) // wire DeviceActivityReport extension later if desired
    }

    // MARK: - App Group JSON reading
    @objc public func readTodayUsageJSON(_ completion: @escaping (String?) -> Void) {
        let appGroupId = "group.com.taru.app"
        guard let url = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupId)?.appendingPathComponent("usage_today.json") else {
            completion(nil); return
        }
        let data = try? Data(contentsOf: url)
        completion(data.flatMap { String(data: $0, encoding: .utf8) })
    }

    // MARK: - Live minute counter
    @objc public func getTodayMinutesTotal(_ completion: @escaping (NSNumber) -> Void) {
        let defaults = UserDefaults(suiteName: "group.com.taru.app")
        let minutes = defaults?.integer(forKey: "taru_today_minutes") ?? 0
        completion(NSNumber(value: minutes))
    }
}

extension TARUShieldManager: FamilyActivityPickerViewControllerDelegate {
    public func familyActivityPickerViewControllerDidCancel(_ controller: FamilyActivityPickerViewController) {
        controller.dismiss(animated: true)
    }
    public func familyActivityPickerViewController(_ controller: FamilyActivityPickerViewController, didFinishWith selection: FamilyActivitySelection) {
        self.selection = selection
        controller.dismiss(animated: true)
    }
}
