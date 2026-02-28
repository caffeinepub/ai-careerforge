import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAccessibility } from '../hooks/useAccessibility';

const FORMULAS = [
  'E = mc²', '∇²φ = 0', 'F = ma', 'i² = -1',
  'eⁱᵖ + 1 = 0', 'H = -Σp log p', 'ds² = -c²dt²',
  'Σ = ∫∫∫', '∂ψ/∂t', 'λ = h/mv',
];

function Grid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  const { reducedMotion } = useAccessibility();

  useFrame((state) => {
    if (gridRef.current && !reducedMotion) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[200, 80, '#00f5ff', '#1a1a3e']}
      rotation={[0, 0, 0]}
      position={[0, -2, -20]}
    />
  );
}

function FloatingFormula({ text, position }: { text: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { reducedMotion } = useAccessibility();

  useFrame((state) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[2.5, 0.5]} />
      <meshBasicMaterial color="#00f5ff" transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function HeroGrid() {
  return (
    <Canvas
      camera={{ position: [0, 3, 10], fov: 60 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} color="#00f5ff" intensity={2} />
      <Grid />
      {FORMULAS.map((formula, i) => (
        <FloatingFormula
          key={formula}
          text={formula}
          position={[
            (Math.random() - 0.5) * 20,
            Math.random() * 4 - 1,
            -5 - Math.random() * 15,
          ]}
        />
      ))}
      <fog attach="fog" args={['#050510', 10, 60]} />
    </Canvas>
  );
}
