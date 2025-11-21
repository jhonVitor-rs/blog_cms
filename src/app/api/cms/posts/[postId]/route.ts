import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authorization = req.headers.get("authorization");
  } catch (error) {}
}
