import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "node:fs";

const W = 1200;
const H = 630;

const BG = "#0c0d10";
const LINE = "#232a36";
const MUTED = "#8a92a3";
const TEXT = "#ece6d6";
const ACCENT = "#6fb3c4";
const ACCENT2 = "#9bd1de";

const cx = 875;
const cy = 315;
const rx = 225;
const ry = 200;

const nodes = [
  { a: -90, label: "consult", anchor: "middle", dx: 0, dy: -16, key: true },
  { a: -18, label: "fail", anchor: "start", dx: 16, dy: 4 },
  { a: 54, label: "investigate", anchor: "start", dx: 14, dy: 18 },
  { a: 126, label: "verify", anchor: "end", dx: -14, dy: 18 },
  { a: 198, label: "distill", anchor: "end", dx: -16, dy: 4 },
];

const pt = (aDeg, r = 1) => {
  const a = (aDeg * Math.PI) / 180;
  return [cx + rx * r * Math.cos(a), cy + ry * r * Math.sin(a)];
};

const nodeMarkup = nodes
  .map((n) => {
    const [x, y] = pt(n.a);
    const lx = x + n.dx;
    const ly = y + n.dy;
    const dot = n.key
      ? `<circle cx="${x}" cy="${y}" r="13" fill="${ACCENT}" opacity="0.18"/><circle cx="${x}" cy="${y}" r="6" fill="${ACCENT2}"/>`
      : `<circle cx="${x}" cy="${y}" r="5" fill="${ACCENT}"/>`;
    const labelFill = n.key ? TEXT : MUTED;
    const labelWeight = n.key ? 600 : 500;
    return `${dot}<text x="${lx}" y="${ly}" text-anchor="${n.anchor}" font-family="JetBrains Mono" font-weight="${labelWeight}" font-size="19" letter-spacing="0.5" fill="${labelFill}">${n.label}</text>`;
  })
  .join("\n    ");

const [px1, py1] = pt(35);
const [px2, py2] = pt(165);

const innerCx = 1118;
const innerCy = 140;
const innerR = 44;
const [fx, fy] = pt(-18);
const innerDots = [-90, 30, 150]
  .map((a) => {
    const r = (a * Math.PI) / 180;
    return `<circle cx="${innerCx + innerR * Math.cos(r)}" cy="${innerCy + innerR * Math.sin(r)}" r="3.5" fill="${ACCENT2}"/>`;
  })
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.34"/>
      <stop offset="45%" stop-color="${ACCENT}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bgWash" cx="72%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#10161c" stop-opacity="1"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="coreDisk" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#05070a"/>
      <stop offset="78%" stop-color="#070a0e"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0.55"/>
    </radialGradient>
    <radialGradient id="particle" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ACCENT2}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${ACCENT2}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#bgWash)"/>

  <ellipse cx="${cx}" cy="${cy}" rx="190" ry="168" fill="url(#coreGlow)"/>

  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${LINE}" stroke-width="1.5"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${ACCENT}" stroke-width="1.5" stroke-opacity="0.22"/>

  <circle cx="${px1}" cy="${py1}" r="13" fill="url(#particle)"/>
  <circle cx="${px1}" cy="${py1}" r="3.5" fill="${ACCENT2}"/>
  <circle cx="${px2}" cy="${py2}" r="11" fill="url(#particle)"/>
  <circle cx="${px2}" cy="${py2}" r="3" fill="${ACCENT2}"/>

  <ellipse cx="${cx}" cy="${cy}" rx="66" ry="58" fill="url(#coreDisk)"/>
  <ellipse cx="${cx}" cy="${cy}" rx="66" ry="58" fill="none" stroke="${ACCENT}" stroke-width="1.5" stroke-opacity="0.4"/>
  <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-family="JetBrains Mono" font-weight="500" font-size="15" fill="${MUTED}">the horizon</text>
  <text x="${cx}" y="${cy + 19}" text-anchor="middle" font-family="JetBrains Mono" font-weight="500" font-size="11.5" letter-spacing="0.3" fill="${MUTED}" opacity="0.92">information falls in</text>

  ${nodeMarkup}

  <line x1="${fx}" y1="${fy}" x2="${innerCx - 6}" y2="${innerCy + innerR - 4}" stroke="${ACCENT}" stroke-width="1.2" stroke-opacity="0.4" stroke-dasharray="3 4"/>
  <text x="${(fx + innerCx) / 2 + 30}" y="${(fy + innerCy) / 2}" text-anchor="middle" font-family="JetBrains Mono" font-weight="500" font-size="12.5" fill="${MUTED}" opacity="0.85">grounds in</text>
  <circle cx="${innerCx}" cy="${innerCy}" r="${innerR}" fill="none" stroke="${ACCENT}" stroke-width="1.3" stroke-opacity="0.55"/>
  ${innerDots}
  <text x="${innerCx}" y="${innerCy + 3}" text-anchor="middle" font-family="JetBrains Mono" font-weight="500" font-size="12" fill="${ACCENT2}">inner</text>
  <text x="${innerCx}" y="${innerCy + 18}" text-anchor="middle" font-family="JetBrains Mono" font-weight="500" font-size="12" fill="${ACCENT2}">loop</text>

  <text x="${cx}" y="${cy + ry + 44}" text-anchor="middle" font-family="JetBrains Mono" font-weight="500" font-size="14.5" letter-spacing="2.5" fill="${MUTED}">OUTER LOOP · THE COMPANY'S MEMORY</text>

  <text x="80" y="232" font-family="JetBrains Mono" font-weight="500" font-size="17" letter-spacing="2.5" fill="${ACCENT}">ESSAY · ARYAMAN AGRAWAL</text>
  <text x="76" y="300" font-family="Inter Tight" font-weight="700" font-size="60" letter-spacing="-1.5" fill="${TEXT}">Your company</text>
  <text x="76" y="362" font-family="Inter Tight" font-weight="700" font-size="60" letter-spacing="-1.5" fill="${TEXT}">needs an</text>
  <text x="76" y="424" font-family="Inter Tight" font-weight="700" font-size="60" letter-spacing="-1.5" fill="${ACCENT2}">outer loop</text>
  <text x="80" y="480" font-family="Newsreader" font-style="italic" font-size="22" fill="${MUTED}">Only as good as the memory it grounds itself in.</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: W * 2 },
  background: BG,
  font: {
    loadSystemFonts: false,
    fontFiles: [
      "./public/fonts/inter-tight-700.ttf",
      "./public/fonts/jetbrains-mono-500.ttf",
      "./public/fonts/newsreader-italic-400.ttf",
    ],
    defaultFontFamily: "Inter Tight",
  },
});

const png = resvg.render().asPng();
mkdirSync("./public/og-assets", { recursive: true });
writeFileSync("./public/og-assets/outer-loop-hero.png", png);
console.log(`wrote public/og-assets/outer-loop-hero.png (${png.length} bytes)`);
