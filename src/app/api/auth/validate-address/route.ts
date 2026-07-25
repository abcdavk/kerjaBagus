export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      province,
      city,
      district,
      village,
      postalCode,
    } = body;

    const errors: string[] = [];

    if (!province?.trim()) {
      errors.push("Provinsi wajib diisi.");
    }

    if (!city?.trim()) {
      errors.push("Kabupaten/Kota wajib diisi.");
    }

    if (!district?.trim()) {
      errors.push("Kecamatan wajib diisi.");
    }

    if (!village?.trim()) {
      errors.push("Kelurahan/Desa wajib diisi.");
    }

    if (!postalCode?.trim()) {
      errors.push("Kode pos wajib diisi.");
    } else if (!/^\d{5}$/.test(postalCode)) {
      errors.push("Kode pos harus terdiri dari 5 digit.");
    }

    if (errors.length > 0) {
      return Response.json(
        {
          valid: false,
          message: errors,
        },
        { status: 400 }
      );
    }

    return Response.json({
      valid: true,
    });
  } catch {
    return Response.json(
      {
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}