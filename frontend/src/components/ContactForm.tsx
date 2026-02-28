import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import MagneticButton from './MagneticButton';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
  size: number;
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const burstActiveRef = useRef(false);

  useEffect(() => {
    // Animate form in with particle dissolve
    setTimeout(() => setVisible(true), 300);
  }, []);

  const triggerBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const colors = ['#00f5ff', '#9d00ff', '#ff00c8', '#00ff88'];
    particlesRef.current = Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
      };
    });

    burstActiveRef.current = true;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.opacity -= 0.02;
        if (p.opacity > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      });

      if (alive) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        burstActiveRef.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerBurst();
    setSubmitted(true);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      <div
        className={`glass-card neon-glow-cyan p-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-4 blur-sm'
        }`}
      >
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <CheckCircle size={48} className="text-neon-green animate-in zoom-in duration-500" />
            <div className="font-orbitron text-lg text-neon-green">MESSAGE SENT!</div>
            <div className="font-mono text-xs text-white/40 text-center">
              Thank you for reaching out. I'll get back to you soon.
            </div>
            <button
              onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); }}
              className="font-mono text-xs text-neon-cyan/60 hover:text-neon-cyan transition-colors mt-2"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="font-orbitron text-xs tracking-widest text-neon-cyan mb-4">SEND A MESSAGE</div>

            <div>
              <label className="font-mono text-xs text-white/40 block mb-1">NAME</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full bg-white/5 border border-neon-cyan/20 rounded-sm px-3 py-2 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan/50 transition-colors"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-white/40 block mb-1">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-neon-cyan/20 rounded-sm px-3 py-2 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan/50 transition-colors"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-white/40 block mb-1">MESSAGE</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="What's on your mind?"
                className="w-full bg-white/5 border border-neon-cyan/20 rounded-sm px-3 py-2 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan/50 transition-colors resize-none"
              />
            </div>

            <MagneticButton
              className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon-cyan"
            >
              <Send size={14} />
              TRANSMIT MESSAGE
            </MagneticButton>
          </form>
        )}
      </div>
    </div>
  );
}
