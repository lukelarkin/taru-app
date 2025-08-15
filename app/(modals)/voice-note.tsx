import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';

export default function VoiceNoteModal() {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    // TODO: Implement actual recording with expo-av
    console.log('Recording started');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // TODO: Implement actual recording stop
    console.log('Recording stopped');
    Alert.alert('Voice Note', 'Voice note recorded successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Voice Note</Text>
        <Text style={styles.subtitle}>
          Tap and hold to record your message
        </Text>

        <View style={styles.recordingContainer}>
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordButtonActive]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={48}
              color={colors.text}
            />
          </TouchableOpacity>
          
          {isRecording && (
            <Text style={styles.recordingText}>Recording...</Text>
          )}
        </View>

        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.sub,
    textAlign: 'center',
    marginBottom: 60,
  },
  recordingContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  recordButtonActive: {
    backgroundColor: colors.accent2,
  },
  recordingText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
  },
  cancelText: {
    fontSize: 16,
    color: colors.sub,
  },
});
