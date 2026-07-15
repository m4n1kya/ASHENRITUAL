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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateCartDto = exports.CartItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CartItemDto {
    productId;
    quantity;
}
exports.CartItemDto = CartItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product UUID', example: 'a1b2c3d4-...' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CartItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity requested', example: 2 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CartItemDto.prototype, "quantity", void 0);
class ValidateCartDto {
    items;
}
exports.ValidateCartDto = ValidateCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CartItemDto], description: 'Array of cart line items to validate' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CartItemDto),
    __metadata("design:type", Array)
], ValidateCartDto.prototype, "items", void 0);
//# sourceMappingURL=validate-cart.dto.js.map