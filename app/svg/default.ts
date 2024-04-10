const createBar = (
  y: number,
  count: number,
  total: number,
  difficulty: string,
  color: string
) => {
  const percentage = (count / total) * 100;
  const radius = 0.75;
  let fontWeight = difficulty == "Total" ? "bolder" : "normal";
  return `
      <text x="15" y="${y}" fill="#656565" font-weight="${fontWeight}" font-size="4" alignment-baseline="middle" font-family="monospace, 'Comic Sans MS', cursive, sans-serif">${difficulty}</text>
      <rect x="35" y="${
        y - 2.5
      }" width="100" height="5" rx="${radius}" ry="${radius}" fill="#e0e0e0"/>
      <rect x="35" y="${
        y - 2.5
      }" width="${percentage}" height="5" rx="${radius}" ry="${radius}" fill="${color}"/>
      <text x="140" y="${y}" font-weight="bolder" font-size="4" alignment-baseline="middle" font-family="monospace, 'Comic Sans MS', cursive, sans-serif">${count}</text>
      <text x="150" y="${y}" fill="#656565" font-size="4" alignment-baseline="middle" font-family="monospace, 'Comic Sans MS', cursive, sans-serif"> / ${total} (${percentage.toFixed(
    1
  )}%)</text>
    `;
};

function capitalizeFirstLetter(s: string): string {
  if (s.length === 0) return s; // or return "" for an empty string
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateSVGBoxed(
  name: string,
  easyCount: number,
  mediumCount: number,
  hardCount: number,
  allCount: number,
  easyTotal: number,
  mediumTotal: number,
  hardTotal: number,
  allTotal: number
): string {
  // Define the basic dimensions
  const newName = capitalizeFirstLetter(name);
  const width = 200;
  const height = 100;
  const boxPadding = 10;
  const boxWidth = width - 2 * boxPadding;
  const boxHeight = height - 2 * boxPadding;
  // Combine everything into the SVG
  const svgContent = `
      <svg viewBox="0 0 ${width} ${height}" width="${width * 2.5}" height="${
    height * 2.5
  }" xmlns="http://www.w3.org/2000/svg">
        <style>
        .header { font: 600 6px 'Segoe UI', Ubuntu, Sans-Serif; fill: #2f80ed; }
        </style>
        <rect x="${boxPadding}" y="${boxPadding}" width="${boxWidth}" height="${boxHeight}" fill="white" stroke="#ccc" stroke-width="0.1" rx="1" ry="1"/>
        <text x="15" y="23" class="header">LeetCode Stats for ${newName}</text>
        ${createBar(35, easyCount, easyTotal, "Easy", "#4caf50")}
        ${createBar(50, mediumCount, mediumTotal, "Medium", "#ffeb3b")}
        ${createBar(65, hardCount, hardTotal, "Hard", "#f44336")}
        ${createBar(80, allCount, allTotal, "Total", "#FFA500")}
      </svg>
    `;
  return svgContent;
}
