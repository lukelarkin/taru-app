import DeviceActivity
import SwiftUI

@main
struct TARUActivityReport: DeviceActivityReportExtension {
    // This is the entry point for the report UI (Apple renders this as a view).
    var body: some DeviceActivityReportScene {
        // A single report "page"
        DeviceActivityReport(context: .init("com.taru.dailyReport")) { context in
            // You can customize the view shown in Screen Time's UI.
            // For MVP, we render a very basic text. The important piece for our app:
            // we also write a compact JSON summary to the App Group so the RN app
            // can read Today's usage numbers without needing to render this UI.
            TARUReportView()
                .onAppear {
                    TARUUsageWriter.writeTodaySummary()
                }
        }
    }
}

private struct TARUReportView: View {
    var body: some View {
        VStack(spacing: 8) {
            Text("TARU Usage Report").font(.headline)
            Text("Usage summary updated for today.").font(.subheadline)
        }.padding()
    }
}

// MARK: - Shared writer into App Group (json stub)
private enum TARUUsageWriter {
    static let appGroup = "group.com.taru.app"
    static let fileName = "usage_today.json"

    /// TODO: Replace stub with real aggregation once you wire your FamilyActivitySelection here.
    static func writeTodaySummary() {
        let summary: [String: Any] = [
            "date": ISO8601DateFormatter().string(from: Date()),
            "totals": [
                // Example structure: you can evolve this later
                "com.burbn.instagram": 0,
                "pornhub.com": 0
            ]
        ]
        if let url = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroup)?.appendingPathComponent(fileName),
           let data = try? JSONSerialization.data(withJSONObject: summary, options: .prettyPrinted) {
            try? data.write(to: url, options: .atomic)
        }
    }
}
