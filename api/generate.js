import fs from "fs";
import path from "path";

/**
 * Anime Brat SVG Generator
 * URL:
 * /api/generate?text=HALO&size=36&template=1
 */

export default function handler(req, res) {
  try {
    // ===== INPUT =====
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

    // ===== IMAGE =====
    const imagePath = path.join(
      process.cwd(),
      `anime${template}.png`
    );

    if (!fs.existsSync(imagePath)) {
      res.status(404).send("Template image not found");
      return;
    }

    const imageBase64 = fs
      .readFileSync(imagePath)
      .toString("base64");

    // ===== SVG =====
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="800" height="600"
     viewBox="0 0 800 600">

  <image
    href="data:image/png;base64,${imageBase64}"
    width="800"
    height="600"
    preserveAspectRatio="xMidYMid slice"/>

  <!-- Text Box -->
  <rect x="100" y="380"
        width="600" height="140"
        rx="20"
        fill="rgba(255,255,255,0.85)"/>

  <!-- Text -->
  <text
    x="400"
    y="455"
    text-anchor="middle"
    dominant-baseline="middle"
    font-size="${size}"
    font-family="Arial, Helvetica, sans-serif"
    fill="#000">
    ${text}
  </text>

</svg>`.trim();

    // ===== RESPONSE =====
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(svg);

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
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