"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useAccount, useWriteContract } from "wagmi";
import { erc20Abi } from "../utils/erc20Abi";

const CONTRACT_ADDRESS = "0x6918CC83ae3959d9f7a1EfF1e5c2BcF4Cf283c6a";
const WRAPPED_MONAD = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701";
const MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

export default function Page() {
  const { isConnected } = useAccount();
  const { writeContract, isPending, isSuccess, error, reset } = useWriteContract();

  const [justApproved, setJustApproved] = useState(false);

  useEffect(() => {
    if (isSuccess) setJustApproved(true);
  }, [isSuccess]);

  // Solo muestra el error si no es cancelación por el usuario
  const showError =
    error &&
    !(
      error.message?.toLowerCase().includes("user rejected") ||
      error.message?.toLowerCase().includes("cancelled") ||
      error.message?.toLowerCase().includes("user denied")
    );

  useEffect(() => {
    if (
      error &&
      (
        error.message?.toLowerCase().includes("user rejected") ||
        error.message?.toLowerCase().includes("cancelled") ||
        error.message?.toLowerCase().includes("user denied")
      )
    ) {
      reset();
    }
  }, [error, reset]);

  const handleApprove = async () => {
    await writeContract({
      address: WRAPPED_MONAD,
      abi: erc20Abi,
      functionName: "approve",
      args: [CONTRACT_ADDRESS, MAX_UINT256],
    });
  };

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg,#1e0033,#320046)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Welcome to Monad Coinflip</h1>
        <p style={{ maxWidth: "500px", textAlign: "center" }}>
          Connect your wallet and play the coinflip game! Win MON tokens and track your balance.
        </p>

        <div style={{ marginTop: "30px" }}>
          {!isConnected ? (
            <button
              disabled
              style={{
                padding: "10px 25px",
                background: "#888",
                borderRadius: "10px",
                color: "white",
                fontWeight: "bold",
                border: "none",
                cursor: "not-allowed",
              }}
            >
              Connect wallet in the navbar
            </button>
          ) : justApproved || isSuccess ? (
            <Link
              href="/coinflip"
              style={{
                padding: "10px 25px",
                background: "#6c0ff5",
                borderRadius: "10px",
                color: "white",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Go to Coinflip
            </Link>
          ) : (
            <button
              onClick={handleApprove}
              disabled={isPending}
              style={{
                padding: "10px 25px",
                background: isPending ? "#888" : "#6c0ff5",
                borderRadius: "10px",
                color: "white",
                fontWeight: "bold",
                border: "none",
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? "Approving..." : "Check-in (Approve)"}
            </button>
          )}
          {showError && (
            <p style={{ color: "red", marginTop: "10px" }}>❌ Error: {error.message}</p>
          )}
        </div>
      </main>
    </>
  );
}