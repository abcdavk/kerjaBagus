import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      password,
      displayName,
      username,
    } = body;

    // Input validation
    if (!email || !password || !displayName || !username) {
      return Response.json(
        {
          message: "Semua field wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return Response.json(
        {
          message: "Password minimal 8 karakter.",
        },
        {
          status: 400,
        }
      );
    }

    // Email already registered? 
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return Response.json(
        {
          message: "Email sudah digunakan.",
        },
        {
          status: 409,
        }
      );
    }

    // Username already taken?
    const existingUsername = await prisma.profile.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return Response.json(
        {
          message: "Username sudah digunakan.",
        },
        {
          status: 409,
        }
      );
    }

    // Password Hashing
    const passwordHash = await bcrypt.hash(password, 12);

    // Transaction
    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,

          displayName,
          username,

          headline: "",
        },
      });

      return user;
    });

    return Response.json(
      {
        message: "Register berhasil.",
        userId: user.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Terjadi kesalahan pada server.",
      },
      {
        status: 500,
      }
    );
  }
}