import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        title: "Classic Backpack",
        description: "Durable backpack for daily use.",
        price: 70,
        inventory: 10
      },
      {
        title: "Kids Stan Smith",
        description: "Iconic court shoes for kids.",
        price: 90,
        inventory: 15
      }
    ]
  });
  console.log("Seed done");
}
main().finally(() => prisma.$disconnect());
