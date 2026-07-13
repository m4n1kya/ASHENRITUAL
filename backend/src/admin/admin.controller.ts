import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Dashboard ─────────────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns totalRevenue, totalOrders, totalUsers, totalProducts.',
  })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ── Product Management ────────────────────────────────────────────────────

  @Post('products')
  @ApiOperation({ summary: 'Create a new product (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Product created.' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update a product by ID (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product updated.' })
  updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.adminService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product by ID (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product deleted.' })
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }
}
