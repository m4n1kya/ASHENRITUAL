import { AdminService } from './admin.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<import("./admin.service").DashboardStats>;
    createProduct(dto: CreateProductDto): unknown;
    updateProduct(id: string, dto: UpdateProductDto): unknown;
    deleteProduct(id: string): unknown;
    getOrders(): unknown;
}
