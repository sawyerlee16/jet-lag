"use client";

import dynamic from "next/dynamic";

const MerchPage = dynamic(() => import("./components/MerchPage"), { ssr: false });

export default function Home() {
  return <MerchPage />;
}
