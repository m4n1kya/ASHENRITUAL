import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test_oauth@example.com',
        provider: 'GOOGLE',
        providerId: '123456789',
        name: null,
        avatar: null,
        emailVerified: true,
      },
    });
    console.log('Created:', user);
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Deleted successfully.');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
