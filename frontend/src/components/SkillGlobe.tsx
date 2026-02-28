import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAccessibility } from '../hooks/useAccessibility';

interface SkillNode {
  name: string;
  position: THREE.Vector3;
  connections: number[];
  color: string;
}

function buildSkillNodes(skills: string[]): SkillNode[] {
  const colors = ['#00f5ff', '#9d00ff', '#ff00c8', '#00ff88'];
  return skills.map((name, i) => {
    const phi = Math.acos(-1 + (2 * i) / skills.length);
    const theta = Math.sqrt(skills.length * Math.PI) * phi;
    const r = 3;
    return {
      name,
      position: new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ),
      connections: [
        (i + 1) % skills.length,
        (i + 2) % skills.length,
        (i + Math.floor(skills.length / 3)) % skills.length,
      ],
      color: colors[i % colors.length],
    };
  });
}

function ConnectionLine({ start, end, color, opacity }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  opacity: number;
}) {
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
    return geom;
  }, [start, end]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  }, [color, opacity]);

  return <primitive object={new THREE.Line(geometry, material)} />;
}

function GlobeScene({ skills }: { skills: string[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const { reducedMotion } = useAccessibility();

  const nodes = useMemo(() => buildSkillNodes(skills), [skills]);

  useFrame((state, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sphere wireframe */}
      <mesh>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.05} />
      </mesh>

      {/* Base connections */}
      {nodes.map((node, i) =>
        node.connections.slice(0, 1).map((connIdx) => {
          const connNode = nodes[connIdx];
          return (
            <ConnectionLine
              key={`base-${i}-${connIdx}`}
              start={node.position}
              end={connNode.position}
              color="#00f5ff"
              opacity={0.1}
            />
          );
        })
      )}

      {/* Hover connection lines */}
      {hoveredNode !== null &&
        nodes[hoveredNode].connections.map((connIdx) => {
          const connNode = nodes[connIdx];
          return (
            <ConnectionLine
              key={`hover-${hoveredNode}-${connIdx}`}
              start={nodes[hoveredNode].position}
              end={connNode.position}
              color={nodes[hoveredNode].color}
              opacity={0.8}
            />
          );
        })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh
            position={node.position}
            onPointerEnter={() => setHoveredNode(i)}
            onPointerLeave={() => setHoveredNode(null)}
          >
            <sphereGeometry args={[hoveredNode === i ? 0.15 : 0.08, 8, 8]} />
            <meshBasicMaterial color={node.color} />
          </mesh>

          {/* Glow */}
          <mesh position={node.position}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={hoveredNode === i ? 0.4 : 0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

interface SkillGlobeProps {
  skills: string[];
}

export default function SkillGlobe({ skills }: SkillGlobeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#00f5ff" intensity={2} />
      <pointLight position={[-5, -5, -5]} color="#9d00ff" intensity={1} />
      <GlobeScene skills={skills} />
    </Canvas>
  );
}
