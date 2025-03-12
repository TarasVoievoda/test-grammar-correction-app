import { NextResponse } from "next/server";

import { compare } from "bcryptjs";

import prismadb from "@/lib/prismadb";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, password } = body;

    const user = await prismadb.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return new NextResponse("Password is invalid", { status: 400 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await prismadb.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: token,
      },
    });

    return NextResponse.json({ name: user.name, email: user.email, accessToken: token });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
