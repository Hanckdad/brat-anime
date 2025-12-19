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
    64
  );

  const template = ["1", "2", "3"].includes(searchParams.get("template"))
    ? searchParams.get("template")
    : String(Math.floor(Math.random() * 3) + 1);

  const imgPath = path.join(process.cwd(), `anime${template}.png`);
  const imgBase64 = fs.readFileSync(imgPath).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "800px",
          height: "600px",
          position: "relative",
          backgroundImage: `url(data:image/png;base64,${imgBase64})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            width: "100%",
            textAlign: "center",
            fontSize: `${size}px`,
            color: "#000",
            fontFamily: "Arial, Helvetica, sans-serif"
          }}
        >
          {text}
        </div>
      </div>
    ),
    {
      width: 800,
      height: 600
    }
  );
}