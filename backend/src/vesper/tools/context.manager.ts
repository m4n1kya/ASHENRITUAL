import { Injectable } from '@nestjs/common';

export interface VesperUserContext {
  currentPage?: string;
  currentProductId?: string;
  cartItems?: string[]; // IDs
  savedRituals?: string[]; // IDs
  recentSearches?: string[];
  localTime?: string;
  bodyProfile?: any;
}

@Injectable()
export class ContextManager {
  
  formatContext(context: VesperUserContext): string {
    const lines: string[] = [];
    
    if (context.localTime) {
      lines.push(`User Local Time: ${context.localTime}`);
    }
    
    if (context.currentPage) {
      lines.push(`Current Page: ${context.currentPage}`);
    }
    
    if (context.currentProductId) {
      lines.push(`Currently Viewing Product ID: ${context.currentProductId}`);
    }

    if (context.cartItems && context.cartItems.length > 0) {
      lines.push(`Cart Contains Product IDs: ${context.cartItems.join(', ')}`);
    }

    if (context.savedRituals && context.savedRituals.length > 0) {
      lines.push(`User's Saved Rituals (Wishlist) Product IDs: ${context.savedRituals.join(', ')}`);
    }

    if (context.bodyProfile) {
      lines.push(`---`);
      lines.push(`[SIZE INTELLIGENCE ACTIVE] User's Body Profile:`);
      lines.push(`Height: ${context.bodyProfile.measurements.heightCm}cm | Weight: ${context.bodyProfile.measurements.weightKg}kg`);
      lines.push(`Shoulders: ${context.bodyProfile.measurements.shoulderWidthCm}cm | Chest: ${context.bodyProfile.measurements.chestCircumferenceCm}cm | Waist: ${context.bodyProfile.measurements.waistCircumferenceCm}cm`);
      lines.push(`Body Type: ${context.bodyProfile.bodyType} | Preferred Fit: ${context.bodyProfile.preferredFit}`);
      lines.push(`---`);
    }

    if (lines.length === 0) {
      return 'No specific user context available.';
    }

    return lines.join('\n');
  }
}
