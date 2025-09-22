import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const creative = await prisma.creative.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!creative) {
      return NextResponse.json(
        { error: "Creative not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields for easier consumption
    const responseData = {
      ...creative,
      vslParameters: creative.vslParameters
        ? JSON.parse(creative.vslParameters)
        : null,
      chatHistory: creative.chatHistory
        ? JSON.parse(creative.chatHistory)
        : null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching creative:", error);
    return NextResponse.json(
      { error: "Failed to fetch creative" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content, status, vslParameters, chatHistory } = body;

    // Check if creative exists
    const existingCreative = await prisma.creative.findUnique({
      where: { id },
    });

    if (!existingCreative) {
      return NextResponse.json(
        { error: "Creative not found" },
        { status: 404 }
      );
    }

    const creative = await prisma.creative.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(status !== undefined && { status }),
        ...(vslParameters !== undefined && {
          vslParameters: vslParameters ? JSON.stringify(vslParameters) : null,
        }),
        ...(chatHistory !== undefined && {
          chatHistory: chatHistory ? JSON.stringify(chatHistory) : null,
        }),
        updatedAt: new Date(),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(creative);
  } catch (error) {
    console.error("Error updating creative:", error);
    return NextResponse.json(
      { error: "Failed to update creative" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check if creative exists
    const existingCreative = await prisma.creative.findUnique({
      where: { id },
    });

    if (!existingCreative) {
      return NextResponse.json(
        { error: "Creative not found" },
        { status: 404 }
      );
    }

    await prisma.creative.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Creative deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting creative:", error);
    return NextResponse.json(
      { error: "Failed to delete creative" },
      { status: 500 }
    );
  }
}
