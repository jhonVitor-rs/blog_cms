import { asc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateApiKey } from "@/services/api/gen-key";
import { articles, images, posts } from "@/services/db/schemas";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const authorization = req.headers.get("authorization") ?? "";
    const matches = authorization.match(/^"?Bearer (.+?)"?$/);

    const apiKey = matches ? matches[1] : null;

    if (!apiKey) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await validateApiKey(apiKey);
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const paramsData = await params
    const postId = paramsData.postId

    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: {
        articles: {
          with: {
            images: {
              orderBy: [asc(images.index)],
            },
          },
          orderBy: [asc(articles.index)],
        },
      },
    });

    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
