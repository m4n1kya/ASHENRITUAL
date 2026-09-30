-- Update Chapter
UPDATE "Chapter" SET "image" = REPLACE("image", '.jpg', '.webp') WHERE "image" LIKE '%.jpg';
UPDATE "Chapter" SET "image" = REPLACE("image", '.jpeg', '.webp') WHERE "image" LIKE '%.jpeg';
UPDATE "Chapter" SET "image" = REPLACE("image", '.png', '.webp') WHERE "image" LIKE '%.png';

-- Update Concept
UPDATE "Concept" SET "coverImage" = REPLACE("coverImage", '.jpg', '.webp') WHERE "coverImage" LIKE '%.jpg';
UPDATE "Concept" SET "coverImage" = REPLACE("coverImage", '.jpeg', '.webp') WHERE "coverImage" LIKE '%.jpeg';
UPDATE "Concept" SET "coverImage" = REPLACE("coverImage", '.png', '.webp') WHERE "coverImage" LIKE '%.png';

-- Update Showroom
UPDATE "Showroom" SET "coverImage" = REPLACE("coverImage", '.jpg', '.webp') WHERE "coverImage" LIKE '%.jpg';
UPDATE "Showroom" SET "coverImage" = REPLACE("coverImage", '.jpeg', '.webp') WHERE "coverImage" LIKE '%.jpeg';
UPDATE "Showroom" SET "coverImage" = REPLACE("coverImage", '.png', '.webp') WHERE "coverImage" LIKE '%.png';

-- Update Category
UPDATE "Category" SET "image" = REPLACE("image", '.jpg', '.webp') WHERE "image" LIKE '%.jpg';
UPDATE "Category" SET "image" = REPLACE("image", '.jpeg', '.webp') WHERE "image" LIKE '%.jpeg';
UPDATE "Category" SET "image" = REPLACE("image", '.png', '.webp') WHERE "image" LIKE '%.png';

-- Update Product images array
UPDATE "Product" 
SET "images" = (
  SELECT array_agg(REPLACE(REPLACE(REPLACE(elem, '.jpg', '.webp'), '.jpeg', '.webp'), '.png', '.webp'))
  FROM unnest("images") AS elem
);
