import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAccessibility } from '../hooks/useAccessibility';

export interface ImpactPoint {
  lat: number;
  lng: number;
  height: number;
  label: string;
  stat: string;
  color: string;
}

const IMPACT_POINTS: ImpactPoint[] = [
  { lat: 37.7749, lng: -122.4194, height: 1.2, label: 'San Francisco', stat: '50M+ users', color: '#00f5ff' },
  { lat: 51.5074, lng: -0.1278, height: 0.9, label: 'London', stat: '3 NGOs', color: '#9d00ff' },
  { lat: 35.6762, lng: 139.6503, height: 0.8, label: 'Tokyo', stat: '1K stars', color: '#ff00c8' },
  { lat: -33.8688, lng: 151.2093, height: 0.6, label: 'Sydney', stat: 'IEEE Award', color: '#00ff88' },
  { lat: 48.8566, lng: 2.3522, height: 0.7, label: 'Paris', stat: 'TechCrunch', color: '#ff8800' },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Globe({ onPillarHover }: { onPillarHover: (point: ImpactPoint | null) => void }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const { reducedMotion } = useAccessibility();

  useFrame((_, delta) => {
    if (globeRef.current && !reducedMotion) {
      globeRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a2a"
          emissive="#050520"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[2.01, 16, 16]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Impact pillars */}
      {IMPACT_POINTS.map((point, i) => {
        const pos = latLngToVector3(point.lat, point.lng, 2);
        const pillarPos = pos.clone().normalize().multiplyScalar(2 + point.height / 2);

        return (
          <group key={i} position={pillarPos}>
            <mesh
              onPointerEnter={() => onPillarHover(point)}
              onPointerLeave={() => onPillarHover(null)}
            >
              <cylinderGeometry args={[0.03, 0.05, point.height, 6]} />
              <meshBasicMaterial color={point.color} transparent opacity={0.9} />
            </mesh>
            {/* Glow */}
            <mesh>
              <cylinderGeometry args={[0.08, 0.1, point.height, 6]} />
              <meshBasicMaterial color={point.color} transparent opacity={0.15} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

interface GlobeSceneProps {
  onPillarHover: (point: ImpactPoint | null) => void;
}

export default function GlobeScene({ onPillarHover }: GlobeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#00f5ff" intensity={3} />
      <pointLight position={[-5, -5, -5]} color="#9d00ff" intensity={1} />
      <Globe onPillarHover={onPillarHover} />
    </Canvas>
  );
}
