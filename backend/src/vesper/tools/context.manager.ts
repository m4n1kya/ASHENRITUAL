import { Injectable } from '@nestjs/common';

export interface VesperUserContext {
  currentPage?: string;
  currentProductId?: string;
  cartItems?: string[]; // IDs
  savedRituals?: string[]; // IDs
  recentSearches?: string[];
  localTime?: string;
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

    if (lines.length === 0) {
      return 'No specific user context available.';
    }

    return lines.join('\n');
  }
}
