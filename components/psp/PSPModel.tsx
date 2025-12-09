'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface PSPModelProps {
  scale?: number;
  isMobile?: boolean;
}

export default function PSPModel({ scale = 2.5, isMobile = false }: PSPModelProps) {
  // Adjust scale for mobile
  const baseScale = isMobile ? scale * 0.75 : scale;
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Load the PSP GLB model
  const { scene } = useGLTF('/models/sony_psp.glb');
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance materials for better appearance
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [scene]);
  
  // Floating animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Subtle floating motion
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.03;
      
      // Very subtle rotation
      groupRef.current.rotation.x = 0.15 + Math.sin(time * 0.3) * 0.02;
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.03;
      
      // Hover effect
      const targetScale = hovered ? baseScale * 1.02 : baseScale;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });
  
  return (
    <Center>
      <group
        ref={groupRef}
        scale={baseScale}
        rotation={[0.15, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={clonedScene} />
      </group>
    </Center>
  );
}

// Preload the model
useGLTF.preload('/models/sony_psp.glb');


