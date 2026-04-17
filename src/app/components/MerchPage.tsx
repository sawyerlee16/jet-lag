"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { Canvas, useFrame, RootState } from "@react-three/fiber";
import { useGLTF, Center, Sky, Clouds, Cloud, Trail } from "@react-three/drei";
import * as THREE from "three";

// ─── Products ────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    name: "Tank — Navy",
    img: "/products/tank-navy.jpg",
    href: "https://jetlagrecords.bigcartel.com/product/jet-lag-tank-navy",
    x: 6,   y: 8,  rotation: -4, width: 270,
    mx: 3,  my: 4,
  },
  {
    name: "Tank — White",
    img: "/products/tank-white.jpg",
    href: "https://jetlagrecords.bigcartel.com/product/jet-lag-tank-white",
    x: 57,  y: 5,  rotation: 3,  width: 255,
    mx: 54, my: 12,
  },
  {
    name: "Tee — Navy",
    img: "/products/tee-navy.jpg",
    href: "https://jetlagrecords.bigcartel.com/product/jet-lag-heavy-tee-navy",
    x: 36,  y: 45, rotation: -1, width: 290,
    mx: 5,  my: 38,
  },
  {
    name: "Tee — White",
    img: "/products/tee-white.jpg",
    href: "https://jetlagrecords.bigcartel.com/product/jet-lag-heavy-tee-white",
    x: 70,  y: 33, rotation: 4,  width: 265,
    mx: 52, my: 42,
  },
  {
    name: "Snapback",
    img: "/products/snapback.jpg",
    href: "https://jetlagrecords.bigcartel.com/product/jet-lag-snapback",
    x: 14,  y: 55, rotation: -3, width: 255,
    mx: 25, my: 66,
  },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// ─── Three.js scene ───────────────────────────────────────────────────────────

function Logo() {
  const { scene } = useGLTF("/JetLagLogo.glb");
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25;
  });
  return (
    <Center>
      <primitive ref={ref} object={scene} scale={5} position={[0, 0, -2]} />
    </Center>
  );
}

useGLTF.preload("/JetLagLogo.glb");

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
  return <group ref={ref}><Cloud color="white" {...cloudProps} /></group>;
}

function CloudLayer() {
  const mouseRef = useRef({ x: 0, y: 0 });
  useFrame((state: RootState) => {
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, state.mouse.x, 0.04);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, state.mouse.y, 0.04);
  });
  return (
    <Clouds material={THREE.MeshLambertMaterial}>
      <DriftCloud mouseRef={mouseRef} parallax={1.2} position={[-10, 3, -22]} seed={1} bounds={[10, 3, 3]} volume={12} opacity={0.9} growth={5} speed={0.06} driftSpeed={0.07} driftX={3} driftY={0.8} phase={0} />
      <DriftCloud mouseRef={mouseRef} parallax={1.0} position={[9, -2, -20]} seed={2} bounds={[8, 3, 3]} volume={10} opacity={0.85} growth={5} speed={0.08} driftSpeed={0.09} driftX={2.5} driftY={0.7} phase={1.5} />
      <DriftCloud mouseRef={mouseRef} parallax={0.8} position={[0, 6, -25]} seed={3} bounds={[14, 3, 3]} volume={16} opacity={0.95} growth={6} speed={0.05} driftSpeed={0.05} driftX={4} driftY={0.5} phase={3.0} />
      <DriftCloud mouseRef={mouseRef} parallax={1.1} position={[-14, 0, -18]} seed={4} bounds={[8, 3, 3]} volume={10} opacity={0.8} growth={5} speed={0.07} driftSpeed={0.08} driftX={2} driftY={1.0} phase={0.8} />
      <DriftCloud mouseRef={mouseRef} parallax={0.9} position={[13, 4, -20]} seed={10} bounds={[7, 3, 3]} volume={9} opacity={0.85} growth={5} speed={0.09} driftSpeed={0.06} driftX={2.8} driftY={0.6} phase={2.2} />
      <DriftCloud mouseRef={mouseRef} parallax={2.5} position={[-9, 0, -8]} seed={5} bounds={[5, 2, 2]} volume={6} opacity={0.55} growth={3} speed={0.14} driftSpeed={0.11} driftX={1.5} driftY={0.5} phase={1.0} />
      <DriftCloud mouseRef={mouseRef} parallax={2.8} position={[8, 2, -9]} seed={6} bounds={[5, 2, 2]} volume={6} opacity={0.5} growth={3} speed={0.12} driftSpeed={0.10} driftX={1.8} driftY={0.4} phase={4.0} />
      <DriftCloud mouseRef={mouseRef} parallax={5.0} position={[-8, -1, 2]} seed={7} bounds={[4, 1.5, 1]} volume={3} opacity={0.18} growth={2} speed={0.22} driftSpeed={0.14} driftX={1.2} driftY={0.3} phase={0.3} />
      <DriftCloud mouseRef={mouseRef} parallax={5.5} position={[7, 2, 1]} seed={8} bounds={[4, 1.5, 1]} volume={3} opacity={0.15} growth={2} speed={0.2} driftSpeed={0.13} driftX={1.0} driftY={0.4} phase={3.8} />
    </Clouds>
  );
}

