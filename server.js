import express from "express";
import { createCanvas, loadImage } from "canvas";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

/* =============================
   CONFIG
============================= */

// font yang diizinkan (anti crash)
const ALLOWED_FONTS = [
  "Arial",
  "Comic Sans MS",
  "Verdana",
  "Courier New"
];

// ukuran canvas
const WIDTH = 800;
const HEIGHT = 600;

// serve index.html + assets
app.use(express.static(__dirname));

/* =============================
   API GENERATE (SCRAPABLE)
============================= */
app.get("/api/generate", async (req, res) => {
  try {
    // ==== sanitize input ====
    const text =
      typeof req.query.text === "string" && req.query.text.trim()
        ? req.query.text.slice(0, 200)
        : "Halo Dunia";

    const size = Math.min(
      Math.max(parseInt(req.query.size) || 32, 10),
      80
    );

    const font = ALLOWED_FONTS.includes(req.query.font)
      ? req.query.font
      : "Arial";

    const template = ["1", "2", "3"].includes(req.query.template)
      ? req.query.template
      : "1";

    // ==== canvas ====
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    // ==== load image dari root ====
    const imagePath = path.join(__dirname, `anime${template}.png`);
    const bg = await loadImage(imagePath);

    ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT);

    // ==== text style (ANTI ERROR FONT SPASI) ====
    ctx.font = `${size}px "${font}"`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    drawWrappedText(
      ctx,
      text,
      WIDTH / 2,
      HEIGHT * 0.7,
      WIDTH - 160,
      size + 6
    );

    // ==== response ====
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    canvas.createPNGStream().pipe(res);

  } catch (err) {
    console.error("GENERATE ERROR:", err);
    res.status(500).json({
      error: "Failed to generate image"
    });
  }
});

/* =============================
   TEXT WRAP FUNCTION
============================= */
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let offsetY = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y + offsetY);
      line = words[i] + " ";
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y + offsetY);
}

/* =============================
   START SERVER
============================= */
app.listen(PORT, () => {
  console.log(`🔥 Anime Brat Generator running`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📡 API  http://localhost:${PORT}/api/generate`);
});