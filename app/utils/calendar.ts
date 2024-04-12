import { fetchLeetCode } from "./fetchLeetcode";
import { capitalizeFirstLetter } from "./module";

async function fetchLeetCodeCalednar(username: string) {
  const query = `
      {
        matchedUser(username: "${username}") {
          submissionCalendar
        }
      }
    `;
  return fetchLeetCode(query);
}

function getLastDayOfMonth(dateString: string): number {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  return lastDay;
}

async function parseLeetCodeCalendar(submissionCalendar: string) {
  const data: { [key: string]: number } = JSON.parse(submissionCalendar);
  const totalActiveDays = Object.keys(data).length;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const sixMonthsAgo = currentTimestamp - 6 * 30 * 24 * 60 * 60;
  const dataByMonth: { [key: string]: { [key: string]: number } } = {};
  for (const [timestamp, value] of Object.entries(data)) {
    const timestampNumber = parseInt(timestamp);
    if (timestampNumber >= sixMonthsAgo) {
      const date = new Date(timestampNumber * 1000);
      const month = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const day = date.getDate().toString();
      if (!dataByMonth[month]) {
        dataByMonth[month] = {};
      }
      dataByMonth[month][day] = value;
    }
  }

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const today = currentDate.getDate();
  const startMonth = new Date();
  startMonth.setMonth(startMonth.getMonth() - 6);
  const startMonthString = startMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  for (const month of Object.keys(dataByMonth)) {
    const startDate = month === startMonthString ? startMonth.getDate() : 1;
    let endDate;
    if (month == currentMonth) {
      endDate = today;
    } else {
      endDate = getLastDayOfMonth(month);
    }
    for (let day = startDate; day <= endDate; day++) {
      const dayString = day.toString();
      if (!dataByMonth[month][dayString]) {
        dataByMonth[month][dayString] = 0;
      }
    }
  }
  return { totalActiveDays, dataByMonth };
}

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

async function drawLeetCodeCalendar(
  name: string,
  totalActiveDays: number,
  data: {
    [key: string]: { [key: string]: number };
  }
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
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `
    <style>
    .header { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #2f80ed; }
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

export async function generateLeetcodeCalendarCard(
  username: string,
  name: string
) {
  const stats = await fetchLeetCodeCalednar(username);
  const { submissionCalendar } = stats.matchedUser;
  const { totalActiveDays, dataByMonth } = await parseLeetCodeCalendar(
    submissionCalendar
  );
  return await drawLeetCodeCalendar(name, totalActiveDays, dataByMonth);
}
