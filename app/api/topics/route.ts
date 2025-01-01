import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/lib/models/topicModel";

// Handle GET requests
export async function GET() {
  await dbConnect();

  try {
    const topics = await Topic.find({});
    return NextResponse.json({ success: true, data: topics });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 400 },
    );
  }
}

// Handle POST requests
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const topic = await Topic.create(body);
    return NextResponse.json({ success: true, data: topic }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Handle duplicate key error specifically
      if (error.message.includes("E11000 duplicate key error")) {
        return NextResponse.json(
          { success: false, error: "A topic with this name already exists." },
          { status: 400 },
        );
      }

      // Handle other errors
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 400 },
    );
  }
}
