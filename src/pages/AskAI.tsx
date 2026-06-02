import React, { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { AIBadge } from "../components/shared/AIBadge";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Hello! I'm ResearchOS AI. I can help you summarize papers, compare methodologies, identify research gaps, and generate insights across your projects. What would you like to explore today?",
  },
];

const quickPrompts = [
  "Summarize my latest paper",
  "What are gaps in my IonCast project?",
  "Compare NASICON vs Garnet conductivity papers",
  "Generate a literature review draft",
];

export function AskAI() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: input,
    };

    const responses: Record<string, string> = {
      "Summarize my latest paper":
        "Based on your NASICON Review 2023 paper, the key findings focus on 200+ NASICON compositions with Li1.3Al0.3Ti1.7(PO4)3 as the benchmark showing σ=7×10⁻⁴ S/cm. The review identifies structural features critical for high conductivity and potential pathways for optimization.",
      "What are gaps in my IonCast project?":
        "Your IonCast project shows strong progress (72%) but could benefit from: 1) Grain boundary effect modeling, 2) Extended validation on non-crystalline materials, 3) Uncertainty quantification framework, and 4) Real-time inference pipeline optimization.",
      "Compare NASICON vs Garnet conductivity papers":
        "Both NASICON and Garnet structures show similar ionic transport mechanisms but diverge in stability windows. NASICON excels in room-temperature conductivity while Garnet (LLZO) demonstrates superior mechanical stability and thermal robustness.",
      "Generate a literature review draft":
        "I've prepared a structured review across your 28 papers organized by: Fundamental Theory (5 papers), Experimental Methods (8 papers), Computational Approaches (7 papers), and Applications (8 papers). Would you like me to elaborate on any section?",
    };

    const aiMessage: Message = {
      id: Math.random().toString(),
      role: "ai",
      content:
        responses[input] ||
        "That's an interesting question. Based on your research, I would suggest exploring the intersection of machine learning and materials science in this area. Feel free to ask follow-up questions!",
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-sidebar">Ask AI</h1>
        <p className="text-gray-600 text-sm mt-1">
          Connected to 4 projects, 28 papers, 34 notes
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 bg-gradient-to-b from-transparent to-gray-50 p-4 rounded-card border border-border-light">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md ${
                message.role === "user"
                  ? "bg-accent text-white rounded-3xl px-6 py-3"
                  : "bg-card border border-border-light rounded-3xl px-6 py-3"
              }`}
            >
              {message.role === "ai" && (
                <div className="flex items-center gap-2 mb-2">
                  <AIBadge />
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts (only show before first user message) */}
      {messages.length <= 1 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs text-gray-500 font-medium uppercase">
            Quick prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-badge transition-colors font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
          <Paperclip size={20} className="text-gray-600" />
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask me anything about your research..."
          rows={3}
          className="flex-1 px-4 py-3 border border-border-light rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
