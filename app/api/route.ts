import { generateLeetcodeCalendarCard } from "../utils/calendar";
import { generateLeetCodeStatsCard } from "../utils/solvedProblems";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  if (username == null) {
    return new Response("Please provide a username", { status: 400 });
  }
  const name = searchParams.get("name") ?? username;
  const title = searchParams.get("title") ?? "true";
  const type = searchParams.get("type");
  try {
    let svgContent;
    if (type === "calendar") {
      svgContent = await generateLeetcodeCalendarCard(username, name, title);
    } else {
      const bolder = searchParams.get("bolder") ?? "true";
      svgContent = await generateLeetCodeStatsCard(
        username,
        name,
        bolder,
        title
      );
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
