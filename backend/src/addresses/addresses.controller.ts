import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

@ApiTags('Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new shipping address' })
  @ApiResponse({ status: 201, description: 'Address created.' })
  create(
    @Body() dto: CreateAddressDto,
    @Request() req: { user: JwtUser },
  ) {
    return this.addressesService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses for the current user' })
  @ApiResponse({ status: 200, description: 'Returns user\'s addresses.' })
  findAll(@Request() req: { user: JwtUser }) {
    return this.addressesService.findAll(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address by ID' })
  @ApiParam({ name: 'id', description: 'Address UUID' })
  @ApiResponse({ status: 200, description: 'Address removed.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  remove(
    @Param('id') id: string,
    @Request() req: { user: JwtUser },
  ) {
    return this.addressesService.remove(id, req.user.userId);
  }
}
