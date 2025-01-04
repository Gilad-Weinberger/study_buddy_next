import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/lib/models/messageModel";

// Handle DELETE requests to delete a specific topic
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();

  try {
    const { id } = params;

    // Find the topic by ID
    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json(
        { success: false, error: `Room with id '${id}' doesn't exist` },
        { status: 404 },
      );
    }

    // Delete the topic by ID
    await Message.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `The message "${message.text}" sent by ${"user"} deleted successfully`,
    });
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
