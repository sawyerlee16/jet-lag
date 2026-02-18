"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, RootState } from "@react-three/fiber";
import { useGLTF, Center, Sky, Clouds, Cloud, Trail } from "@react-three/drei";
import * as THREE from "three";

function Logo() {
  const { scene } = useGLTF("/JetLagLogo.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Center>
      <primitive ref={ref} object={scene} scale={2} />
    </Center>
  );
}

type MouseRef = React.MutableRefObject<{ x: number; y: number }>;

type DriftCloudProps = {
  position: [number, number, number];
  seed: number;
  bounds: [number, number, number];
  volume: number;
  opacity: number;
  growth: number;
  speed: number;
  driftSpeed?: number;
  driftX?: number;
  driftY?: number;
  phase?: number;
  parallax?: number;
  mouseRef: MouseRef;
};

function DriftCloud({ position, driftSpeed = 0.08, driftX = 2, driftY = 0.6, phase = 0, parallax = 2, mouseRef, ...cloudProps }: DriftCloudProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * driftSpeed + phase;
    ref.current.position.x = position[0] + Math.sin(t) * driftX + mouseRef.current.x * parallax;
    ref.current.position.y = position[1] + Math.sin(t * 0.7 + 1.2) * driftY + mouseRef.current.y * parallax;
    ref.current.position.z = position[2];
  });

  return (
    <group ref={ref}>
      <Cloud color="white" {...cloudProps} />
    </group>
  );
}

function CloudLayer() {
  const mouseRef = useRef({ x: 0, y: 0 });

  // Smooth mouse tracking — single lerp shared by all clouds
  useFrame((state: RootState) => {
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, state.mouse.x, 0.04);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, state.mouse.y, 0.04);
  });

  return (
    <Clouds material={THREE.MeshLambertMaterial}>
      {/* Background — subtle parallax */}
      <DriftCloud mouseRef={mouseRef} parallax={1.2} position={[-10, 3, -22]} seed={1} bounds={[10, 3, 3]} volume={12} opacity={0.9} growth={5} speed={0.06} driftSpeed={0.07} driftX={3} driftY={0.8} phase={0} />
      <DriftCloud mouseRef={mouseRef} parallax={1.0} position={[9, -2, -20]} seed={2} bounds={[8, 3, 3]} volume={10} opacity={0.85} growth={5} speed={0.08} driftSpeed={0.09} driftX={2.5} driftY={0.7} phase={1.5} />
      <DriftCloud mouseRef={mouseRef} parallax={0.8} position={[0, 6, -25]} seed={3} bounds={[14, 3, 3]} volume={16} opacity={0.95} growth={6} speed={0.05} driftSpeed={0.05} driftX={4} driftY={0.5} phase={3.0} />
      <DriftCloud mouseRef={mouseRef} parallax={1.1} position={[-14, 0, -18]} seed={4} bounds={[8, 3, 3]} volume={10} opacity={0.8} growth={5} speed={0.07} driftSpeed={0.08} driftX={2} driftY={1.0} phase={0.8} />
      <DriftCloud mouseRef={mouseRef} parallax={0.9} position={[13, 4, -20]} seed={10} bounds={[7, 3, 3]} volume={9} opacity={0.85} growth={5} speed={0.09} driftSpeed={0.06} driftX={2.8} driftY={0.6} phase={2.2} />
      {/* Mid — medium parallax */}
      <DriftCloud mouseRef={mouseRef} parallax={2.5} position={[-9, 0, -8]} seed={5} bounds={[5, 2, 2]} volume={6} opacity={0.55} growth={3} speed={0.14} driftSpeed={0.11} driftX={1.5} driftY={0.5} phase={1.0} />
      <DriftCloud mouseRef={mouseRef} parallax={2.8} position={[8, 2, -9]} seed={6} bounds={[5, 2, 2]} volume={6} opacity={0.5} growth={3} speed={0.12} driftSpeed={0.10} driftX={1.8} driftY={0.4} phase={4.0} />
      <DriftCloud mouseRef={mouseRef} parallax={2.2} position={[0, -4, -7]} seed={11} bounds={[7, 2, 2]} volume={7} opacity={0.45} growth={3} speed={0.13} driftSpeed={0.09} driftX={2.2} driftY={0.6} phase={2.5} />
      <DriftCloud mouseRef={mouseRef} parallax={2.6} position={[-3, 5, -10]} seed={12} bounds={[5, 2, 2]} volume={5} opacity={0.5} growth={3} speed={0.11} driftSpeed={0.12} driftX={1.6} driftY={0.7} phase={5.0} />
      {/* Foreground wisps — strongest parallax */}
      <DriftCloud mouseRef={mouseRef} parallax={5.0} position={[-8, -1, 2]} seed={7} bounds={[4, 1.5, 1]} volume={3} opacity={0.18} growth={2} speed={0.22} driftSpeed={0.14} driftX={1.2} driftY={0.3} phase={0.3} />
      <DriftCloud mouseRef={mouseRef} parallax={5.5} position={[7, 2, 1]} seed={8} bounds={[4, 1.5, 1]} volume={3} opacity={0.15} growth={2} speed={0.2} driftSpeed={0.13} driftX={1.0} driftY={0.4} phase={3.8} />
      <DriftCloud mouseRef={mouseRef} parallax={4.8} position={[1, -3, 3]} seed={9} bounds={[5, 1.5, 1]} volume={3} opacity={0.12} growth={2} speed={0.16} driftSpeed={0.10} driftX={1.4} driftY={0.3} phase={1.8} />
    </Clouds>
  );
}

