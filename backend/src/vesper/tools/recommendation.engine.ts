import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecommendationEngine {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieval-First Logic:
   * Analyzes the last user message to extract keywords and fetch a subset of the catalog
   * to provide to the LLM as grounding context.
   */
  async retrieveContextData(lastUserQuery: string): Promise<string> {
    const query = lastUserQuery.toLowerCase();

    // Simple heuristic keyword extraction (in a real RAG system, this would be a vector search)
    const keywords = [
      'black',
      'white',
      'grey',
      'monochrome',
      'oversized',
      'suit',
      'jacket',
      't-shirt',
      'shirt',
      'formal',
      'casual',
      'winter',
      'summer',
    ];
    const matchedKeywords = keywords.filter((k) => query.includes(k));

    // Fetch relevant products
    const products = await this.prisma.product.findMany({
      where:
        matchedKeywords.length > 0
          ? {
              OR: matchedKeywords.map((k) => ({
                OR: [
                  { name: { contains: k } },
                  { description: { contains: k } },
                ],
              })),
            }
          : undefined, // If no keywords, just fetch top products
      take: 20,
      include: { category: true },
    });

    // Fetch active chapters
    const chapters = await this.prisma.chapter.findMany({
      take: 5,
      select: { name: true, description: true },
    });

    let context = '--- AVAILABLE INVENTORY SAMPLES ---\n';

    if (products.length > 0) {
      context += products
        .map(
          (p) =>
            `Product ID: ${p.id} | Name: ${p.name} | Category: ${p.category.name} | Price: ${p.price} | Desc: ${p.description}`,
        )
        .join('\n');
    } else {
      context +=
        'No specific inventory matched the keywords. Rely on general stylistic advice or fallback items.\n';
    }

    context += '\n\n--- ACTIVE CHAPTERS (COLLECTIONS) ---\n';
    context += chapters
      .map((c) => `Chapter: ${c.name} | Theme: ${c.description}`)
      .join('\n');

    return context;
  }
}
