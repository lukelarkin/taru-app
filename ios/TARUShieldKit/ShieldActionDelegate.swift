import ManagedSettings
import ManagedSettingsUI
import UIKit
import UserNotifications

final class TARUShieldActionDelegate: ShieldActionDelegate {

    override func handle(action: ShieldAction, for application: Application, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        switch action {
        case .primaryButtonPressed:
            Self.notifyResetPrompt()
            completionHandler(.close)
        case .secondaryButtonPressed:
            completionHandler(.close)
        @unknown default:
            completionHandler(.close)
        }
    }

    override func handle(action: ShieldAction, for webDomain: WebDomain, completionHandler: @escaping (ShieldActionResponse) -> Void) {
        switch action {
        case .primaryButtonPressed:
            Self.notifyResetPrompt()
            completionHandler(.close)
        case .secondaryButtonPressed:
            completionHandler(.close)
        @unknown default:
            completionHandler(.close)
        }
    }

    private static func notifyResetPrompt() {
        let content = UNMutableNotificationContent()
        content.title = "Pause. Reset. Recover."
        content.body  = "Tap to do a 60–90s reset now."
        content.sound = .default
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 0.5, repeats: false)
        let req = UNNotificationRequest(identifier: UUID().stringValue, content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(req, withCompletionHandler: nil)
    }
}

private extension UUID { var stringValue: String { uuidString } }
