// DNAStrandVisualizer.tsx
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Node = {
  name: string;
  color: string;
};

type Props = {
  nodes: Node[];
};

function Helix({ nodes }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const helixData = useMemo(() => {
    const points: { position: [number, number, number]; color: string; name: string }[] = [];
    const radius = 2;
    const height = 15;
    const turns = 2;
    const segments = nodes.length;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * turns * Math.PI * 2;
      const y = (i / segments) * height - height / 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      points.push({
        position: [x, y, z],
        color: nodes[i]?.color || "#ffffff",
        name: nodes[i]?.name || "Node",
      });
    }
    return points;
  }, [nodes]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {helixData.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
}

export default function DNAStrandVisualizer({ nodes }: Props) {
  return (
    <Canvas style={{ height: "500px" }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Helix nodes={nodes} />
    </Canvas>
  );
}
