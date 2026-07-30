import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete old chapters that have no slug (legacy data)
  const deleted = await prisma.chapter.deleteMany({
    where: { slug: null }
  });
  console.log(`🗑  Deleted ${deleted.count} old chapter(s) without slug.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
