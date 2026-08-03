import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const users = await prisma.user.findMany({ select: { email: true, id: true } });
  console.log('Users in DB:', JSON.stringify(users, null, 2));
} catch (e) {
  console.error('DB Error:', e.message);
} finally {
  await prisma.$disconnect();
}
