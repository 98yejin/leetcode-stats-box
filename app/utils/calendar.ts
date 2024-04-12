import { drawLeetCodeCalendar } from "../svg/calendar";
import { fetchLeetCode } from "./fetchLeetcode";

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

export async function generateLeetcodeCalendarCard(
  username: string,
  name: string,
  title: string
) {
  const stats = await fetchLeetCodeCalednar(username);
  const { submissionCalendar } = stats.matchedUser;
  const { totalActiveDays, dataByMonth } = await parseLeetCodeCalendar(
    submissionCalendar
  );
  return await drawLeetCodeCalendar(name, totalActiveDays, dataByMonth, title);
}
