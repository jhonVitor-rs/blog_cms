import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateApiKey } from "@/services/api/gen-key";
import { images } from "@/services/db/schemas";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> },
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
    const imageId = paramsData.imageId

    const image = await db.query.images.findFirst({
      where: eq(images.id, imageId),
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
