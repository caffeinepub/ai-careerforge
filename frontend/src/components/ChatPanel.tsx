import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import type { Student } from '../backend';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const RESPONSES: Record<string, string> = {
  default: "I'm NEXUS AI, your guide to Alex's portfolio. Ask me about skills, projects, achievements, or background!",
  skills: "Alex has mastered 20+ technologies including React, Three.js, Python, Machine Learning, and WebGL. The skill matrix section shows all connections!",
  projects: "Alex has built 5 major projects: NeuralVision AI (98.7% accuracy), QuantumChat (10K users), EcoTrack Globe (featured in TechCrunch), BioSync Wearable (patent pending), and MetaLearn Platform.",
  achievements: "Alex has won 1st place at RegionalHack 2020, received the IEEE Best Paper Award 2023, became a Google Developer Expert, and was nominated for Forbes 30 Under 30.",
  contact: "You can reach Alex via email at alex@nexus.dev, on GitHub, or LinkedIn. Check the Contact section below!",
  background: "Alex started coding at 16, won their first hackathon, got into a top CS program on scholarship, published research at IEEE, and interned at a FAANG company.",
  hello: "Hello! I'm the NEXUS AI assistant. I can tell you all about Alex's journey, skills, projects, and achievements. What would you like to know?",
  future: "Alex's vision is to build AI systems that augment human creativity — bridging the gap between machine intelligence and artistic expression.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('skill') || lower.includes('tech') || lower.includes('language')) return RESPONSES.skills;
  if (lower.includes('project') || lower.includes('work') || lower.includes('build')) return RESPONSES.projects;
  if (lower.includes('achiev') || lower.includes('award') || lower.includes('win')) return RESPONSES.achievements;
  if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) return RESPONSES.contact;
  if (lower.includes('background') || lower.includes('story') || lower.includes('journey')) return RESPONSES.background;
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return RESPONSES.hello;
  if (lower.includes('future') || lower.includes('goal') || lower.includes('vision')) return RESPONSES.future;
  return RESPONSES.default;
}

interface ChatPanelProps {
  student: Student;
}

export default function ChatPanel({ student }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `Hello! I'm NEXUS AI — ${student.name}'s intelligent portfolio assistant. Ask me anything about their journey, skills, or projects!` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: getResponse(userMsg) }]);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="glass-card neon-glow-cyan flex flex-col h-96">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-neon-cyan/20">
        <div className="w-8 h-8 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center">
          <Bot size={14} className="text-neon-cyan" />
        </div>
        <div>
          <div className="font-orbitron text-xs text-neon-cyan tracking-widest">NEXUS AI</div>
          <div className="font-mono text-xs text-white/30">Portfolio Assistant</div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="font-mono text-xs text-neon-green">ONLINE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'ai' ? 'bg-neon-cyan/20 border border-neon-cyan/40' : 'bg-neon-violet/20 border border-neon-violet/40'
            }`}>
              {msg.role === 'ai' ? <Bot size={10} className="text-neon-cyan" /> : <User size={10} className="text-neon-violet" />}
            </div>
            <div
              className={`max-w-xs px-3 py-2 rounded-lg font-mono text-xs leading-relaxed ${
                msg.role === 'ai'
                  ? 'bg-neon-cyan/5 border border-neon-cyan/20 text-white/80'
                  : 'bg-neon-violet/10 border border-neon-violet/20 text-white/80'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center">
              <Bot size={10} className="text-neon-cyan" />
            </div>
            <div className="bg-neon-cyan/5 border border-neon-cyan/20 px-3 py-2 rounded-lg flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neon-cyan/20 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about skills, projects..."
          className="flex-1 bg-white/5 border border-neon-cyan/20 rounded-sm px-3 py-2 font-mono text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan/50 transition-colors"
        />
        <button
          onClick={sendMessage}
          className="w-8 h-8 rounded-sm bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/30 transition-colors"
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}
