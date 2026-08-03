"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VesperModule = void 0;
const common_1 = require("@nestjs/common");
const vesper_controller_1 = require("./vesper.controller");
const vesper_orchestrator_1 = require("./vesper.orchestrator");
const gemini_provider_1 = require("./providers/gemini.provider");
const context_manager_1 = require("./tools/context.manager");
const recommendation_engine_1 = require("./tools/recommendation.engine");
const prisma_module_1 = require("../prisma/prisma.module");
let VesperModule = class VesperModule {
};
exports.VesperModule = VesperModule;
exports.VesperModule = VesperModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [vesper_controller_1.VesperController],
        providers: [
            vesper_orchestrator_1.VesperOrchestrator,
            gemini_provider_1.GeminiProvider,
            context_manager_1.ContextManager,
            recommendation_engine_1.RecommendationEngine
        ],
        exports: [vesper_orchestrator_1.VesperOrchestrator],
    })
], VesperModule);
//# sourceMappingURL=vesper.module.js.map