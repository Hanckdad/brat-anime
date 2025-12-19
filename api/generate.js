import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);

  const text = searchParams.get("text") || "BRAT";
  const size = Number(searchParams.get("size")) || 80;

  const templates = [
    "/anime1.png",
    "/anime2.png",
    "/anime3.png",
  ];

  const bg =
    templates[Math.floor(Math.random() * templates.length)];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1024px",
          height: "1024px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            fontSize: size,
            fontWeight: "900",
            color: "#000",
            textAlign: "center",
            maxWidth: "80%",
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          {text}
        </div>
      </div>
    ),
    {
      width: 1024,
      height: 1024,
    }
  );
}