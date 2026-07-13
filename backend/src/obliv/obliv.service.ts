import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OblivService {
  private ai: GoogleGenAI;

  /** OBLIV system persona — injected into every Gemini request. */
  private readonly systemPrompt = `
You are OBLIV, AshenRitual's proprietary Wardrobe Intelligence.
You are an invisible creative director with exceptional taste in tailoring, silhouettes, proportions, and timeless menswear.
Your personality is quiet, confident, minimal, sophisticated, observant, and precise.
You are never overly enthusiastic. You are never robotic. You never converse just to converse.
You communicate with restraint. Every sentence feels intentional.
Examples of tone: "This combination creates a balanced silhouette.", "Minimal contrast. Maximum presence."
Do not use phrases like "Great choice!", "You'll love this!", or "How can I help you?".
Analyze the user's request, considering occasion, season, and fit, and provide complete outfit recommendations or capsule wardrobe guidance.
`;

  constructor(private prisma: PrismaService) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_build' });
  }

  /** General wardrobe consultation. */
  async consult(userQuery: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: this.systemPrompt + '\n\nUser Request: ' + userQuery }],
          },
        ],
      });

      return { response: response.text };
    } catch {
      throw new InternalServerErrorException('OBLIV is currently unavailable.');
    }
  }

  /**
   * Generates a personalized 'Complete the Ritual' outfit for a user.
   * Builds context from their SavedRituals (wishlist) and recent Archives (orders),
   * then prompts Gemini with that context for a tailored recommendation.
   */
  async generateOutfit(userId: string) {
    // Fetch saved rituals and last 5 orders in parallel
    const [savedRituals, recentArchives] = await Promise.all([
      this.prisma.savedRitual.findMany({
        where: { userId },
        include: {
          product: { select: { name: true, category: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.archive.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: { select: { name: true, category: { select: { name: true } } } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    // Build context string from user's taste data
    const savedContext =
      savedRituals.length > 0
        ? 'Saved Rituals (Wishlist): ' +
          savedRituals
            .map((sr) => `${sr.product.name} (${sr.product.category.name})`)
            .join(', ')
        : 'No saved rituals yet.';

    const orderedItems = recentArchives.flatMap((a) =>
      a.items.map((i) => `${i.product.name} (${i.product.category.name})`),
    );
    const orderedContext =
      orderedItems.length > 0
        ? 'Previously Purchased: ' + [...new Set(orderedItems)].join(', ')
        : 'No previous orders yet.';

    const contextBlock = `
User Taste Profile:
${savedContext}
${orderedContext}
`;

    const prompt = `
${this.systemPrompt}

${contextBlock}

Based on the user's taste profile above, curate a complete 'Complete the Ritual' outfit recommendation. 
Suggest specific garment types (e.g. overcoat, tailored trouser, knit, derby shoe) with styling notes.
Reference items from their profile where relevant.
Keep recommendations aligned with AshenRitual's quiet, precise menswear aesthetic.
`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      return { response: response.text };
    } catch {
      throw new InternalServerErrorException('OBLIV outfit generation is currently unavailable.');
    }
  }
}
