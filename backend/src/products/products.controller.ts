/**
 * @fileoverview ASHENRITUAL Architecture
 * @module products.controller.ts
 */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products, optionally search by query' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query (name/description)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({ status: 200, description: 'Returns paginated products.' })
  findAll(
    @Query('q') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 24;
    return this.productsService.findAll(query, pageNumber, limitNumber);
  }

  // ── Special named routes MUST come before :id to avoid route collisions ──

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products (most saved to Rituals)' })
  @ApiResponse({ status: 200, description: 'Returns top featured products.' })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get('new-arrivals')
  @ApiOperation({ summary: 'Get new arrivals (most recently added)' })
  @ApiResponse({ status: 200, description: 'Returns newest products.' })
  findNewArrivals() {
    return this.productsService.findNewArrivals();
  }

  @Get('best-sellers')
  @ApiOperation({ summary: 'Get best sellers (most units sold)' })
  @ApiResponse({ status: 200, description: 'Returns best-selling products.' })
  findBestSellers() {
    return this.productsService.findBestSellers();
  }

  @Get('category/:slug')
  @ApiOperation({ summary: 'Get all products in a category by its slug' })
  @ApiParam({
    name: 'slug',
    description: 'Category slug (e.g. shirts, trousers)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated products in the category.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findByCategory(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 24;
    return this.productsService.findByCategory(slug, pageNumber, limitNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Returns the product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
