// import { prisma } from "@/lib/prisma";
// import { getCurrentUser } from "@/lib/auth";

// // GET -> list semua job yang disimpan user
// export async function GET() {
//   const user = await getCurrentUser();
//   if (!user) {
//     return Response.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const saved = await prisma.savedJob.findMany({
//     where: { userId: user.id },
//     include: { job: true },
//     orderBy: { createdAt: "desc" },
//   });

//   return Response.json({ saved });
// }

// // POST -> simpan job (body: { jobId: string })
// export async function POST(request: Request) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return Response.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { jobId } = await request.json();
//     if (!jobId) {
//       return Response.json({ message: "jobId is required" }, { status: 400 });
//     }

//     const saved = await prisma.savedJob.create({
//       data: { userId: user.id, jobId },
//     });

//     return Response.json({ saved }, { status: 201 });
//   } catch (error) {
//     // kemungkinan besar unique constraint violation (udah pernah disimpan)
//     return Response.json(
//       { message: "Job already saved or invalid jobId" },
//       { status: 400 },
//     );
//   }
// }

// // DELETE -> hapus dari simpanan (body: { jobId: string })
// export async function DELETE(request: Request) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return Response.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { jobId } = await request.json();
//     if (!jobId) {
//       return Response.json({ message: "jobId is required" }, { status: 400 });
//     }

//     await prisma.savedJob.delete({
//       where: { userId_jobId: { userId: user.id, jobId } },
//     });

//     return Response.json({ message: "Removed" });
//   } catch (error) {
//     return Response.json({ message: "Failed to remove" }, { status: 400 });
//   }
// }
