"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  ImagePlus,
  Bot,
  User,
  Shield,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import MedicalDisclaimer from "@/components/health/medical-disclaimer";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const suggestions = [
  "What are the symptoms of flu?",
  "How to treat a minor burn?",
  "When should I see a doctor for a headache?",
  "What foods boost the immune system?",
];

const welcomeMessage: Message = {
  id: "welcome",
  content:
    "Hello! I'm your AI Medical Assistant. I can help you with:\n\n\u2022 General health information\n\u2022 Symptom analysis\n\u2022 Medication guidance\n\u2022 Wellness tips\n\u2022 Emergency instructions\n\n\u26a0\ufe0f Please remember: I provide general health information only and cannot replace professional medical advice. For emergencies, always call 911.\n\nHow can I help you today?",
  role: "assistant",
  timestamp: new Date(),
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const chatMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const response = await api.ai.chat(chatMessages);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I couldn't process your request right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {showDisclaimer && (
        <MedicalDisclaimer variant="banner" dismissible />
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-5 py-3.5",
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-accent text-white"
                      : "border border-border bg-card text-foreground"
                  )}
                >
                  {message.role === "assistant" && (
                    <p className="mb-2 text-xs font-semibold text-primary">
                      AI Assistant
                    </p>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-[10px]",
                      message.role === "user"
                        ? "text-white/60"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="rounded-2xl border border-border bg-card px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
                      <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
                      <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length <= 2 && (
        <div className="border-t border-border bg-background/50 px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-border bg-background px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >
          <button
            type="button"
            className="shrink-0 rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Attach image"
          >
            <ImagePlus className="h-5 w-5" />
          </button>

          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Describe your symptoms or ask a health question..."
              rows={1}
              className="w-full resize-none rounded-2xl border border-border bg-card px-5 py-3.5 pr-12 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>

          <button
            type="button"
            className="shrink-0 rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Voice input"
          >
            <Mic className="h-5 w-5" />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-accent p-2.5 text-white transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          MediConnect AI provides general health information only. Not a
          substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
