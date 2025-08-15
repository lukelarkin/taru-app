import Foundation
import SwiftUI
import DeviceActivity
import FamilyControls
import UIKit

@objc final class TARUUsageReportHost: NSObject {

    // Present a native screen that shows Apple's usage report UI for your selection.
    // You can call this from RN via a bridge method (below).
    @objc static func present(forBundleIds bundleIds: [String], webDomains: [String]) {
        guard let root = topViewController() else { return }

        // Build a filter using your current selection
        let apps = Set(bundleIds.map { ApplicationToken(bundleIdentifier: $0) })
        let domains = Set(webDomains.map { WebDomain(domain: $0) })

        let today = Calendar.current.startOfDay(for: Date())
        let interval = DateInterval(start: today, end: Date())

        let filter = DeviceActivityFilter(
            segment: .daily(during: interval),
            users: .all,
            devices: .init([.iPhone]),
            applications: apps,
            categories: [],
            webDomains: domains
        )

        let vc = UIHostingController(rootView: TARUReportScreen(filter: filter))
        vc.title = "Today's Usage"
        let nav = UINavigationController(rootViewController: vc)
        nav.modalPresentationStyle = .formSheet
        root.present(nav, animated: true)
    }

    private static func topViewController(base: UIViewController? = {
        let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
        return scene?.windows.first(where: { $0.isKeyWindow })?.rootViewController
    }()) -> UIViewController? {
        if let nav = base as? UINavigationController { return topViewController(base: nav.visibleViewController) }
        if let tab = base as? UITabBarController, let selected = tab.selectedViewController { return topViewController(base: selected) }
        if let presented = base?.presentedViewController { return topViewController(base: presented) }
        return base
    }
}

struct TARUReportScreen: View {
    let filter: DeviceActivityFilter

    var body: some View {
        DeviceActivityReport(
            .init("com.taru.dailyReport"),
            filter: filter
        )
        .navigationTitle("Today's Usage")
        .navigationBarTitleDisplayMode(.inline)
    }
}
