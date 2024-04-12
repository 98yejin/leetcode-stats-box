import axios from "axios";

export async function fetchLeetCode(query: string) {
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
