import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    userId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's projects
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creatives: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            creatives: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
