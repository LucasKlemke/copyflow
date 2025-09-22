import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (type) where.type = type;

    const creatives = await prisma.creative.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(creatives);
  } catch (error) {
    console.error("Error fetching creatives:", error);
    return NextResponse.json(
      { error: "Failed to fetch creatives" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      type,
      projectId,
      vslParameters,
      chatHistory,
      status = "DRAFT",
    } = body;

    if (!title || !type || !projectId) {
      return NextResponse.json(
        { error: "Title, type, and projectId are required" },
        { status: 400 }
      );
    }

    // Validate that the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const creative = await prisma.creative.create({
      data: {
        title,
        content: content || "",
        type,
        projectId,
        status,
        vslParameters: vslParameters ? JSON.stringify(vslParameters) : null,
        chatHistory: chatHistory ? JSON.stringify(chatHistory) : null,
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

    return NextResponse.json(creative, { status: 201 });
  } catch (error) {
    console.error("Error creating creative:", error);
    return NextResponse.json(
      { error: "Failed to create creative" },
      { status: 500 }
    );
  }
}
