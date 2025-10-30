"use client";

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

export default function SkillsBackground({ baseColor }: { baseColor: string }) {
  // Generate random points procedurally inside the shader via ranges
  const points = useMemo(() => {
    const arr = new Float32Array(800 * 3);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (Math.random() - 0.5) * 12;
      arr[i + 1] = (Math.random() - 0.5) * 12;
      arr[i + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  return (
    <Canvas
      dpr={[0.6, 1]}
      orthographic
      camera={{ zoom: 60, position: [0, 0, 10] }}
      gl={{ antialias: false, alpha: true }}
      style={{ width: "100%", height: "100%", opacity: 0.35 }}
      className="pointer-events-none"
    >
      <ambientLight intensity={0.1} />
      <Points positions={points}>
        <PointMaterial
          transparent
          color={baseColor}
          size={0.03}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </Canvas>
  );
}
