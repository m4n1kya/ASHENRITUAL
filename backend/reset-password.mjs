import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('admin123', salt);
  
  await prisma.user.update({
    where: { email: 'admin@ashenritual.com' },
    data: { passwordHash: hash }
  });
  console.log('Password reset to admin123 for admin@ashenritual.com');

  // Verify it works
  const user = await prisma.user.findUnique({ where: { email: 'admin@ashenritual.com' } });
  const valid = await bcrypt.compare('admin123', user.passwordHash);
  console.log('Verification:', valid ? 'PASSWORD VALID ✓' : 'STILL INVALID ✗');
} catch (e) {
  console.error('Error:', e.message);
} finally {
  await prisma.$disconnect();
}
