"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManager = void 0;
const common_1 = require("@nestjs/common");
let ContextManager = class ContextManager {
    formatContext(context) {
        const lines = [];
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
};
exports.ContextManager = ContextManager;
exports.ContextManager = ContextManager = __decorate([
    (0, common_1.Injectable)()
], ContextManager);
//# sourceMappingURL=context.manager.js.map