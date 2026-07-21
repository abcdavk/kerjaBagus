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

  const job = await prisma.job.findUnique({
    where: {
      id,
    },

    include: {
      profile: true,
      address: true,
    },
  });

  if (!job) {
    return Response.json(
      {
        message: "Job not found",
      },
      {
        status: 404,
      }
    );
  }

  return Response.json(job);
}

export async function PATCH(
  request: Request,
  { params }: Context
) {
  const { id } = await params;

  const body = await request.json();

  try {
    const job = await prisma.job.update({
      where: {
        id,
      },

      data: {
        company: body.company,

        title: body.title,
        description: body.description,
        banner: body.banner,

        budgetMin: body.budgetMin,
        budgetMax: body.budgetMax,

        deadline: body.deadline
          ? new Date(body.deadline)
          : undefined,

        locationType: body.locationType,

        isVerified: body.isVerified,
        isOpen: body.isOpen,

        tags: body.tags,
      },

      include: {
        profile: true,
        address: true,
      },
    });

    return Response.json(job);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Job not found",
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
    await prisma.job.delete({
      where: {
        id,
      },
    });

    return Response.json({
      message: "Job deleted",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Job not found",
      },
      {
        status: 404,
      }
    );
  }
}