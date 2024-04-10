import axios from "axios";

async function fetchLeetCodeStats(username: string) {
  const query = `
    {
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
    return response.data.data.matchedUser;
  } catch (error) {
    console.error("Failed to fetch LeetCode stats:", error);
    return null;
  }
}

async function generateLeetCodeStatsCard(username: string) {
  const stats = await fetchLeetCodeStats(username);
  if (!stats) {
    return "Failed to fetch LeetCode stats";
  }

  const { acSubmissionNum } = stats.submitStats;
  const easyCount =
    acSubmissionNum.find((item: any) => item.difficulty === "Easy")?.count || 0;
  const mediumCount =
    acSubmissionNum.find((item: any) => item.difficulty === "Medium")?.count ||
    0;
  const hardCount =
    acSubmissionNum.find((item: any) => item.difficulty === "Hard")?.count || 0;

  return `
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #2f80ed; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #333; }
      </style>
      <rect x="0" y="0" width="400" height="200" fill="#fff" stroke="#e4e2e2" stroke-width="1" />
      <text x="25" y="35" class="header">LeetCode Stats for ${username}</text>
      <text x="35" y="70" class="stat">Easy: ${easyCount} problems</text>
      <text x="35" y="95" class="stat">Medium: ${mediumCount} problems</text>
      <text x="35" y="120" class="stat">Hard: ${hardCount} problems</text>
    </svg>
  `;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  if (username == null) {
    return new Response("Please provide a username", { status: 400 });
  }
  try {
    const svgContent = await generateLeetCodeStatsCard(username);
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
