import axios from "axios";
import { generateSVGBoxed } from "../svg/default";

async function fetchLeetCodeStats(username: string) {
  const query = `
    {
      allQuestionsCount { difficulty count }
      matchedUser(username: "${username}") {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch LeetCode stats:", error);
    return null;
  }
}

async function generateLeetCodeStatsCard(username: string, name: string) {
  const stats = await fetchLeetCodeStats(username);
  if (!stats) {
    return "Failed to fetch LeetCode stats";
  }
  const { acSubmissionNum } = stats.matchedUser.submitStats;
  const { allQuestionsCount } = stats;
  const easyCount =
    acSubmissionNum.find((item: any) => item.difficulty === "Easy")?.count || 0;
  const mediumCount =
    acSubmissionNum.find((item: any) => item.difficulty === "Medium")?.count ||
    0;
  const hardCount =
    acSubmissionNum.find((item: any) => item.difficulty === "Hard")?.count || 0;
  const allCount = easyCount + mediumCount + hardCount;
  const easyTotal = allQuestionsCount[1].count;
  const mediumTotal = allQuestionsCount[2].count;
  const hardTotal = allQuestionsCount[3].count;
  const allTotal = easyTotal + mediumTotal + hardTotal;

  return generateSVGBoxed(
    name,
    easyCount,
    mediumCount,
    hardCount,
    allCount,
    easyTotal,
    mediumTotal,
    hardTotal,
    allTotal
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  if (username == null) {
    return new Response("Please provide a username", { status: 400 });
  }
  let name = searchParams.get("name");
  if (name == null) {
    name = username;
  }
  try {
    const svgContent = await generateLeetCodeStatsCard(username, name);
    return new Response(svgContent, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch (error) {
    console.error("Failed to generate LeetCode stats card:", error);
    return new Response("Failed to generate LeetCode stats card", {
      status: 500,
    });
  }
}
