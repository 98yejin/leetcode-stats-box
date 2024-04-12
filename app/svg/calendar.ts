import { capitalizeFirstLetter } from "../utils/module";

function getColor(value: number): string {
  if (value === 0) {
    return "rgb(235, 237, 240)";
  } else if (value > 0 && value <= 1) {
    return "rgb(172, 231, 174)";
  } else if (value > 1 && value <= 3) {
    return "rgb(105, 193, 110)";
  } else if (value > 3 && value <= 5) {
    return "rgb(84, 159, 87)";
  } else if (value >= 5) {
    return "rgb(56, 108, 62)";
  } else {
    return "rgb(235, 237, 240)";
  }
}

export async function drawLeetCodeCalendar(
  name: string,
  totalActiveDays: number,
  data: {
    [key: string]: { [key: string]: number };
  },
  title: string
) {
  const svgWidth = 450;
  const svgHeight = 200;
  const boxSize = 10;
  const boxGap = 2;
  const weekGap = 5;
  const monthLabelY = 55;
  const radius = 2.5;
  const percentage = (totalActiveDays / 180) * 100;
  const newName = capitalizeFirstLetter(name);
  const titleColor = title == "false" ? "white" : "#2f80ed";
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `
      <style>
      .header { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${titleColor}; }
      </style>
      <text x="15" y="23" class="header">LeetCode Submission Calendar for ${newName}</text>`;
  let weekX = 20;
  let prevWeekX = 0;
  for (const month of Object.keys(data)) {
    const startDay = Math.min(...Object.keys(data[month]).map(Number));
    const endDay = Math.max(...Object.keys(data[month]).map(Number));
    const daysInMonth = endDay - startDay + 1;
    const weeksInMonth = Math.ceil(daysInMonth / 7);
    const abbreviatedMonth = month.slice(0, 3);
    const monthCenterX =
      weekX + (weeksInMonth * (boxSize + weekGap) - weekGap) / 2;
    const monthLabel = `<text x="${monthCenterX}" y="${monthLabelY}" font-size="12" text-anchor="middle" font-family="monospace, 'Comic Sans MS', cursive, sans-serif">${abbreviatedMonth}</text>`;
    svg += monthLabel;
    const startDate = new Date(Date.parse(`${startDay} ${month}`));
    const startDayOfWeek = startDate.getDay();
    let currentDayOfWeek = startDayOfWeek;
    for (let day = startDay; day <= endDay; day++) {
      const boxY = monthLabelY + 10 + currentDayOfWeek * (boxSize + boxGap);
      const dayValue = data[month][day.toString()];
      const color = getColor(dayValue);
      const rect = `<rect x="${weekX}" y="${boxY}" width="${boxSize}" height="${boxSize}" fill="${color}" rx="${radius}" ry="${radius}" />`;
      svg += rect;

      currentDayOfWeek = (currentDayOfWeek + 1) % 7;
      if (currentDayOfWeek === 0) {
        weekX += boxSize + weekGap;
      }
    }
    prevWeekX = weekX;
    weekX = prevWeekX;
  }
  svg += `<text x="${svgWidth - 200}" y="${
    svgHeight - 30
  }" font-size="10" fill="#656565" font-family="monospace, 'Comic Sans MS', cursive, sans-serif">Total active days: ${totalActiveDays} (${percentage.toFixed(
    1
  )}%)</text>`;
  svg += "</svg>";
  return svg;
}
