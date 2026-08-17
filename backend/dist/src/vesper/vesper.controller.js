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
const vesper_orchestrator_1 = require("./vesper.orchestrator");
const vesper_size_service_1 = require("./vesper-size.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let VesperController = class VesperController {
    orchestrator;
    sizeService;
    constructor(orchestrator, sizeService) {
        this.orchestrator = orchestrator;
        this.sizeService = sizeService;
    }
    async analyzeSize(dto) {
        return this.sizeService.analyzeProportions(dto);
    }
    async chatStream(dto, req, res) {
        const user = req.user;
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();
        let eventId = 0;
        try {
            const stream = this.orchestrator.chatStream(dto.messages, dto.context, user?.userId, user?.email);
            for await (const chunk of stream) {
                eventId++;
                const data = JSON.stringify(chunk);
                res.write(`id: ${eventId}\ndata: ${data}\n\n`);
            }
        }
        catch (err) {
            console.error('SSE Error in Vesper Chat', err);
            eventId++;
            const errorChunk = JSON.stringify({
                type: 'text',
                content: 'Our intelligence network experienced an interruption. Please try again.',
            });
            res.write(`id: ${eventId}\ndata: ${errorChunk}\n\n`);
        }
        res.end();
    }
};
exports.VesperController = VesperController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('analyze-size'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VesperController.prototype, "analyzeSize", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('chat'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], VesperController.prototype, "chatStream", null);
exports.VesperController = VesperController = __decorate([
    (0, common_1.Controller)('vesper'),
    __metadata("design:paramtypes", [vesper_orchestrator_1.VesperOrchestrator,
        vesper_size_service_1.VesperSizeService])
], VesperController);
//# sourceMappingURL=vesper.controller.js.map