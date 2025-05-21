import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  console.log(`Search query: ${query}`);

  try {
    // Encode query to handle special characters
    const encodedQuery = encodeURIComponent(query);
    // Add pagination parameters (adjust as needed)
    const pageSize = 50; // Increase for initial load, or make configurable
    const pageIndex = 1; // Default to first page
    const response = await fetch(
      `https://dashboard-blog.vercel.app/api/blogPost?query=${encodedQuery}&pageSize=${pageSize}&pageIndex=${pageIndex}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `External API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validate response structure
    if (!data.blogs || !Array.isArray(data.blogs)) {
      throw new Error("Invalid response format from external API");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
