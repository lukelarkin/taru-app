import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';
import { Message } from '../../lib/supa/types';

export default function AthenaScreen() {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: '1',
      text: 'Hello! I\'m Athena, your AI companion. How can I help you today?',
      createdAt: new Date(),
      user: {
        _id: 'athena',
        name: 'Athena',
        avatar: '🤖',
      },
    },
  ]);

  const promptChips = [
    {
      text: 'Talk through a craving',
      message: 'I\'m experiencing a craving right now and need help working through it.',
    },
    {
      text: 'Process an emotion',
      message: 'I\'m feeling overwhelmed and need help processing this emotion.',
    },
    {
      text: 'Get unstuck',
      message: 'I feel stuck in my recovery journey and need some guidance.',
    },
  ];

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: IMessage = {
        _id: Math.random().toString(),
        text: 'I understand what you\'re going through. Let\'s work through this together. Can you tell me more about how you\'re feeling right now?',
        createdAt: new Date(),
        user: {
          _id: 'athena',
          name: 'Athena',
          avatar: '🤖',
        },
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [aiResponse])
      );
    }, 1000);
  }, []);

  const onPressChip = (chip: typeof promptChips[0]) => {
    const userMessage: IMessage = {
      _id: Math.random().toString(),
      text: chip.message,
      createdAt: new Date(),
      user: {
        _id: 'user',
        name: 'You',
      },
    };
    onSend([userMessage]);
  };

  const onPressVoiceNote = () => {
    // TODO: Implement voice note recording
    console.log('Voice note pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Prompt Chips */}
      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {promptChips.map((chip, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => onPressChip(chip)}
            >
              <Text style={styles.chipText}>{chip.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 'user',
        }}
        placeholder="Type a message..."
        textInputProps={{
          style: styles.textInput,
        }}
        renderAvatar={() => null}
        renderBubble={(props) => (
          <View
            style={[
              styles.bubble,
              props.position === 'left' ? styles.bubbleLeft : styles.bubbleRight,
            ]}
          >
            <Text style={styles.bubbleText}>{props.currentMessage?.text}</Text>
          </View>
        )}
      />

      {/* Voice Note Button */}
      <TouchableOpacity style={styles.voiceButton} onPress={onPressVoiceNote}>
        <Ionicons name="mic" size={24} color={colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  chipsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  chip: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginRight: 8,
  },
  chipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: radius.md,
    marginVertical: 4,
  },
  bubbleLeft: {
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    backgroundColor: colors.accent,
    alignSelf: 'flex-end',
  },
  bubbleText: {
    color: colors.text,
    fontSize: 16,
  },
  voiceButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
