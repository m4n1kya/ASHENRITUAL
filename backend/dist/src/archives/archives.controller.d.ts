import { ArchivesService } from './archives.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
export declare class ArchivesController {
    private readonly archivesService;
    constructor(archivesService: ArchivesService);
    create(dto: CreateArchiveDto, req: {
        user: JwtUser;
    }): unknown;
    findMyArchives(req: {
        user: JwtUser;
    }): unknown;
    findOne(id: string, req: {
        user: JwtUser;
    }): unknown;
}
export {};
