import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Context
) {
  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: {
      id,
    },

    include: {
      user: true,
      address: true,
    },
  });

  if (!profile) {
    return Response.json(
      {
        message: "Profile not found",
      },
      {
        status: 404,
      }
    );
  }

  return Response.json(profile);
}

export async function PATCH(
  request: Request,
  { params }: Context
) {
  const { id } = await params;
  const body = await request.json();

  const address = body.address;

  try {
    const profile = await prisma.profile.update({
      where: {
        id,
      },

      data: {
        displayName: body.displayName,
        username: body.username,

        avatar: body.avatar,
        headline: body.headline,
        bio: body.bio,

        skills: body.skills,

        website: body.website,
        github: body.github,
        linkedin: body.linkedin,
        portfolio: body.portfolio,

        hourlyRate: body.hourlyRate,
        currency: body.currency,

        isAvailable: body.isAvailable,

        ...(address && {
          address: {
            upsert: {
              update: {
                country: address.country,
                province: address.province,
                city: address.city,
                district: address.district,
                village: address.village,
                postalCode: address.postalCode,
                latitude: address.latitude,
                longitude: address.longitude,
              },
              create: {
                country: address.country ?? "Indonesia",
                province: address.province ?? "",
                city: address.city ?? "",
                district: address.district,
                village: address.village,
                postalCode: address.postalCode,
                latitude: address.latitude,
                longitude: address.longitude,
              },
            },
          },
        }),
      },

      include: {
        user: true,
        address: true,
      },
    });

    return Response.json(profile);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Profile not found",
      },
      {
        status: 404,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Context
) {
  const { id } = await params;

  try {
    await prisma.profile.delete({
      where: {
        id,
      },
    });

    return Response.json({
      message: "Profile deleted",
    });
  } catch {
    return Response.json(
      {
        message: "Profile not found",
      },
      {
        status: 404,
      }
    );
  }
}