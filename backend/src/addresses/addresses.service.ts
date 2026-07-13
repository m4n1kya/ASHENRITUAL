import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  /** Creates a new address for the given user. */
  async create(userId: string, dto: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        userId,
        street: dto.street,
        city: dto.city,
        zip: dto.zip,
        country: dto.country,
      },
    });
  }

  /** Returns all addresses belonging to the given user. */
  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Soft-deletes an address by ID.
   * Ensures the address belongs to the requesting user before removal.
   */
  async remove(id: string, userId: string) {
    const address = await this.prisma.address.findUnique({ where: { id } });

    if (!address) {
      throw new NotFoundException(`Address ${id} not found.`);
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this address.');
    }

    await this.prisma.address.delete({ where: { id } });

    return { message: 'Address removed.' };
  }
}