function Jet() {
  const groupRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  const DURATION = 9;     // seconds to cross screen
  const INTERVAL = 25;    // seconds between passes

  useFrame((_, delta) => {
    elapsed.current += delta;
    const cycle = elapsed.current % INTERVAL;
    if (!groupRef.current) return;

    if (cycle < DURATION) {
      const t = cycle / DURATION;
      groupRef.current.position.x = THREE.MathUtils.lerp(-30, 30, t);
      groupRef.current.position.y = THREE.MathUtils.lerp(3.5, 2.5, t);
      groupRef.current.position.z = -6;
    } else {
      // Park off-screen between passes
      groupRef.current.position.set(-100, 3, -6);
    }
  });

  const metal = <meshStandardMaterial color="#c8c8c8" metalness={0.75} roughness={0.2} />;

  return (
    <group ref={groupRef} position={[-100, 3, -6]} scale={1.4}>
      {/* Fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.1, 1.6, 10]} />
        {metal}
      </mesh>

      {/* Nose cone */}
      <mesh position={[1.0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.42, 10]} />
        {metal}
      </mesh>

      {/* Wings */}
      <mesh position={[0.05, -0.025, 0]}>
        <boxGeometry args={[0.5, 0.03, 2.0]} />
        {metal}
      </mesh>

      {/* Horizontal stabilizer */}
      <mesh position={[-0.72, 0, 0]}>
        <boxGeometry args={[0.24, 0.025, 0.85]} />
        {metal}
      </mesh>

      {/* Vertical stabilizer */}
      <mesh position={[-0.68, 0.22, 0]}>
        <boxGeometry args={[0.22, 0.36, 0.028]} />
        {metal}
      </mesh>

      {/* Right engine contrail */}
      <Trail width={0.55} length={80} color="white" attenuation={(w) => w * w} decay={1}>
        <group position={[-0.08, -0.07, 0.55]} />
      </Trail>

      {/* Left engine contrail */}
      <Trail width={0.55} length={80} color="white" attenuation={(w) => w * w} decay={1}>
        <group position={[-0.08, -0.07, -0.55]} />
      </Trail>
    </group>
  );
}

export default function SpinningLogo() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
    >
      <Sky
        distance={450000}
        sunPosition={[1, 0.4, 0]}
        turbidity={8}
        rayleigh={1.2}
        mieCoefficient={0.004}
        mieDirectionalG={0.82}
      />
      <fog attach="fog" args={["#b0cce8", 10, 42]} />
      <hemisphereLight args={["#87ceeb", "#c8a87a", 1.4]} />
      <directionalLight position={[8, 10, 4]} intensity={1.6} color="#fff8e8" />
      <directionalLight position={[-6, 2, 6]} intensity={0.35} color="#aad4f5" />
      <Suspense fallback={null}>
        <Logo />
        <CloudLayer />
        <Jet />
      </Suspense>
    </Canvas>
    <span
      style={{
        position: "absolute",
        bottom: "calc(50% - 80px)",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "var(--font-space-mono), monospace",
        fontSize: "14px",
        fontWeight: 400,
        letterSpacing: "0.15em",
        color: "white",
        textTransform: "uppercase",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      Stay Tuned
    </span>
    </div>
  );
}
