import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccessibilityContext, useAccessibilityState } from './hooks/useAccessibility';
import { CursorContext, useCursorState } from './hooks/useCursorContext';
import { useGetStudent } from './hooks/useQueries';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import AccessibilitySettings from './components/AccessibilitySettings';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import Projects from './components/Projects';
import AISandbox from './components/AISandbox';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { DEFAULT_STUDENT } from './hooks/useQueries';

function AppContent() {
  const [loaded, setLoaded] = useState(false);
  const { data: student } = useGetStudent();
  const studentData = student ?? DEFAULT_STUDENT;

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <div
        className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: '#050510', minHeight: '100vh' }}
      >
        <CustomCursor />
        <AccessibilitySettings />
        <main>
          <Hero student={studentData} />
          <Timeline milestones={studentData.timeline} />
          <Skills skills={studentData.skills} />
          <Projects projects={studentData.projects} />
          <AISandbox student={studentData} />
          <Achievements achievements={studentData.achievements} />
          <Contact contactLinks={studentData.contactLinks} />
        </main>
        <Footer />
      </div>
    </>
  );
}

function AppWithProviders() {
  const accessibilityState = useAccessibilityState();
  const cursorState = useCursorState();

  return (
    <AccessibilityContext.Provider value={accessibilityState}>
      <CursorContext.Provider value={cursorState}>
        <AppContent />
      </CursorContext.Provider>
    </AccessibilityContext.Provider>
  );
}

export default function App() {
  return <AppWithProviders />;
}
