import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/lib/models/roomModel";

// Handle DELETE requests to delete a specific topic
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();

  try {
    const { id } = params;

    // Find the topic by ID
    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json(
        { success: false, error: `Room with id '${id}' doesn't exist` },
        { status: 404 },
      );
    }

    // Delete the topic by ID
    await Room.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Room named ${room.name} deleted successfully`,
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
