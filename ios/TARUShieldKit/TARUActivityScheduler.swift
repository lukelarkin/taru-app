import Foundation
import FamilyControls
import DeviceActivity

@objc public final class TARUActivityScheduler: NSObject {
    private let center = DeviceActivityCenter()

    /// Start daily monitoring for the selected targets with a simple all-day schedule.
    /// - Parameters:
    ///   - bundleIds: app bundle IDs to track
    ///   - webDomains: domains to track
    ///   - startHour: start of daily window (default 0)
    ///   - endHour: end of daily window (default 24)
    @objc public func startMonitoring(bundleIds: [String], webDomains: [String], startHour: Int = 0, endHour: Int = 24, completion: @escaping (Bool, String?) -> Void) {
        let cal = Calendar.current
        var start = DateComponents()
        start.hour = startHour
        var end = DateComponents()
        end.hour = endHour

        let schedule = DeviceActivitySchedule(
            intervalStart: start,
            intervalEnd: end,
            repeats: true
        )

        // Build a FamilyActivitySelection that contains our targets.
        let appTokens = bundleIds.map { ApplicationToken(bundleIdentifier: $0) }
        let webTokens = webDomains.map { WebDomain(domain: $0) }
        var selection = FamilyActivitySelection()
        selection.applicationTokens = Set(appTokens)
        selection.webDomainTokens = Set(webTokens)

        // A single broad event to capture "time on targets".
        let event = DeviceActivityEvent(
            applications: selection.applicationTokens,
            webDomains: selection.webDomainTokens,
            threshold: DateComponents(minute: 1) // threshold example (optional)
        )

        do {
            try center.startMonitoring(.daily, during: schedule, events: [.cravingWindow: event])
            completion(true, nil)
        } catch {
            completion(false, error.localizedDescription)
        }
    }

    @objc public func stopMonitoring(completion: @escaping (Bool, String?) -> Void) {
        do {
            try center.stopMonitoring(.daily)
            completion(true, nil)
        } catch {
            completion(false, error.localizedDescription)
        }
    }
}
