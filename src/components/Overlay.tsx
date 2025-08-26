"use client";
import React from "react";

type OverlayProps = {
  message: string;              // mensaje principal (Win/Lose)
  onClose: () => void;          // acción al cerrar overlay
  children?: React.ReactNode;   // botones extra u otros contenidos
};

export default function Overlay({ message, onClose, children }: OverlayProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#1e0033",
          padding: "30px",
          borderRadius: "16px",
          color: "white",
          textAlign: "center",
          minWidth: "300px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>{message}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          {children}
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#555",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}