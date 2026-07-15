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
exports.ChaptersController = void 0;
const common_1 = require("@nestjs/common");
const chapters_service_1 = require("./chapters.service");
const swagger_1 = require("@nestjs/swagger");
let ChaptersController = class ChaptersController {
    chaptersService;
    constructor(chaptersService) {
        this.chaptersService = chaptersService;
    }
    findAll() {
        return this.chaptersService.findAll();
    }
    findBySlug(slug) {
        return this.chaptersService.findBySlug(slug);
    }
};
exports.ChaptersController = ChaptersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all Chapters (Collections)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all chapters.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChaptersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a Chapter by slug (e.g. forged-today)' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Chapter slug derived from name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the chapter.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chapter not found.' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChaptersController.prototype, "findBySlug", null);
exports.ChaptersController = ChaptersController = __decorate([
    (0, swagger_1.ApiTags)('Chapters (Collections)'),
    (0, common_1.Controller)('chapters'),
    __metadata("design:paramtypes", [chapters_service_1.ChaptersService])
], ChaptersController);
//# sourceMappingURL=chapters.controller.js.map