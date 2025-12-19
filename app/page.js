"use client";

import { useState } from "react";

export default function Page() {
  const [text, setText] = useState("HALO");
  const [size, setSize] = useState(80);
  const [img, setImg] = useState("");

  const generate = () => {
    setImg(
      `/api/generate?text=${encodeURIComponent(
        text
      )}&size=${size}&t=${Date.now()}`
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #5b2cff, #120022)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
        color: "white",
        fontFamily: "sans-serif"
      }}
    >
      <h1 style={{ fontSize: 40, marginBottom: 20 }}>
        Anime Brat Generator
      </h1>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Teks"
          style={{
            padding: 10,
            fontSize: 18,
            borderRadius: 8
          }}
        />

        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          style={{
            width: 100,
            padding: 10,
            fontSize: 18,
            borderRadius: 8
          }}
        />

        <button
          onClick={generate}
          style={{
            padding: "10px 20px",
            fontSize: 18,
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Generate
        </button>
      </div>

      {img && (
        <div style={{ marginTop: 30 }}>
          <img
            src={img}
            width={512}
            height={512}
            style={{
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,.6)"
            }}
          />
          <p style={{ marginTop: 10 }}>
            <a
              href={img}
              download="brat.png"
              style={{ color: "#9f8cff" }}
            >
              Download PNG
            </a>
          </p>
        </div>
      )}
    </div>
  );
}