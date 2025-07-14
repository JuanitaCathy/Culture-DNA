import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

type Node = {
  name: string;
  color: string;
  affinity_score?: number;
  category?: string;
};

type Props = {
  nodes: Node[];
  onNodeClick?: (node: Node) => void;
};

function DNANode({ 
  position, 
  color, 
  name, 
  onClick, 
  node 
}: { 
  position: [number, number, number]; 
  color: string; 
  name: string; 
  onClick?: () => void;
  node: Node;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
      
      // Scale on hover
      const targetScale = hovered ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={position}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={hovered ? 0.2 : 0.1}
        />
      </mesh>
      
      {/* Label */}
      {hovered && (
        <Text
          position={[position[0], position[1] + 0.8, position[2]]}
          fontSize={0.2}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  );
}

function HelixStructure({ nodes, onNodeClick }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const helixData = useMemo(() => {
    const points: Array<{
      position: [number, number, number];
      color: string;
      name: string;
      node: Node;
    }> = [];
    
    const radius = 3;
    const height = 20;
    const turns = 3;
    const segments = Math.max(nodes.length, 20);

    // Create double helix
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * turns * Math.PI * 2;
      const y = (i / segments) * height - height / 2;
      
      // First strand
      const x1 = radius * Math.cos(angle);
      const z1 = radius * Math.sin(angle);
      
      // Second strand (offset by π)
      const x2 = radius * Math.cos(angle + Math.PI);
      const z2 = radius * Math.sin(angle + Math.PI);
      
      if (nodes[i]) {
        points.push({
          position: [x1, y, z1],
          color: nodes[i].color,
          name: nodes[i].name,
          node: nodes[i]
        });
      }
      
      if (nodes[i + segments / 2]) {
        points.push({
          position: [x2, y, z2],
          color: nodes[i + segments / 2].color,
          name: nodes[i + segments / 2].name,
          node: nodes[i + segments / 2]
        });
      }
    }
    
    return points;
  }, [nodes]);

  // Create connecting lines between strands
  const connections = useMemo(() => {
    const lines: Array<[number, number, number][]> = [];
    const radius = 3;
    const height = 20;
    const turns = 3;
    const segments = 50;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * turns * Math.PI * 2;
      const y = (i / segments) * height - height / 2;
      
      const x1 = radius * Math.cos(angle);
      const z1 = radius * Math.sin(angle);
      const x2 = radius * Math.cos(angle + Math.PI);
      const z2 = radius * Math.sin(angle + Math.PI);
      
      if (i % 3 === 0) { // Every 3rd connection
        lines.push([[x1, y, z1], [x2, y, z2]]);
      }
    }
    
    return lines;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* DNA Nodes */}
      {helixData.map((point, i) => (
        <DNANode
          key={`${point.node.name}-${i}`}
          position={point.position}
          color={point.color}
          name={point.name}
          node={point.node}
          onClick={() => onNodeClick?.(point.node)}
        />
      ))}
      
      {/* Connecting lines */}
      {connections.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line[0], ...line[1]])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ff80" opacity={0.3} transparent />
        </line>
      ))}
      
      {/* Helix backbone */}
      <mesh>
        <torusGeometry args={[3, 0.02, 8, 100]} />
        <meshBasicMaterial color="#ff0080" opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

export default function DNAStrandVisualizer({ nodes, onNodeClick }: Props) {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'radial-gradient(circle, #001122 0%, #000000 100%)' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#00ff80" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0080" />
        <spotLight position={[0, 20, 0]} intensity={0.5} color="#0080ff" />
        
        <HelixStructure nodes={nodes} onNodeClick={onNodeClick} />
      </Canvas>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 space-y-1">
        <div>🖱️ Click nodes for details</div>
        <div>🔄 Auto-rotating helix</div>
        <div>✨ Hover for labels</div>
      </div>
    </div>
  );
}