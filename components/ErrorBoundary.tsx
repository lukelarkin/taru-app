import React from "react";
import { View, Text, Pressable } from "react-native";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; err?: any };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any) { return { hasError: true, err: error }; }
  componentDidCatch(error: any, info: any) { console.error("ErrorBoundary", error, info); }
  reset = () => this.setState({ hasError: false, err: undefined });
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, padding: 24, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>Something went wrong.</Text>
          <Text style={{ opacity: 0.7, textAlign: "center", marginBottom: 16 }}>
            Resets still work offline. Try again.
          </Text>
          <Pressable
            onPress={this.reset}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            style={{ padding: 12, borderRadius: 12, backgroundColor: "#222" }}
          >
            <Text style={{ color: "white" }}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
