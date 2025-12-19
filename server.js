import express from "express";
import { createCanvas, loadImage } from "canvas";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// serve index.html
app.use(express.static(__dirname));

/*
  API GENERATE IMAGE
  SCRAPABLE ✔
  /api/generate?text=HALO&size=40&font=Arial&template=1
*/
app.get("/api/generate", async (req, res) => {
  try {
    const text = req.query.text || "Halo Dunia";
    const size = parseInt(req.query.size) || 32;
    const font = req.query.font || "Arial";
    const template = req.query.template || "1";

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    // load image dari ROOT
    const imagePath = path.join(__dirname, `anime${template}.png`);
    const bg = await loadImage(imagePath);

    ctx.drawImage(bg, 0, 0, 800, 600);

    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    wrapText(ctx, text, 400, 420, 520, size + 6);

    res.setHeader("Content-Type", "image/png");
    canvas.createPNGStream().pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal generate image" });
  }
});

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let offsetY = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line, x, y + offsetY);
      line = words[i] + " ";
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y + offsetY);
}

app.listen(PORT, () => {
  console.log(`🔥 RUNNING http://localhost:${PORT}`);
});