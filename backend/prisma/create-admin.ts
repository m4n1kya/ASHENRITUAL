import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Ashen@Admin1', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ashenritual.com' },
    update: { passwordHash: hash, role: 'ADMIN' },
    create: { email: 'admin@ashenritual.com', passwordHash: hash, role: 'ADMIN' },
  });
  console.log(`✅ Admin created: ${admin.email}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
