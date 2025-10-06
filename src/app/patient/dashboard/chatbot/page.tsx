// src/app/patient/dashboard/chatbot/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import type { ChatMessage } from '@/types';

export default function ChatbotPage() {
  const { selectedLanguage, user } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const t = useCallback((key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback), [selectedLanguage]);

  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 1,
      text: t('aiWelcome', 'Hello! I\'m Ayu-Raksha AI Assistant. How can I help you with your health concerns today?'),
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [selectedLanguage, t]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Mock AI response (replace with real API call)
  const callAI = async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          'Based on your symptoms, I recommend consulting with a healthcare professional. However, here are some general tips that might help...',
          'That\'s a great question! For personalized medical advice, please consult your doctor. In general...',
          'I understand your concern. While I can provide general health information, it\'s important to speak with a medical professional for accurate diagnosis.',
          'Thank you for sharing. Remember, this is general information and not a substitute for professional medical advice.',
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 1500);
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isAiTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsAiTyping(true);

    const aiResponseText = await callAI();

    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsAiTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-full">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('aiAssistant', 'AI Health Assistant')}
            </h1>
            <p className="text-sm text-gray-600">
              {t('aiAssistantSubtitle', 'Always here to help with your health questions')}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className={
                      message.sender === 'user'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-indigo-100 text-indigo-600'
                    }
                  >
                    {message.sender === 'user' ? user?.name?.charAt(0) || 'U' : 'AI'}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}

          {isAiTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">AI</AvatarFallback>
                </Avatar>
                <div className="px-4 py-3 rounded-2xl bg-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Input Form */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3 max-w-3xl mx-auto">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('chatPlaceholder', 'Type your health question...')}
            className="flex-1"
            disabled={isAiTyping}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            disabled={isAiTyping}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700"
            disabled={isAiTyping}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}