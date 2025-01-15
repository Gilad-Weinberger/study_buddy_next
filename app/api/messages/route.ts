import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/lib/models/messageModel";

// Handle GET requests
export async function GET() {
  await dbConnect();

  try {
    const messages = await Message.find({})
      .populate("user", "name image")
      .populate("room", "name _id");
    return NextResponse.json({ success: true, data: messages });
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
    const room = await Message.create(body);
    return NextResponse.json({ success: true, data: room }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
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
