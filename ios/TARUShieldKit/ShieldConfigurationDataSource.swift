import ManagedSettings
import ManagedSettingsUI
import UIKit

final class TARUShieldConfigurationDataSource: ShieldConfigurationDataSource {
    override func configuration(shielding application: Application) -> ShieldConfiguration {
        makeConfig(title: "Blocked", subtitle: "This app is currently blocked.")
    }
    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        makeConfig(title: "Site Blocked", subtitle: "\(webDomain.domain) is blocked.")
    }
    override func configuration(shielding applicationCategory: ActivityCategory) -> ShieldConfiguration {
        makeConfig(title: "Category Blocked", subtitle: "This category is restricted right now.")
    }

    private func makeConfig(title: String, subtitle: String) -> ShieldConfiguration {
        ShieldConfiguration(
            backgroundColor: .systemRed,
            title: .init(text: title, color: .white),
            subtitle: .init(text: subtitle, color: UIColor.white.withAlphaComponent(0.85)),
            primaryButtonLabel: .init(text: "Take a Reset"),
            secondaryButtonLabel: .init(text: "Close")
        )
    }
}
