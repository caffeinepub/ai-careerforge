export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'nexus-portfolio'
  );

  return (
    <footer className="relative py-8 border-t border-neon-cyan/10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-orbitron text-sm font-black tracking-widest neon-text-cyan">
          NEXUS
        </div>

        <div className="font-mono text-xs text-white/30 text-center">
          © {year} NEXUS Portfolio. All rights reserved.
        </div>

        <div className="font-mono text-xs text-white/30">
          Built with{' '}
          <span className="text-neon-magenta">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
