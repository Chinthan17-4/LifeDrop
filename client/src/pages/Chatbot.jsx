import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Heart, Sparkles } from "lucide-react";
import { chatWithGemini } from "../services/gemini";

const QUICK_QUESTIONS = [
  "Who is eligible to donate?",
  "What is the donation cool-down gap?",
  "Why is O- universal donor blood?",
  "What should I eat prior to donating?",
  "How does LifeDrop matching work?",
];

const INITIAL_MESSAGE = {
  id: "init",
  role: "assistant",
  text: "Hello! I am your LifeDrop Medical & AI Donation Assistant 🩸\n\nAsk me anything regarding eligibility guidelines, blood compatibility rules, or using the platform.",
  time: new Date().toISOString(),
};

export default function Chatbot() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { id: Date.now().toString(), role: "user", text: msg, time: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await chatWithGemini(msg);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: response.text,
        time: new Date().toISOString(),
        source: response.source,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "An error occurred retrieving guidance. Please try again shortly.",
          time: new Date().toISOString(),
        },
      ]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([INITIAL_MESSAGE]);

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="glass-dark overflow-hidden flex flex-col shadow-glass-lg"
        style={{ height: "calc(100vh - 150px)", minHeight: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100/80 bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C62828] flex items-center justify-center text-white shadow-[0_2px_10px_rgba(198,40,40,0.3)]">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-sm">LifeDrop Clinical AI Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] text-gray-400 font-medium">Ready & active</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message View Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-[#C62828] text-white shadow-sm"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xs sm:max-w-md ${
                  msg.role === "user" ? "items-end" : "items-start"
                } flex flex-col gap-1`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#C62828] text-white rounded-tr-none shadow-sm"
                      : "bg-white/80 border border-gray-100/90 text-gray-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 px-1 font-semibold">{formatTime(msg.time)}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C62828] text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/80 border border-gray-100 rounded-2xl p-3.5 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#C62828] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-[#C62828] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[#C62828] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested Queries */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Suggested Inquiries</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-white/70 border border-gray-200/80 text-gray-600 px-3 py-1.5 rounded-xl hover:bg-[#FDECEC] hover:text-[#C62828] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3.5 border-t border-gray-100/80 bg-white/50">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about donation eligibility or life-saving blood guidance..."
              disabled={loading}
              className="input-field"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-11 h-11 bg-[#C62828] text-white rounded-xl flex items-center justify-center shadow-[0_2px_10px_rgba(198,40,40,0.35)] hover:bg-[#8E0000] disabled:opacity-40 transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
            Educational aid only. Always consult registered medical personnel before clinical procedures.
          </p>
        </div>
      </div>
    </div>
  );
}
