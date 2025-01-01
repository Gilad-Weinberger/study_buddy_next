import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/lib/models/roomModel";

// Handle GET requests
export async function GET() {
  await dbConnect();

  try {
    const rooms = await Room.find({});
    return NextResponse.json({ success: true, data: rooms });
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
    const room = await Room.create(body);
    return NextResponse.json({ success: true, data: room }, { status: 201 });
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
