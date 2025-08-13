import React, { useEffect } from "react";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { flushQueuedEvents } from "./lib/pineconeClient";
import { Slot } from 'expo-router';

export default function App() {
  useEffect(() => {
    // Auto-flush on app focus
    const appStateSub = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        console.log('📱 App became active, attempting to flush events...');
        await flushQueuedEvents();
      }
    });

    // Auto-flush when network becomes available
    const netInfoSub = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        console.log('📡 Network connected, attempting to flush events...');
        await flushQueuedEvents();
      }
    });

    // First attempt on boot
    console.log('🚀 App booted, attempting initial flush...');
    flushQueuedEvents();

    return () => {
      appStateSub.remove();
      netInfoSub();
    };
  }, []);

  return <Slot />;
}
