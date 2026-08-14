import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShowroomsService {
  constructor(private prisma: PrismaService) {}

  async getAllShowrooms() {
    return this.prisma.showroom.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { creators: true, products: true },
        },
      },
    });
  }

  async getShowroomBySlug(slug: string) {
    const showroom = await this.prisma.showroom.findUnique({
      where: { slug },
      include: {
        products: { include: { product: true } },
        creators: {
          include: {
            user: {
              select: { displayName: true, username: true, avatar: true },
            },
          },
        },
        reviews: true,
      },
    });

    if (!showroom) throw new NotFoundException('Showroom not found');
    return showroom;
  }

  async applyToShowroom(userId: string, showroomId: string, data: any) {
    const creator = await this.prisma.creator.findUnique({ where: { userId } });
    if (!creator)
      throw new ForbiddenException(
        'You must be a Creator to apply to a showroom',
      );

    return this.prisma.showroomApplication.create({
      data: {
        creatorId: creator.id,
        showroomId,
        reason: data.reason,
        portfolioLink: data.portfolioLink,
        collections: data.collections || [],
      },
    });
  }

  async getDashboardAnalytics(userId: string) {
    // Only fetch for showrooms owned by this user
    const showrooms = await this.prisma.showroom.findMany({
      where: { ownerId: userId },
      include: {
        applications: { where: { status: 'PENDING' } },
        products: true,
        creators: true,
      },
    });

    if (!showrooms.length)
      throw new ForbiddenException('No showrooms owned by this user');

    const pendingApplications = showrooms.reduce(
      (acc, curr) => acc + curr.applications.length,
      0,
    );
    const totalProducts = showrooms.reduce(
      (acc, curr) => acc + curr.products.length,
      0,
    );
    const affiliatedCreators = showrooms.reduce(
      (acc, curr) => acc + curr.creators.length,
      0,
    );

    return {
      showrooms,
      pendingApplications,
      totalProducts,
      affiliatedCreators,
    };
  }

  async updateApplication(
    userId: string,
    applicationId: string,
    status: 'APPROVED' | 'REJECTED' | 'INTERVIEW',
  ) {
    const application = await this.prisma.showroomApplication.findUnique({
      where: { id: applicationId },
      include: { showroom: true },
    });

    if (!application) throw new NotFoundException('Application not found');
    if (application.showroom.ownerId !== userId) {
      throw new ForbiddenException('You do not own this showroom');
    }

    const updated = await this.prisma.showroomApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    // If approved, affiliate the creator
    if (status === 'APPROVED') {
      await this.prisma.showroom.update({
        where: { id: application.showroomId },
        data: {
          creators: {
            connect: { id: application.creatorId },
          },
        },
      });
    }

    return updated;
  }
}
