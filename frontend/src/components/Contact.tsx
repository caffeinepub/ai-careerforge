import { useScrollAnimation } from '../hooks/useScrollAnimation';
import OrbitingIcons from './OrbitingIcons';
import ContactForm from './ContactForm';
import type { ContactLink } from '../backend';
import { Mail, Github, Linkedin } from 'lucide-react';

interface ContactProps {
  contactLinks: ContactLink[];
}

export default function Contact({ contactLinks }: ContactProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const getLink = (platform: string): string => {
    const link = contactLinks.find(l => l.platform.toLowerCase() === platform.toLowerCase());
    return link?.url ?? '#';
  };

  const emailUrl = getLink('email');
  const githubUrl = getLink('github');
  const linkedinUrl = getLink('linkedin');

  const handleEmail = () => { window.location.href = emailUrl; };
  const handleGithub = () => { window.open(githubUrl, '_blank', 'noopener,noreferrer'); };
  const handleLinkedin = () => { window.open(linkedinUrl, '_blank', 'noopener,noreferrer'); };

  return (
    <section
      id="contact"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #0a0520 50%, #050510 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-neon-cyan/5 blur-3xl" />
      </div>

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`section-fade-in ${isVisible ? 'visible' : ''} relative z-10 max-w-7xl mx-auto px-6`}
      >
        <div className="text-center mb-12">
          <div className="font-mono text-xs tracking-[0.5em] text-neon-cyan/60 mb-2">08 // THE CONNECTION</div>
          <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white">
            LET'S <span className="neon-text-cyan">CONNECT</span>
          </h2>
          <p className="font-mono text-sm text-white/40 mt-3">Click the orbiting objects to connect</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Orbiting icons scene */}
          <div className="w-full lg:w-1/2 h-[400px] relative">
            <OrbitingIcons
              onEmailClick={handleEmail}
              onGithubClick={handleGithub}
              onLinkedinClick={handleLinkedin}
            />
            {/* Labels */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
              {[
                { icon: Mail, label: 'EMAIL', color: '#00f5ff', action: handleEmail },
                { icon: Github, label: 'GITHUB', color: '#9d00ff', action: handleGithub },
                { icon: Linkedin, label: 'LINKEDIN', color: '#ff00c8', action: handleLinkedin },
              ].map(({ icon: Icon, label, color, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-1 transition-all hover:scale-110"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: `${color}20`, border: `1px solid ${color}40` }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span className="font-mono text-xs" style={{ color }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="w-full lg:w-1/2">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
