import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

export interface SizeAnalysisRequest {
  heightCm: number;
  weightKg: number;
  shoulderWidthCm: number;
  chestCircumferenceCm: number;
  waistCircumferenceCm: number;
  sleeveLengthCm: number;
  neckCircumferenceCm: number;
  gender: string;
  preferredFit: string;
}

export interface SizeAnalysisResponse {
  bodyType: string;
  confidenceScore: number;
  report: string;
}

@Injectable()
export class VesperSizeService {
  private readonly logger = new Logger(VesperSizeService.name);
  private ai: GoogleGenAI;

  private readonly SYSTEM_PROMPT = `
You are the Size Intelligence Engine for ASHENRITUAL, a luxury tailoring concierge.
Your task is to analyze the user's precise body measurements and output a strictly formatted JSON response determining their Body Type, a Confidence Score (0-100), and a brief, highly professional luxury editorial report (1-3 sentences) explaining their proportions.

DO NOT use medical terminology (e.g., BMI, obesity, underweight).
DO NOT use consumer-tech language (e.g., "scan complete", "biometrics").
USE editorial luxury language (e.g., "naturally balanced", "structured frame", "tapered silhouette").

EXPECTED JSON STRUCTURE:
{
  "bodyType": "Athletic Slim | Athletic Broad | Slender | Average | Stocky",
  "confidenceScore": 94,
  "report": "Your proportions indicate a naturally balanced upper body with a moderate shoulder frame and tapered waist. Garments designed with structured shoulders and slim silhouettes will provide the most harmonious fit."
}
`;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey:
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_GEMINI_API_KEY ||
        'dummy_key_for_build',
    });
  }

  async analyzeProportions(
    dto: SizeAnalysisRequest,
  ): Promise<SizeAnalysisResponse> {
    const userContext = `
USER MEASUREMENTS:
- Height: ${dto.heightCm} cm
- Weight: ${dto.weightKg} kg
- Gender: ${dto.gender}
- Shoulders: ${dto.shoulderWidthCm} cm
- Chest: ${dto.chestCircumferenceCm} cm
- Waist: ${dto.waistCircumferenceCm} cm
- Sleeves: ${dto.sleeveLengthCm} cm
- Neck: ${dto.neckCircumferenceCm} cm
- Preferred Fit: ${dto.preferredFit}
`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
          {
            role: 'user',
            parts: [{ text: this.SYSTEM_PROMPT + '\n\n' + userContext }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const jsonStr = response.text;
      if (!jsonStr) throw new Error('No response from Size Intelligence');

      const parsed = JSON.parse(jsonStr);

      return {
        bodyType: parsed.bodyType || 'Average',
        confidenceScore: parsed.confidenceScore || 90,
        report: parsed.report || 'Proportions analyzed successfully.',
      };
    } catch (error) {
      this.logger.error('Failed to analyze proportions', error);
      // Fallback
      return {
        bodyType: 'Unknown',
        confidenceScore: 85,
        report:
          'We have registered your measurements into the architectural profile. Your selections will now be guided by this foundation.',
      };
    }
  }
}
