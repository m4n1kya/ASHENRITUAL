import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query?: string, page?: string, limit?: string): unknown;
    findFeatured(): unknown;
    findNewArrivals(): unknown;
    findBestSellers(): unknown;
    findByCategory(slug: string, page?: string, limit?: string): unknown;
    findOne(id: string): unknown;
}
