import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VesperService {
  private ai: GoogleGenAI;

  private readonly systemPrompt = `
You are Vesper, AshenRitual's proprietary Wardrobe Intelligence.
You are an invisible creative director with exceptional taste in tailoring, silhouettes, proportions, and timeless menswear.
Your personality is quiet, confident, minimal, sophisticated, observant, and precise.
You communicate with restraint. Every sentence feels intentional.
You MUST output strictly in JSON format matching this structure:
{
  "title": "A short, evocative title (e.g. 'The Architect's Uniform')",
  "description": "A refined description of the recommended aesthetic (2-3 sentences)",
  "stylingNotes": "Precise styling directives, focusing on layering, textures, and proportions",
  "productIds": ["uuid-1", "uuid-2", "uuid-3"]
}
Only recommend productIds that are provided to you in the Product Catalog context.
`;

  constructor(private prisma: PrismaService) {
    this.ai = new GoogleGenAI({
      apiKey:
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_GEMINI_API_KEY ||
        'dummy_key_for_build',
    });
  }

  async consult(params: {
    occasion: string;
    weather: string;
    dressCode: string;
    palette: string;
    silhouette: string;
  }) {
    try {
      // Fetch catalog to give Gemini options
      const products = await this.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          category: { select: { name: true } },
        },
      });

      const catalogContext = products
        .map(
          (p) =>
            `ID: ${p.id} | Name: ${p.name} | Category: ${p.category.name} | Desc: ${p.description}`,
        )
        .join('\n');

      const userContext = `
Context Parameters:
- Occasion: ${params.occasion}
- Weather: ${params.weather}
- Dress Code: ${params.dressCode}
- Palette: ${params.palette}
- Silhouette: ${params.silhouette}

Product Catalog (ONLY use IDs from this list):
${catalogContext}
`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
          {
            role: 'user',
            parts: [{ text: this.systemPrompt + '\n\n' + userContext }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2, // Low temp for more precise, less hallucinatory output
        },
      });

      const jsonStr = response.text;
      if (!jsonStr) throw new Error('No response from Vesper');

      const parsed = JSON.parse(jsonStr);

      // Map IDs to actual full products
      const recommendedProducts = await this.prisma.product.findMany({
        where: { id: { in: parsed.productIds } },
        include: { category: true },
      });

      return {
        id: 'vesper-' + Date.now(),
        title: parsed.title,
        description: parsed.description,
        stylingNotes: parsed.stylingNotes,
        products: recommendedProducts,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Vesper Intelligence is currently unavailable.',
      );
    }
  }

  // Fallback for older frontend routes if any
  async generateOutfit(userId: string) {
    return this.consult({
      occasion: 'Everyday Minimal',
      weather: 'Transitional Autumn',
      dressCode: 'Smart Casual',
      palette: 'Earth & Stone',
      silhouette: 'Tailored & Sharp',
    });
  }
}
