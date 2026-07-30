"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const deleted = await prisma.chapter.deleteMany({
        where: { slug: null }
    });
    console.log(`🗑  Deleted ${deleted.count} old chapter(s) without slug.`);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=cleanup-old-chapters.js.map