// lib/ai/client.ts
import OpenAI from "openai";

// In Expo: add OPENAI_API_KEY in app config or use secure storage during build.
export const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY
});
