import fs from "fs";
import path from "path";

/**
 * /api/generate?text=HALO&size=36&template=1
 */

export default function handler(req, res) {
  try {
    const textRaw = req.query.text || "Halo Dunia";
    const text = sanitize(textRaw).slice(0, 100);

    const size = clamp(
      parseInt(req.query.size) || 32,
      16,
      64
    );

    const template = ["1", "2", "3"].includes(req.query.template)
      ? req.query.template
      : "1";

    const imagePath = path.join(
      process.cwd(),
      `anime${template}.png`
    );

    if (!fs.existsSync(imagePath)) {
      return res.status(404).send("Image not found");
    }

    const imageBase64 = fs
      .readFileSync(imagePath)
      .toString("base64");

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="800" height="600"
     viewBox="0 0 800 600">

  <!-- Background anime -->
  <image
    href="data:image/png;base64,${imageBase64}"
    width="800"
    height="600"/>

  <!-- Plain black text -->
  <text
    x="400"
    y="460"
    text-anchor="middle"
    dominant-baseline="middle"
    font-size="${size}"
    font-family="Arial, Helvetica, sans-serif"
    fill="#000000">
    ${text}
  </text>

</svg>`.trim();

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(svg);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

// ===== HELPERS =====
function sanitize(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}