"use client";
import React, { useState } from "react";
import { PaperAirplaneIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const AnocareChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: "user" | "ai" }[]
  >([]);
  const [loading, setLoading] = useState(false);

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

    const userMsg = { id: Date.now(), text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const aiResponse = await sendPrompt(userMsg.text);
      const aiMsg = {
        id: Date.now() + 1,
        text: aiResponse || "Sorry, I couldn't understand that.",
        sender: "ai" as const,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 2,
        text: "Something went wrong. Please try again later.",
        sender: "ai" as const,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Anocare AI Health Chat</h1>
        </div>
        <span className="text-sm text-gray-500">Anonymous Mode</span>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-md px-4 py-3 rounded-lg shadow-sm w-fit ${
              msg.sender === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md px-4 py-3 rounded-lg shadow-sm w-fit bg-gray-100 dark:bg-gray-800"
          >
            <p className="text-sm">Typing...</p>
          </motion.div>
        )}
      </main>

      <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask a health question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="p-3 rounded-lg bg-primary text-white hover:bg-primary/90"
            disabled={loading}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AnocareChat;
