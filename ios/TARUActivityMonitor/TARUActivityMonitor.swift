import DeviceActivity
import Foundation

public final class TARUActivityMonitor: DeviceActivityMonitor {
    private let appGroup = "group.com.taru.app"
    private let key = "taru_today_minutes"
    private let dateKey = "taru_today_ymd"

    public override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        // Reset counter when a new day starts
        let ymd = Self.todayYMD()
        let defaults = UserDefaults(suiteName: appGroup)
        if defaults?.string(forKey: dateKey) != ymd {
            defaults?.set(ymd, forKey: dateKey)
            defaults?.set(0, forKey: key)
        }
    }

    public override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, for activity: DeviceActivityName) {
        super.eventDidReachThreshold(event, for: activity)
        // Our threshold is 1 minute in the scheduler.
        let defaults = UserDefaults(suiteName: appGroup)
        let ymd = Self.todayYMD()
        if defaults?.string(forKey: dateKey) != ymd {
            defaults?.set(ymd, forKey: dateKey)
            defaults?.set(0, forKey: key)
        }
        let current = defaults?.integer(forKey: key) ?? 0
        defaults?.set(current + 1, forKey: key)
    }

    private static func todayYMD() -> String {
        let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
        return df.string(from: Date())
    }
}
