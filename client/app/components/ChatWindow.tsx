"use client";
import React, { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon, SparklesIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const AnocareChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: "user" | "ai"; timestamp: Date }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendPrompt = async (userMessage: string) => {
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: userMessage })
    });

    if (!res.ok) throw new Error("Failed to get AI response");

    const data = await res.json();
    return data.response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { 
      id: Date.now(), 
      text: input, 
      sender: "user" as const,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const aiResponse = await sendPrompt(userMsg.text);
      const aiMsg = {
        id: Date.now() + 1,
        text: aiResponse || "Sorry, I couldn't understand that.",
        sender: "ai" as const,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        id: Date.now() + 2,
        text: "Something went wrong. Please try again later.",
        sender: "ai" as const,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
            <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Anocare AI Health Chat</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by secure AI technology</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          Anonymous Mode
        </span>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col items-center justify-center text-center p-8"
          >
            <div className="max-w-md space-y-2">
              <SparklesIcon className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500" />
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Ask about your health concerns</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                This AI assistant provides general health information. For medical emergencies, please contact a healthcare professional.
              </p>
            </div>
          </motion.div>
        )}

        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl shadow-sm relative ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-200" : "text-gray-500 dark:text-gray-400"}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                  {msg.sender === "user" && (
                    <div className="absolute -bottom-3 right-0 w-4 h-4 overflow-hidden">
                      <div className="w-4 h-4 bg-blue-600 rotate-45 transform origin-bottom-right" />
                    </div>
                  )}
                  {msg.sender === "ai" && (
                    <div className="absolute -bottom-3 left-0 w-4 h-4 overflow-hidden">
                      <div className="w-4 h-4 bg-white dark:bg-gray-700 border-l border-b border-gray-200 dark:border-gray-600 rotate-45 transform origin-bottom-left" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-md px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask a health question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-3 rounded-full border dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={handleSend}
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Anocare AI doesn&apos;t provide medical diagnosis. Always consult a professional for serious concerns.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AnocareChat;