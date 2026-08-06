import { ChaptersService } from './chapters.service';
export declare class ChaptersController {
    private readonly chaptersService;
    constructor(chaptersService: ChaptersService);
    findAll(): unknown;
    findBySlug(slug: string): unknown;
}
