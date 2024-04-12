import { generateLeetcodeCalendarCard } from "../utils/calendar";
import { generateLeetCodeStatsCard } from "../utils/solvedProblems";

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
  const type = searchParams.get("type");

  try {
    let svgContent;
    if (type === "calendar") {
      svgContent = await generateLeetcodeCalendarCard(username, name);
    } else {
      svgContent = await generateLeetCodeStatsCard(username, name);
    }
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
