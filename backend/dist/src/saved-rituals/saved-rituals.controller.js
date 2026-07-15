"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedRitualsController = void 0;
const common_1 = require("@nestjs/common");
const saved_rituals_service_1 = require("./saved-rituals.service");
const toggle_saved_ritual_dto_1 = require("./dto/toggle-saved-ritual.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let SavedRitualsController = class SavedRitualsController {
    savedRitualsService;
    constructor(savedRitualsService) {
        this.savedRitualsService = savedRitualsService;
    }
    toggle(dto, req) {
        return this.savedRitualsService.toggle(req.user.userId, dto.productId);
    }
    findAll(req) {
        return this.savedRitualsService.findAll(req.user.userId);
    }
};
exports.SavedRitualsController = SavedRitualsController;
__decorate([
    (0, common_1.Post)('toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle a product in Saved Rituals (add if absent, remove if present)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '{ action: "saved" | "removed", productId }' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [toggle_saved_ritual_dto_1.ToggleSavedRitualDto, Object]),
    __metadata("design:returntype", void 0)
], SavedRitualsController.prototype, "toggle", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all Saved Rituals for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the user\'s wishlist.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SavedRitualsController.prototype, "findAll", null);
exports.SavedRitualsController = SavedRitualsController = __decorate([
    (0, swagger_1.ApiTags)('Saved Rituals (Wishlist)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('saved-rituals'),
    __metadata("design:paramtypes", [saved_rituals_service_1.SavedRitualsService])
], SavedRitualsController);
//# sourceMappingURL=saved-rituals.controller.js.map