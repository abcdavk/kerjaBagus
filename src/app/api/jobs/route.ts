import { prisma } from "@/lib/prisma";

export async function GET() {
  const jobs = await prisma.job.findMany({
    include: {
      profile: true,
      address: true,
    },
  });

  return Response.json(jobs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const job = await prisma.job.create({
      data: {
        company: body.company,

        title: body.title,
        description: body.description,
        banner: body.banner,

        budgetMin: body.budgetMin,
        budgetMax: body.budgetMax,

        deadline: body.deadline
          ? new Date(body.deadline)
          : null,

        locationType: body.locationType,

        isVerified: body.isVerified ?? false,
        isOpen: body.isOpen ?? true,

        tags: body.tags,

        profile: {
          connect: {
            id: body.profileId,
          },
        },

        ...(body.address && {
          address: {
            create: {
              country: body.address.country,
              province: body.address.province,
              city: body.address.city,
              district: body.address.district,
              village: body.address.village,
              postalCode: body.address.postalCode,
              latitude: body.address.latitude,
              longitude: body.address.longitude,
            },
          },
        }),
      },

      include: {
        profile: true,
        address: true,
      },
    });

    return Response.json(job, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to create job",
      },
      {
        status: 500,
      }
    );
  }
}