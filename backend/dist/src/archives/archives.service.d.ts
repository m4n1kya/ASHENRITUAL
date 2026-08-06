import { PrismaService } from '../prisma/prisma.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
export declare class ArchivesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateArchiveDto): unknown;
    findUserArchives(userId: string): unknown;
    findOne(id: string, userId: string): unknown;
}
