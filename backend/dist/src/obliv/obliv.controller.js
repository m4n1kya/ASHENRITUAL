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
exports.OblivController = void 0;
const common_1 = require("@nestjs/common");
const obliv_service_1 = require("./obliv.service");
const consult_obliv_dto_1 = require("./dto/consult-obliv.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let OblivController = class OblivController {
    oblivService;
    constructor(oblivService) {
        this.oblivService = oblivService;
    }
    consult(dto) {
        return this.oblivService.consult(dto.query);
    }
    generateOutfit(req) {
        return this.oblivService.generateOutfit(req.user.userId);
    }
};
exports.OblivController = OblivController;
__decorate([
    (0, common_1.Post)('consult'),
    (0, swagger_1.ApiOperation)({ summary: 'Consult OBLIV for wardrobe intelligence' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OBLIV has analyzed the request.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [consult_obliv_dto_1.ConsultOblivDto]),
    __metadata("design:returntype", void 0)
], OblivController.prototype, "consult", null);
__decorate([
    (0, common_1.Post)('outfit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate a personalized "Complete the Ritual" outfit',
        description: 'OBLIV analyzes the user\'s Saved Rituals and past Archives to recommend a curated outfit.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns a personalized outfit recommendation.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OblivController.prototype, "generateOutfit", null);
exports.OblivController = OblivController = __decorate([
    (0, swagger_1.ApiTags)('OBLIV - Wardrobe Intelligence'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('obliv'),
    __metadata("design:paramtypes", [obliv_service_1.OblivService])
], OblivController);
//# sourceMappingURL=obliv.controller.js.map