"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding ASHENRITUAL database...\n');
    await prisma.orderItem.deleteMany({});
    await prisma.archive.deleteMany({});
    await prisma.savedRitual.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.chapter.deleteMany({});
    await prisma.category.deleteMany({});
    const [shirts, trousers, outerwear, footwear, suits, tshirts, coats] = await Promise.all([
        prisma.category.create({ data: { name: 'Shirts', slug: 'shirts' } }),
        prisma.category.create({ data: { name: 'Trousers', slug: 'trousers' } }),
        prisma.category.create({ data: { name: 'Outerwear', slug: 'outerwear' } }),
        prisma.category.create({ data: { name: 'Footwear', slug: 'footwear' } }),
        prisma.category.create({ data: { name: 'Suits', slug: 'suits' } }),
        prisma.category.create({ data: { name: 'T-Shirts', slug: 'tshirts' } }),
        prisma.category.create({ data: { name: 'Coats', slug: 'coats' } }),
    ]);
    console.log('  ✓ 7 categories created');
    const [foundation, forged, epoch] = await Promise.all([
        prisma.chapter.create({
            data: {
                name: 'Foundation',
                description: 'The timeless pieces that anchor every wardrobe. Precision-cut staples designed for quiet permanence.',
                image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=2000&auto=format&fit=crop',
            },
        }),
        prisma.chapter.create({
            data: {
                name: 'Forged Today',
                description: 'New arrivals forged with deliberate intention. Contemporary silhouettes that speak softly.',
                image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000&auto=format&fit=crop',
            },
        }),
        prisma.chapter.create({
            data: {
                name: 'Epoch',
                description: 'Limited-run pieces that define a moment. Once they are gone, they do not return.',
                image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2000&auto=format&fit=crop',
            },
        }),
    ]);
    console.log('  ✓ 3 chapters created');
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Graphite Overshirt',
                description: 'A structured overshirt in matte graphite cotton. Concealed button placket. Designed to layer without volume.',
                price: 4999,
                images: ['/images/clothes/Shirts/cmm24428_black_xl.webp'],
                stock: 35,
                categoryId: shirts.id,
                chapters: { connect: [{ id: foundation.id }, { id: forged.id }] },
            },
        }),
        prisma.product.create({
            data: {
                name: 'Charcoal Mandarin Shirt',
                description: 'Band collar. Minimal seams. Washed once for a lived-in softness that never wrinkles under pressure.',
                price: 3499,
                images: ['/images/clothes/Shirts/cmm25434_black_xl.webp'],
                stock: 42,
                categoryId: shirts.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Formal Navy Shirt',
                description: 'Pure European linen in a deep navy tone. Relaxed fit. The kind of shirt that speaks before you do.',
                price: 3999,
                images: ['/images/clothes/Shirts/6eb00b0b-0d6f-4242-803d-f3ec66a32ca81718972526500-DENNISON-Men-Navy-Blue-Comfort-Regular-Fit-Solid-Formal-Shir-1.jpg'],
                stock: 28,
                categoryId: shirts.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Architectural Grey Trouser',
                description: 'Wide-leg trouser in heavy grey cotton twill. Pleated front. Sits at the natural waist. Built for presence.',
                price: 5499,
                images: ['/images/clothes/Trousers/cmm17128_grey_xl.webp'],
                stock: 20,
                categoryId: trousers.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Charcoal Overcoat',
                description: 'Double-breasted overcoat in heavyweight charcoal wool-blend. Knee-length. The architecture of restraint.',
                price: 18990,
                images: ['/images/clothes/Jackets/cmm25223_charcoal_xl.webp'],
                stock: 12,
                categoryId: outerwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Ash Bomber Jacket',
                description: 'Minimal bomber in washed black nylon. Ribbed cuffs and hem. No logos, no excess.',
                price: 11490,
                images: ['/images/clothes/Jackets/bmm91526_black_xl.webp'],
                stock: 18,
                categoryId: outerwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Shadow Field Jacket',
                description: 'Four-pocket field jacket in brushed cotton. Hidden zippers. Designed for movement without compromise.',
                price: 8990,
                images: ['/images/clothes/Jackets/cmm28233_black_xl.webp'],
                stock: 15,
                categoryId: outerwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Obsidian Biker Jacket',
                description: 'Structured biker silhouette in obsidian faux-leather. Asymmetric zip. Designed to command.',
                price: 14300,
                images: ['/images/clothes/Jackets/cmm19047_black_xl.webp'],
                stock: 10,
                categoryId: outerwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Grey Technical Jacket',
                description: 'Lightweight technical shell in heather grey. Clean construction. Built for the city, not the mountain.',
                price: 9990,
                images: ['/images/clothes/Jackets/bmm10251_grey_xl.webp'],
                stock: 22,
                categoryId: outerwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Void Utility Jacket',
                description: 'Cropped utility jacket in void black. Oversized pockets. The quietest statement.',
                price: 10490,
                images: ['/images/clothes/Jackets/cmm27650_black_xl.webp'],
                stock: 14,
                categoryId: outerwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Structured Shell Jacket',
                description: 'Minimal shell jacket with architectural shoulders. Zero branding. Pure form.',
                price: 12490,
                images: ['/images/clothes/Jackets/cmm28234_black_xl.webp'],
                stock: 8,
                categoryId: outerwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Carbon Derby',
                description: 'Full-grain leather derby in deep carbon. Minimal stitching. Blake-stitched sole for a clean profile.',
                price: 9499,
                images: ['/images/clothes/Shoes/bmm40163_black_xl.webp'],
                stock: 22,
                categoryId: footwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Obsidian Oxford',
                description: 'Sleek Oxford in obsidian leather. Cap-toe construction. The shoe that requires no introduction.',
                price: 11490,
                images: ['/images/clothes/Shoes/cmm18272_black_xl.webp'],
                stock: 18,
                categoryId: footwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Navy Suede Loafer',
                description: 'Penny loafer in deep navy suede. Leather sole. For those who prefer to arrive quietly.',
                price: 8490,
                images: ['/images/clothes/Shoes/cmm18275_navy_xl.webp'],
                stock: 25,
                categoryId: footwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Matte Minimal Sneaker',
                description: 'Low-top in matte black leather. Tonal sole. Designed to disappear into any outfit.',
                price: 6999,
                images: ['/images/clothes/Shoes/cmm20242_black_xl_1.webp'],
                stock: 38,
                categoryId: footwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Shadow Chelsea Boot',
                description: 'Chelsea boot in shadow-toned leather. Elastic side panel. Every room quiets when you enter.',
                price: 9990,
                images: ['/images/clothes/Shoes/cmm22531_black_xl.webp'],
                stock: 16,
                categoryId: footwear.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Light Brown Two-Piece Suit',
                description: 'Tailored two-piece suit in warm light brown. Notch lapel. Single-button closure. Authority without effort.',
                price: 22990,
                images: ['/images/clothes/Suit/m5056441127092_light brown_xl.webp'],
                stock: 8,
                categoryId: suits.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Slate Grey Power Suit',
                description: 'Structured two-piece in slate grey wool-blend. Peak lapel. This is the suit that closes deals.',
                price: 24990,
                images: ['/images/clothes/Suit/m5056611947048_grey_xl.webp'],
                stock: 6,
                categoryId: suits.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Grey Slim Suit',
                description: 'Slim-fit suit in a refined grey herringbone. Contemporary lapel. Cut for the intentional man.',
                price: 19990,
                images: ['/images/clothes/Suit/m5056772578747_grey_xl.webp'],
                stock: 10,
                categoryId: suits.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Charcoal Evening Suit',
                description: 'Evening suit in deep charcoal. Satin lapel trim. The ritual of dressing well, perfected.',
                price: 26990,
                images: ['/images/clothes/Suit/m5059646314410_charcoal_xl.webp'],
                stock: 5,
                categoryId: suits.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Black Formal Suit',
                description: 'Classic black suit. Single-breasted. Two-button. The one suit you will always reach for.',
                price: 21990,
                images: ['/images/clothes/Suit/m5059646423853_black_xl_2.webp'],
                stock: 12,
                categoryId: suits.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Void Black Tee',
                description: 'Heavyweight cotton T-shirt in void black. No print, no logo. Presence through absence.',
                price: 1990,
                images: ['/images/clothes/Tshirts/cmm19350_black_xl.webp'],
                stock: 60,
                categoryId: tshirts.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Tobacco Washed Tee',
                description: 'Garment-washed in a rich tobacco tone. Relaxed fit. The kind of shirt you never take off.',
                price: 2290,
                images: ['/images/clothes/Tshirts/cmm25324_tobacco_xl.webp'],
                stock: 45,
                categoryId: tshirts.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'White Minimal Tee',
                description: 'Clean white in 220gsm cotton. Dropped shoulder. The white tee, done correctly.',
                price: 1790,
                images: ['/images/clothes/Tshirts/cmm25976_white_xl.webp'],
                stock: 55,
                categoryId: tshirts.id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Noir Longline Coat',
                description: 'Floor-grazing coat in matte black wool. Minimal lapel. This is not outerwear. This is armour.',
                price: 28990,
                images: ['/images/clothes/Coat/cmm14610_black_xl.webp'],
                stock: 7,
                categoryId: coats.id,
            },
        }),
    ]);
    console.log(`  ✓ ${products.length} products created`);
    for (let i = 0; i < products.length; i++) {
        const chapterId = [foundation.id, forged.id, epoch.id][i % 3];
        await prisma.product.update({
            where: { id: products[i].id },
            data: { chapters: { connect: [{ id: chapterId }] } },
        });
    }
    console.log(`  ✓ Products connected to chapters`);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ashenritual.com' },
        update: {},
        create: { email: 'admin@ashenritual.com', passwordHash: hash, role: 'ADMIN' },
    });
    console.log(`  ✓ Admin user: ${admin.email}`);
    const customerHash = await bcrypt.hash('customer123', salt);
    const customer = await prisma.user.upsert({
        where: { email: 'customer@ashenritual.com' },
        update: {},
        create: { email: 'customer@ashenritual.com', passwordHash: customerHash, role: 'USER' },
    });
    console.log(`  ✓ Demo customer: ${customer.email}`);
    console.log('\n✅ Seeding complete. The ritual begins.');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=seed.js.map