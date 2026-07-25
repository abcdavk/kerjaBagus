import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      phone,
      password,
      username,
      displayName,
    } = body;

    const errors: string[] = [];

    if (!displayName?.trim()) {
      errors.push("Nama wajib diisi.");
    }

    if (!email?.trim()) {
      errors.push("Email wajib diisi.");
    }

    if (!phone?.trim()) {
      errors.push("Nomor telepon wajib diisi.");
    }

    if (!username?.trim()) {
      errors.push("Username wajib diisi.");
    }

    if (!password) {
      errors.push("Password wajib diisi.");
    } else if (password.length < 8) {
      errors.push("Password minimal 8 karakter.");
    }

    const phoneRegex = /^08\d{8,11}$/;

    if (phone && !phoneRegex.test(phone)) {
      errors.push(
        "Nomor telepon harus diawali 08 dan terdiri dari 10-13 digit."
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (username && !usernameRegex.test(username)) {
      errors.push(
        "Username hanya boleh berisi huruf, angka, dan underscore (_) dengan panjang 3-20 karakter."
      );
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        errors.push("Email sudah digunakan.");
      }
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        errors.push("Nomor telepon sudah digunakan.");
      }
    }

    if (username) {
      const existingUsername = await prisma.profile.findUnique({
        where: { username },
      });

      if (existingUsername) {
        errors.push("Username sudah digunakan.");
      }
    }

    if (errors.length > 0) {
      return Response.json(
        {
          valid: false,
          message: errors,
        },
        {
          status: 400,
        }
      );
    }

    return Response.json({
      valid: true,
    });
  } catch (error) {
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