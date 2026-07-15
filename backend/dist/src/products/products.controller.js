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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const swagger_1 = require("@nestjs/swagger");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    findAll(query) {
        return this.productsService.findAll(query);
    }
    findFeatured() {
        return this.productsService.findFeatured();
    }
    findNewArrivals() {
        return this.productsService.findNewArrivals();
    }
    findBestSellers() {
        return this.productsService.findBestSellers();
    }
    findByCategory(slug) {
        return this.productsService.findByCategory(slug);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products, optionally search by query' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, description: 'Search query (name/description)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all matching products.' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured products (most saved to Rituals)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns top featured products.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findFeatured", null);
__decorate([
    (0, common_1.Get)('new-arrivals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get new arrivals (most recently added)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns newest products.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findNewArrivals", null);
__decorate([
    (0, common_1.Get)('best-sellers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get best sellers (most units sold)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns best-selling products.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findBestSellers", null);
__decorate([
    (0, common_1.Get)('category/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products in a category by its slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Category slug (e.g. shirts, trousers)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns products in the category.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found.' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single product by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Product UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the product.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map