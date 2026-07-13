import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ASHENRITUAL database...\n');

  // ── Categories ─────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'shirts' },
      update: {},
      create: { name: 'Shirts', slug: 'shirts' },
    }),
    prisma.category.upsert({
      where: { slug: 'trousers' },
      update: {},
      create: { name: 'Trousers', slug: 'trousers' },
    }),
    prisma.category.upsert({
      where: { slug: 'outerwear' },
      update: {},
      create: { name: 'Outerwear', slug: 'outerwear' },
    }),
    prisma.category.upsert({
      where: { slug: 'footwear' },
      update: {},
      create: { name: 'Footwear', slug: 'footwear' },
    }),
  ]);

  const [shirts, trousers, outerwear, footwear] = categories;
  console.log(`  ✓ ${categories.length} categories created`);

  // ── Chapters ───────────────────────────────────────────────────────
  const chapters = await Promise.all([
    prisma.chapter.upsert({
      where: { name: 'Foundation' },
      update: {},
      create: {
        name: 'Foundation',
        description: 'The timeless pieces that anchor every wardrobe. Precision-cut staples designed for quiet permanence.',
        image: '/images/texture.png',
      },
    }),
    prisma.chapter.upsert({
      where: { name: 'Forged Today' },
      update: {},
      create: {
        name: 'Forged Today',
        description: 'New arrivals forged with deliberate intention. Contemporary silhouettes that speak softly.',
        image: '/images/product.png',
      },
    }),
    prisma.chapter.upsert({
      where: { name: 'Epoch' },
      update: {},
      create: {
        name: 'Epoch',
        description: 'Limited-run pieces that define a moment. Once they are gone, they do not return.',
        image: '/images/hero.png',
      },
    }),
  ]);
  console.log(`  ✓ ${chapters.length} chapters created`);

  // ── Products ───────────────────────────────────────────────────────
  const products = await Promise.all([
    // Shirts
    prisma.product.create({
      data: {
        name: 'Graphite Overshirt',
        description: 'A structured overshirt in matte graphite cotton. Concealed button placket. Designed to layer without volume.',
        price: 4999,
        images: ['/images/product.png'],
        stock: 35,
        categoryId: shirts.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Charcoal Mandarin Shirt',
        description: 'Band collar. Minimal seams. Washed once for a lived-in softness that never wrinkles under pressure.',
        price: 3499,
        images: ['/images/texture.png'],
        stock: 42,
        categoryId: shirts.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bone Linen Shirt',
        description: 'Pure European linen in a muted bone tone. Relaxed fit. The kind of white that whispers.',
        price: 3999,
        images: ['/images/hero.png'],
        stock: 28,
        categoryId: shirts.id,
      },
    }),
    // Trousers
    prisma.product.create({
      data: {
        name: 'Architectural Trouser',
        description: 'Wide-leg trouser in heavy cotton twill. Pleated front. Sits at the natural waist. Built for presence.',
        price: 5499,
        images: ['/images/texture.png'],
        stock: 20,
        categoryId: trousers.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Obsidian Slim Trouser',
        description: 'Tapered silhouette in jet-black stretch cotton. Clean lines. Zero distraction.',
        price: 4299,
        images: ['/images/product.png'],
        stock: 45,
        categoryId: trousers.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Stone Relaxed Chino',
        description: 'Soft-washed cotton in a muted stone shade. Relaxed through the thigh. Tapered below the knee.',
        price: 3799,
        images: ['/images/hero.png'],
        stock: 30,
        categoryId: trousers.id,
      },
    }),
    // Outerwear
    prisma.product.create({
      data: {
        name: 'Matte Black Overcoat',
        description: 'Double-breasted overcoat in heavyweight wool-blend. Knee-length. The architecture of restraint.',
        price: 12999,
        images: ['/images/hero.png'],
        stock: 12,
        categoryId: outerwear.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ash Bomber Jacket',
        description: 'Minimal bomber in washed ash nylon. Ribbed cuffs and hem. No logos, no excess.',
        price: 7999,
        images: ['/images/product.png'],
        stock: 18,
        categoryId: outerwear.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Shadow Field Jacket',
        description: 'Four-pocket field jacket in brushed cotton. Hidden zippers. Designed for movement without compromise.',
        price: 8999,
        images: ['/images/texture.png'],
        stock: 15,
        categoryId: outerwear.id,
      },
    }),
    // Footwear
    prisma.product.create({
      data: {
        name: 'Carbon Derby',
        description: 'Full-grain leather derby in deep carbon. Minimal stitching. Blake-stitched sole for a clean profile.',
        price: 9499,
        images: ['/images/texture.png'],
        stock: 22,
        categoryId: footwear.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Muted Suede Chelsea',
        description: 'Chelsea boot in muted gray suede. Elastic side panel. The quietest boot in any room.',
        price: 8499,
        images: ['/images/product.png'],
        stock: 16,
        categoryId: footwear.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smoke Minimal Sneaker',
        description: 'Low-top sneaker in smoke-toned leather. Tonal laces and sole. Designed to go unnoticed — deliberately.',
        price: 6999,
        images: ['/images/hero.png'],
        stock: 38,
        categoryId: footwear.id,
      },
    }),
  ]);
  console.log(`  ✓ ${products.length} products created`);

  // ── Admin User ─────────────────────────────────────────────────────
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('admin123', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ashenritual.com' },
    update: {},
    create: {
      email: 'admin@ashenritual.com',
      passwordHash: hash,
      role: 'ADMIN',
    },
  });
  console.log(`  ✓ Admin user created: ${admin.email}`);

  // ── Demo Customer ──────────────────────────────────────────────────
  const customerHash = await bcrypt.hash('customer123', salt);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@ashenritual.com' },
    update: {},
    create: {
      email: 'customer@ashenritual.com',
      passwordHash: customerHash,
      role: 'USER',
    },
  });
  console.log(`  ✓ Demo customer created: ${customer.email}`);

  console.log('\n✅ Seeding complete. The ritual begins.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
