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
exports.ArchivesController = void 0;
const common_1 = require("@nestjs/common");
const archives_service_1 = require("./archives.service");
const create_archive_dto_1 = require("./dto/create-archive.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ArchivesController = class ArchivesController {
    archivesService;
    constructor(archivesService) {
        this.archivesService = archivesService;
    }
    create(dto, req) {
        return this.archivesService.create(req.user.userId, dto);
    }
    findMyArchives(req) {
        return this.archivesService.findUserArchives(req.user.userId);
    }
    findOne(id, req) {
        return this.archivesService.findOne(id, req.user.userId);
    }
};
exports.ArchivesController = ArchivesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Archive (place an order)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Archive created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid items or insufficient stock.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_archive_dto_1.CreateArchiveDto, Object]),
    __metadata("design:returntype", void 0)
], ArchivesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all Archives (orders) for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user\'s order history.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ArchivesController.prototype, "findMyArchives", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single Archive by ID (must belong to current user)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Archive UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the archive detail.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Archive not found.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ArchivesController.prototype, "findOne", null);
exports.ArchivesController = ArchivesController = __decorate([
    (0, swagger_1.ApiTags)('Archives (Orders)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('archives'),
    __metadata("design:paramtypes", [archives_service_1.ArchivesService])
], ArchivesController);
//# sourceMappingURL=archives.controller.js.map