import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/lib/models/topicModel";

// Handle PUT requests to update a specific topic
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await req.json();

    // Find and update the topic by ID
    const updatedTopic = await Topic.findByIdAndUpdate(id, body, { new: true });

    if (!updatedTopic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedTopic });
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

// Handle DELETE requests to delete a specific topic
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();

  try {
    const { id } = params;
    // Find the topic by ID
    const topic = await Topic.findById(id);

    if (!topic) {
      return NextResponse.json(
        { success: false, error: `Topic with id '${id}' doesn't exist` },
        { status: 404 },
      );
    }

    // Delete the topic by ID
    await Topic.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Topic named ${topic.name} deleted successfully`,
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
