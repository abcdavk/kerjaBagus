import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export async function generateUser() {
  const hashedPassword = await bcrypt.hash("password123", 12);
  return {
    email: faker.internet.email().toLowerCase(),

    // nanti bisa diganti bcrypt hash
    passwordHash: hashedPassword,

    isClient: faker.datatype.boolean(),
    isFreelancer: faker.datatype.boolean(),
    isAdmin: false,
  };
}