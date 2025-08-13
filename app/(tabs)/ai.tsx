import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../ui/designSystem';
import { Text } from '../../ui/Text';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Icon } from '../../ui/Icon';
import { haptics } from '../../lib/haptics';

// AI Persona types for different emotional states
const aiPersonas = [
  {
    id: 'resentment',
    title: 'Resentment',
    description: 'Release built-up frustration',
    icon: 'flash',
    color: colors.amber,
  },
  {
    id: 'shame',
    title: 'Shame',
    description: 'Compassionate self-acceptance',
    icon: 'heart',
    color: colors.salmon,
  },
  {
    id: 'craving',
    title: 'Craving',
    description: 'Navigate digital urges',
    icon: 'phone-portrait',
    color: colors.aqua,
  },
  {
    id: 'anger',
    title: 'Anger',
    description: 'Find inner calm',
    icon: 'flame',
    color: colors.salmon,
  },
  {
    id: 'grief',
    title: 'Grief',
    description: 'Gentle healing support',
    icon: 'cloud',
    color: colors.aqua,
  },
  {
    id: 'denial',
    title: 'Denial',
    description: 'Honest self-reflection',
    icon: 'eye',
    color: colors.amber,
  },
  {
    id: 'self-deception',
    title: 'Self-Deception',
    description: 'Clarity and truth',
    icon: 'glasses',
    color: colors.jade,
  },
  {
    id: 'lust',
    title: 'Lust',
    description: 'Redirect energy mindfully',
    icon: 'heart',
    color: colors.salmon,
  },
];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIScreen() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello, I\'m here to support your recovery journey. How are you feeling right now?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handlePersonaSelect = (personaId: string) => {
    haptics.light();
    setSelectedPersona(personaId);
    
    // Add persona-specific message
    const persona = aiPersonas.find(p => p.id === personaId);
    const newMessage: Message = {
      id: Date.now().toString(),
      text: `I understand you're feeling ${persona?.title.toLowerCase()}. Let's work through this together. What's on your mind?`,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    haptics.light();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // TODO: Replace with actual AI response
    // For now, simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I hear you. That sounds challenging. Can you tell me more about what\'s driving this feeling?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="displayLarge" style={styles.title}>
            AI Recovery
          </Text>
          <Text variant="bodyLarge" color="textSecondary" style={styles.subtitle}>
            Compassionate support for your journey
          </Text>
        </View>

        {/* Persona Selection */}
        {!selectedPersona && (
          <View style={styles.personaSection}>
            <Text variant="displaySmall" style={styles.sectionTitle}>
              How are you feeling?
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.personaScroll}
            >
              {aiPersonas.map((persona) => (
                <TouchableOpacity
                  key={persona.id}
                  style={styles.personaCard}
                  onPress={() => handlePersonaSelect(persona.id)}
                  activeOpacity={0.8}
                >
                  <View 
                    style={[
                      styles.personaIcon, 
                      { backgroundColor: persona.color }
                    ]}
                  >
                    <Icon name={persona.icon as any} size="medium" color="white" />
                  </View>
                  <Text variant="bodyMedium" style={styles.personaTitle}>
                    {persona.title}
                  </Text>
                  <Text variant="caption" color="textSecondary" style={styles.personaDescription}>
                    {persona.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Chat Messages */}
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <Card 
                variant={message.isUser ? 'surface' : 'glass'} 
                style={styles.messageCard}
              >
                <Text variant="bodyMedium" color={message.isUser ? 'textPrimary' : 'white'}>
                  {message.text}
                </Text>
              </Card>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: inputText.trim() ? 1 : 0.5 }
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Icon name="send" size="small" color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    opacity: 0.8,
  },
  personaSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  personaScroll: {
    paddingHorizontal: spacing.lg,
  },
  personaCard: {
    width: 120,
    marginRight: spacing.md,
    alignItems: 'center',
  },
  personaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  personaTitle: {
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  personaDescription: {
    textAlign: 'center',
    fontSize: 11,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glass,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.sand,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    maxHeight: 100,
    color: colors.textPrimary,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: colors.jade,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 