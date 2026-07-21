import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const body = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return Response.json(
      { message: "Email atau password salah" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(
    body.password,
    user.passwordHash
  );

  if (!valid) {
    return Response.json(
      { message: "Email atau password salah" },
      { status: 401 }
    );
  }

  return Response.json({
    message: "Login berhasil",
  });
}