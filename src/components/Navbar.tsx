"use client";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "15px 30px", background: "#1e0033", color: "white" }}>
      <div style={{ fontWeight: "bold", fontSize: "18px" }}>Monad Coinflip</div>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link href="/coinflip" style={{ color: "white", fontWeight: "500" }}>Play Coinflip</Link>
        <Link href="/leaderboard" style={{ color: "white", fontWeight: "500" }}>Leaderboard</Link>
        <ConnectButton />
      </div>
    </nav>
  );
}