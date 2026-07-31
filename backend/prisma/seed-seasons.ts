import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toSlug(name: string) {
  return name.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-');
}

const seasons = [
  {
    name: 'Vernal Silence',
    description: 'A violent rebirth. Light layers that breathe, shedding the weight of the past. Pieces that move with the returning wind.',
    quote: '"It is spring again. The earth is like a child that knows poems by heart."',
    quoteAuthor: 'Rainer Maria Rilke',
    image: '/images/chapters/Vernal Silence.jpg'
  },
  {
    name: 'Summer Afterglow',
    description: 'Sun-drenched minimalism. The bare essentials. Fluid fabrics and architectural cuts that let the skin breathe beneath the relentless sun.',
    quote: '"And so with the sunshine and the great bursts of leaves growing on the trees, just as things grow in fast movies, I had that familiar conviction that life was beginning over again with the summer."',
    quoteAuthor: 'F. Scott Fitzgerald',
    image: '/images/chapters/Summer Afterglow.jpg'
  },
  {
    name: 'Autumn Ashes',
    description: 'When the heat recedes and the world begins to strip itself bare. A collection of structured layers and earth-bound tones, designed for the quiet descent into the darker months.',
    quote: '"Autumn is a second spring when every leaf is a flower."',
    quoteAuthor: 'Albert Camus',
    image: '/images/chapters/Autumn Ashes.jpg'
  },
  {
    name: 'Winter Solitude',
    description: 'The world stands still in silent frost. Heavy textures, monolithic silhouettes, and warmth forged against the biting cold.',
    quote: '"In the depth of winter, I finally learned that within me there lay an invincible summer."',
    quoteAuthor: 'Albert Camus',
    image: '/images/chapters/Winter Solitude.jpg'
  },
  {
    name: 'Monsoon Reverie',
    description: 'The sky tears itself open. Waterproof layers, utilitarian design, and deep greys. Clothing built to withstand the melancholic downpour.',
    quote: '"Let the rain kiss you. Let the rain beat upon your head with silver liquid drops. Let the rain sing you a lullaby."',
    quoteAuthor: 'Langston Hughes',
    image: '/images/chapters/Monsoon Reverie.jpg'
  },
  {
    name: 'The White Hour',
    description: 'The edge of existence. Extreme insulation, technical fabrics, and sharp lines that cut through the frozen haze. A survival ritual.',
    quote: '"To appreciate the beauty of a snowflake it is necessary to stand out in the cold."',
    quoteAuthor: 'Aristotle',
    image: '/images/chapters/The White Hour.jpg'
  }
];

async function main() {
  console.log('🌱 Seeding poetic seasons (chapters)...');
  
  // Clear existing chapters first to apply new names cleanly
  await prisma.chapter.deleteMany();
  
  const allProducts = await prisma.product.findMany();

  for (const season of seasons) {
    // Select 4-8 random products for each season
    const numProducts = Math.floor(Math.random() * 5) + 4;
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffled.slice(0, numProducts);

    const chapter = await prisma.chapter.upsert({
      where: { name: season.name },
      update: {
        slug: toSlug(season.name),
        description: season.description,
        quote: season.quote,
        quoteAuthor: season.quoteAuthor,
        image: season.image,
        products: {
          set: selectedProducts.map(p => ({ id: p.id }))
        }
      },
      create: {
        name: season.name,
        slug: toSlug(season.name),
        description: season.description,
        quote: season.quote,
        quoteAuthor: season.quoteAuthor,
        image: season.image,
        products: {
          connect: selectedProducts.map(p => ({ id: p.id }))
        }
      }
    });
    
    console.log(`Created/Updated season: ${chapter.name} with ${selectedProducts.length} pieces.`);
  }

  console.log('✅ Seasons seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
