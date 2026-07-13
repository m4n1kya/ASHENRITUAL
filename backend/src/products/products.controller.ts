import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products, optionally search by query' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query (name/description)' })
  @ApiResponse({ status: 200, description: 'Returns all matching products.' })
  findAll(@Query('q') query?: string) {
    return this.productsService.findAll(query);
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
  @ApiParam({ name: 'slug', description: 'Category slug (e.g. shirts, trousers)' })
  @ApiResponse({ status: 200, description: 'Returns products in the category.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findByCategory(@Param('slug') slug: string) {
    return this.productsService.findByCategory(slug);
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
