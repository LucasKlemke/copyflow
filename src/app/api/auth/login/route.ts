import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        // Note: In production, also select the hashed password to compare
        // password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Note: In production, compare hashed password:
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // if (!passwordMatch) {
    //   return NextResponse.json(
    //     { error: "Senha incorreta" },
    //     { status: 401 }
    //   );
    // }

    // For now, we'll just accept any password for demo purposes
    // In production, implement proper password hashing and comparison

    return NextResponse.json({
      user,
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
