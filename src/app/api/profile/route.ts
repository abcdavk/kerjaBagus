import { prisma } from "@/lib/prisma";

export async function GET() {
  const profiles = await prisma.profile.findMany();
  

  if (!profiles) {
    return Response.json({ message: "Not Found", status: 404 });
  }

  return Response.json(profiles);
}