import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ── Core Modules ──────────────────────────────────────────────────────────────
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// ── Product & Catalog ─────────────────────────────────────────────────────────
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ChaptersModule } from './chapters/chapters.module';

// ── Commerce ──────────────────────────────────────────────────────────────────
import { CartModule } from './cart/cart.module';
import { ArchivesModule } from './archives/archives.module';
import { SavedRitualsModule } from './saved-rituals/saved-rituals.module';
import { AddressesModule } from './addresses/addresses.module';

// ── Social ────────────────────────────────────────────────────────────────────
import { ReviewsModule } from './reviews/reviews.module';

// ── AI ────────────────────────────────────────────────────────────────────────
import { OblivModule } from './obliv/obliv.module';

// ── Admin ─────────────────────────────────────────────────────────────────────
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Core
    PrismaModule,
    AuthModule,
    UsersModule,

    // Catalog
    ProductsModule,
    CategoriesModule,
    ChaptersModule,

    // Commerce
    CartModule,
    ArchivesModule,
    SavedRitualsModule,
    AddressesModule,

    // Social
    ReviewsModule,

    // AI Intelligence
    OblivModule,

    // Admin
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