function Jet() {
  const groupRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const DURATION = 9;
  const INTERVAL = 25;
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
      groupRef.current.position.set(-100, 3, -6);
    }
  });
  const metal = <meshStandardMaterial color="#c8c8c8" metalness={0.75} roughness={0.2} />;
  return (
    <group ref={groupRef} position={[-100, 3, -6]} scale={1.4}>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.1, 1.6, 10]} />{metal}</mesh>
      <mesh position={[1.0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.06, 0.42, 10]} />{metal}</mesh>
      <mesh position={[0.05, -0.025, 0]}><boxGeometry args={[0.5, 0.03, 2.0]} />{metal}</mesh>
      <mesh position={[-0.72, 0, 0]}><boxGeometry args={[0.24, 0.025, 0.85]} />{metal}</mesh>
      <mesh position={[-0.68, 0.22, 0]}><boxGeometry args={[0.22, 0.36, 0.028]} />{metal}</mesh>
      <Trail width={0.55} length={80} color="white" attenuation={(w) => w * w} decay={1}><group position={[-0.08, -0.07, 0.55]} /></Trail>
      <Trail width={0.55} length={80} color="white" attenuation={(w) => w * w} decay={1}><group position={[-0.08, -0.07, -0.55]} /></Trail>
    </group>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

const CARD_MASK = "radial-gradient(ellipse 82% 88% at 50% 50%, black 20%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.4) 62%, transparent 78%)";

function ProductCard({
  product,
  depth,
  springX,
  springY,
  isMobile,
}: {
  product: (typeof PRODUCTS)[0];
  depth: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const offsetX = useTransform(springX, (v) => v * depth * (isMobile ? 6 : 20));
  const offsetY = useTransform(springY, (v) => v * depth * (isMobile ? 6 : 20));

  const x = isMobile ? product.mx : product.x;
  const y = isMobile ? product.my : product.y;
  const w = isMobile ? "42vw" : product.width;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: w,
        x: offsetX,
        y: offsetY,
        rotate: product.rotation,
        zIndex: hovered ? 10 : 4,
        opacity: 0.92,
        maskImage: CARD_MASK,
        WebkitMaskImage: CARD_MASK,
      }}
    >
      <Link href={product.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
        <motion.div
          whileHover={{ scale: 1.04, y: -10 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 250, damping: 22 }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
        >
          <div style={{ width: "100%", paddingBottom: "135%", position: "relative" }}>
            <Image
              src={product.img}
              alt={product.name}
              fill
              style={{ objectFit: "cover", display: "block" }}
              sizes="(max-width: 768px) 42vw, 300px"
            />
          </div>

          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: isMobile ? "10px 10px" : "18px 16px",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.95)", fontSize: isMobile ? 11 : 13, fontWeight: 500, letterSpacing: "0.06em", fontFamily: "Georgia, serif", margin: 0 }}>
              {product.name}
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: isMobile ? 9 : 10, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial, sans-serif", margin: "4px 0 0" }}>
              Shop →
            </p>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MerchPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 38, damping: 28 });
  const springY = useSpring(rawY, { stiffness: 38, damping: 28 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
    rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    rawX.set((t.clientX / window.innerWidth - 0.5) * 2);
    rawY.set((t.clientY / window.innerHeight - 0.5) * 2);
  };

  return (
    <div
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      style={{ position: "relative", width: "100vw", height: "100dvh", overflow: "hidden" }}
    >
      {/* Three.js background */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        gl={{ antialias: true }}
        dpr={[1, isMobile ? 1 : 1.5]}
      >
        <Sky distance={450000} sunPosition={[1, 0.4, 0]} turbidity={8} rayleigh={1.2} mieCoefficient={0.004} mieDirectionalG={0.82} />
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

      {/* Dark scrim */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,20,35,0.28)", pointerEvents: "none", zIndex: 1 }} />

      {/* Grain */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "200px 200px", opacity: 0.13, pointerEvents: "none", zIndex: 2 }} />

      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,0.48) 100%)", pointerEvents: "none", zIndex: 2 }} />

      {PRODUCTS.map((product, i) => (
        <ProductCard
          key={product.name}
          product={product}
          depth={0.35 + i * 0.16}
          springX={springX}
          springY={springY}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}
