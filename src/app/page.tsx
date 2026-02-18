"use client";

import dynamic from "next/dynamic";

const SpinningLogo = dynamic(() => import("./components/SpinningLogo"), { ssr: false });

export default function Home() {
  return <SpinningLogo />;
}
