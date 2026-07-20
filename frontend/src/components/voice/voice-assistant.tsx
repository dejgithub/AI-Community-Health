'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeOff,
  Loader2,
  X,
  Bot,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceAssistantProps {
  onTranscript?: (text: string) => void;
  className?: string;
}

type AssistantState = 'idle' | 'listening' | 'processing' | 'responded';

const mockResponses: Record<string, string> = {
  default:
    'I can help you with health-related questions. Please describe your symptoms or ask a health question.',
  fever:
    'A fever above 100.4F (38C) may indicate infection. Stay hydrated, rest, and monitor your temperature. Seek medical attention if it persists beyond 3 days.',
  headache:
    'Headaches can be caused by stress, dehydration, or tension. Try resting in a dark room, staying hydrated, and taking over-the-counter pain relief if needed.',
  cough:
    'A persistent cough lasting more than 2 weeks should be evaluated by a healthcare provider. In the meantime, stay hydrated and avoid irritants.',
  malaria:
    'Malaria symptoms include high fever, chills, and sweating. This is common in tropical regions. Seek immediate medical attention for proper diagnosis and treatment.',
};

function getMockResponse(text: string): string {
  const lower = text.toLowerCase();
  for (const [key, response] of Object.entries(mockResponses)) {
    if (key !== 'default' && lower.includes(key)) return response;
  }
  return mockResponses.default;
}

export default function VoiceAssistant({ onTranscript, className }: VoiceAssistantProps) {
  const [state, setState] = useState<AssistantState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setState('processing');
      setTimeout(() => {
        const mockText = 'I have been feeling feverish and have a headache';
        setTranscript(mockText);
        onTranscript?.(mockText);
        const resp = getMockResponse(mockText);
        setResponse(resp);
        setMessages((prev) => [
          ...prev,
          { role: 'user', text: mockText },
          { role: 'assistant', text: resp },
        ]);
        setState('responded');
      }, 2000);
    } else {
      setTranscript('');
      setResponse('');
      setIsListening(true);
      setState('listening');
    }
  };

  const reset = () => {
    setIsListening(false);
    setState('idle');
    setTranscript('');
    setResponse('');
  };

  return (
    <div
      className={cn(
        'w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Health Voice Assistant
          </span>
        </div>
        <button
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          title={ttsEnabled ? 'Mute text-to-speech' : 'Enable text-to-speech'}
        >
          {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeOff className="h-4 w-4" />}
        </button>
      </div>

      <div className="min-h-[140px] max-h-[260px] overflow-y-auto px-5 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'flex gap-2',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <Bot className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                )}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <User className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {state === 'listening' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </div>
            </div>
            <div className="flex items-center gap-[3px] rounded-xl bg-gray-100 px-3.5 py-3 dark:bg-gray-800">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-red-400"
                  animate={{
                    height: [8, Math.random() * 20 + 8, 8],
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {state === 'processing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Bot className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Processing...</span>
            </div>
          </motion.div>
        )}

        {!transcript && messages.length === 0 && state === 'idle' && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Mic className="mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Tap the microphone to ask a health question
            </p>
          </div>
        )}
      </div>

      {transcript && state === 'responded' && (
        <div className="mx-5 mb-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Transcribed:</span> &quot;{transcript}&quot;
          </p>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 border-t border-gray-100 px-5 py-4 dark:border-gray-800">
        <button
          onClick={reset}
          className={cn(
            'rounded-xl p-2.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800',
            (state === 'idle' || messages.length === 0) && 'invisible'
          )}
        >
          <X className="h-5 w-5" />
        </button>

        <button
          onClick={toggleListening}
          className={cn(
            'relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200',
            isListening
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600'
              : 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600'
          )}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
          {isListening && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-30" />
          )}
        </button>

        <button
          onClick={reset}
          className={cn(
            'rounded-xl px-3 py-2 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800',
            state !== 'responded' && 'invisible'
          )}
        >
          New
        </button>
      </div>
    </div>
  );
}
