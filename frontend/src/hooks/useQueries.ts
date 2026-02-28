import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Student } from '../backend';

// Default student data for when no backend data is available
export const DEFAULT_STUDENT: Student = {
  name: 'ALEX NEXUS',
  bio: 'A visionary student engineer at the intersection of AI, design, and human experience. Building the future one line of code at a time.',
  timeline: [
    { title: 'The Beginning', date: '2019', description: 'Started coding at age 16. Built first website in a weekend. Never looked back.' },
    { title: 'First Hackathon', date: '2020', description: 'Won 1st place at RegionalHack 2020. Built an AI-powered accessibility tool in 24 hours.' },
    { title: 'University Admission', date: '2021', description: 'Accepted to top CS program. Scholarship recipient. Joined robotics and AI research lab.' },
    { title: 'Open Source Milestone', date: '2022', description: 'First open source project hit 1,000 GitHub stars. Featured in Dev.to weekly digest.' },
    { title: 'Research Publication', date: '2023', description: 'Co-authored paper on neural interface design. Presented at IEEE conference.' },
    { title: 'Internship at FAANG', date: '2024', description: 'Software engineering intern. Shipped feature used by 50M+ users. Received return offer.' },
    { title: 'NEXUS Launch', date: '2025', description: 'Launched this portfolio. The journey continues into the future...' },
  ],
  skills: [
    'React', 'TypeScript', 'Three.js', 'Python', 'Machine Learning',
    'Node.js', 'WebGL', 'Rust', 'TensorFlow', 'GraphQL',
    'Docker', 'Kubernetes', 'AWS', 'Figma', 'WebAssembly',
    'Solidity', 'Swift', 'Go', 'PostgreSQL', 'Redis'
  ],
  projects: [
    {
      title: 'NeuralVision AI',
      description: 'Real-time object detection system using custom CNN architecture. Achieves 98.7% accuracy on benchmark datasets. Deployed on edge devices.',
      link: 'https://github.com'
    },
    {
      title: 'QuantumChat',
      description: 'End-to-end encrypted messaging platform with quantum-resistant cryptography. 10,000+ active users. Zero data breaches.',
      link: 'https://github.com'
    },
    {
      title: 'EcoTrack Globe',
      description: 'Interactive 3D visualization of global carbon emissions. Used by 3 NGOs for climate advocacy. Featured in TechCrunch.',
      link: 'https://github.com'
    },
    {
      title: 'BioSync Wearable',
      description: 'IoT health monitoring system with predictive analytics. Detects anomalies 48 hours before symptoms appear. Patent pending.',
      link: 'https://github.com'
    },
    {
      title: 'MetaLearn Platform',
      description: 'Adaptive learning platform using spaced repetition and AI tutoring. 500+ students improved grades by average 23%.',
      link: 'https://github.com'
    },
  ],
  achievements: [
    'Harvard CS50 Certificate of Excellence',
    '1st Place — RegionalHack 2020',
    'IEEE Best Paper Award 2023',
    'Google Developer Expert (Web Technologies)',
    'Forbes 30 Under 30 Nominee 2025',
    'Open Source Contributor of the Year — GitHub',
  ],
  contactLinks: [
    { platform: 'email', url: 'mailto:alex@nexus.dev' },
    { platform: 'github', url: 'https://github.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' },
  ]
};

export function useGetStudent() {
  const { actor, isFetching } = useActor();

  return useQuery<Student>({
    queryKey: ['student'],
    queryFn: async () => {
      if (!actor) return DEFAULT_STUDENT;
      try {
        const key = await actor.getStudentRecordKey();
        const result = await actor.getStudent(key);
        if (result && result.name) return result;
        return DEFAULT_STUDENT;
      } catch {
        return DEFAULT_STUDENT;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}
