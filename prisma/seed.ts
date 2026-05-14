import { PrismaClient } from "@prisma/client";
import { PARTIES } from "../src/lib/parties";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${PARTIES.length} parties…`);

  for (const p of PARTIES) {
    await prisma.party.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        shortName: p.shortName,
        fullName: p.fullName,
        color: p.color,
        order: p.order,
        active: p.active,
      },
      update: {
        shortName: p.shortName,
        fullName: p.fullName,
        color: p.color,
        order: p.order,
        active: p.active,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
