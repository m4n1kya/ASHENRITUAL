import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): unknown;
    findBySlug(slug: string): unknown;
}
