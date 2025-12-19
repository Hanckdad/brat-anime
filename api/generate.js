import { ImageResponse } from "@vercel/og";
import fs from "fs";
import path from "path";

export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const text = (searchParams.get("text") || "Halo Dunia").slice(0, 80);
  const size = Math.min(
    Math.max(parseInt(searchParams.get("size")) || 40, 16),
    80
  );

  const template = ["1", "2", "3"].includes(searchParams.get("template"))
    ? searchParams.get("template")
    : String(Math.floor(Math.random() * 3) + 1);

  // ===== LOAD IMAGE =====
  const imgPath = path.join(process.cwd(), `anime${template}.png`);
  const imgBase64 = fs.readFileSync(imgPath).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "1024px",
          height: "1024px",
          position: "relative",
          backgroundImage: `url(data:image/png;base64,${imgBase64})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* TEXT */}
        <div
          style={{
            position: "absolute",
            bottom: "140px",
            width: "100%",
            textAlign: "center",
            fontSize: `${size}px`,
            color: "#000",
            fontFamily: "Arial, Helvetica, sans-serif",
            padding: "0 80px",
            lineHeight: 1.2
          }}
        >
          {text}
        </div>
      </div>
    ),
    {
      width: 1024,
      height: 1024
    }
  );
}