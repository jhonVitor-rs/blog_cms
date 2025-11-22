import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateApiKey } from "@/services/api/gen-key";
import { images } from "@/services/db/schemas";

export async function GET(
  req: NextRequest,
  { params }: { params: { imageId: string } },
) {
  try {
    const authorization = req.headers.get("authorization") ?? "";
    const apiKey = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!apiKey) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await validateApiKey(apiKey);
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const image = await db.query.images.findFirst({
      where: eq(images.id, params.imageId),
    });
    if (!image) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
