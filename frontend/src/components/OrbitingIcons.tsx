import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAccessibility } from '../hooks/useAccessibility';

interface OrbitObject {
  label: string;
  color: string;
  radius: number;
  speed: number;
  offset: number;
  action: () => void;
}

function OrbitingObject({ obj }: { obj: OrbitObject }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { reducedMotion } = useAccessibility();

  useFrame((state) => {
    if (meshRef.current && !reducedMotion) {
      const t = state.clock.elapsedTime * obj.speed + obj.offset;
      meshRef.current.position.x = Math.cos(t) * obj.radius;
      meshRef.current.position.z = Math.sin(t) * obj.radius;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={obj.action}
      onPointerEnter={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerLeave={() => { document.body.style.cursor = 'none'; }}
    >
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial
        color={obj.color}
        emissive={obj.color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { reducedMotion } = useAccessibility();

  useFrame((state) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.y += 0.01;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial
        color="#00f5ff"
        emissive="#00f5ff"
        emissiveIntensity={0.8}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

interface OrbitingIconsProps {
  onEmailClick: () => void;
  onGithubClick: () => void;
  onLinkedinClick: () => void;
}

export default function OrbitingIcons({ onEmailClick, onGithubClick, onLinkedinClick }: OrbitingIconsProps) {
  const objects: OrbitObject[] = [
    { label: 'Email', color: '#00f5ff', radius: 2, speed: 0.5, offset: 0, action: onEmailClick },
    { label: 'GitHub', color: '#9d00ff', radius: 2.5, speed: 0.35, offset: 2.1, action: onGithubClick },
    { label: 'LinkedIn', color: '#ff00c8', radius: 2, speed: 0.45, offset: 4.2, action: onLinkedinClick },
  ];

  return (
    <Canvas
      camera={{ position: [0, 3, 6], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} color="#00f5ff" intensity={3} />
      <pointLight position={[5, 5, 5]} color="#9d00ff" intensity={1} />
      <CoreSphere />
      {objects.map((obj, i) => (
        <OrbitingObject key={i} obj={obj} />
      ))}
    </Canvas>
  );
}
