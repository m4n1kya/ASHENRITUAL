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
exports.VesperController = void 0;
const common_1 = require("@nestjs/common");
const vesper_service_1 = require("./vesper.service");
const consult_vesper_dto_1 = require("./dto/consult-vesper.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let VesperController = class VesperController {
    vesperService;
    constructor(vesperService) {
        this.vesperService = vesperService;
    }
    consult(dto) {
        return this.vesperService.consult(dto);
    }
    generateOutfit(req) {
        return this.vesperService.generateOutfit(req.user.userId);
    }
};
exports.VesperController = VesperController;
__decorate([
    (0, common_1.Post)('consult'),
    (0, swagger_1.ApiOperation)({ summary: 'Consult Vesper for wardrobe intelligence' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VESPER has curated an outfit.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [consult_vesper_dto_1.ConsultVesperDto]),
    __metadata("design:returntype", void 0)
], VesperController.prototype, "consult", null);
__decorate([
    (0, common_1.Post)('outfit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate a personalized "Complete the Ritual" outfit',
        description: 'VESPER analyzes the user\'s Saved Rituals and past Archives to recommend a curated outfit.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns a personalized outfit recommendation.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VesperController.prototype, "generateOutfit", null);
exports.VesperController = VesperController = __decorate([
    (0, swagger_1.ApiTags)('VESPER - Wardrobe Intelligence'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('vesper'),
    __metadata("design:paramtypes", [vesper_service_1.VesperService])
], VesperController);
//# sourceMappingURL=vesper.controller.js.map