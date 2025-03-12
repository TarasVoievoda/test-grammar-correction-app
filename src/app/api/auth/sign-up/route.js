import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import prismadb from "@/lib/prismadb";

import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    const user = await prismadb.user.findUnique({ where: { email } });

    if (user) {
      return new NextResponse("Email is already taken", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismadb.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    await prismadb.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        accessToken: token,
      }
    });

    return NextResponse.json({ ...newUser, accessToken: token });
  } catch(error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
