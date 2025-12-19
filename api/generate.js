export default function handler(req, res) {
  const text = (req.query.text || "Halo Dunia").slice(0, 120);
  const size = Math.min(Math.max(parseInt(req.query.size) || 32, 16), 64);
  const template = ["1","2","3"].includes(req.query.template)
    ? req.query.template
    : "1";

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <image href="/anime${template}.png" width="800" height="600"/>

  <rect x="100" y="380" width="600" height="140"
    rx="20" fill="rgba(255,255,255,0.8)"/>

  <text
    x="400"
    y="455"
    text-anchor="middle"
    font-size="${size}"
    font-family="Arial"
    fill="#000">
    ${escape(text)}
  </text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}

function escape(str) {
  return str
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&apos;");
}