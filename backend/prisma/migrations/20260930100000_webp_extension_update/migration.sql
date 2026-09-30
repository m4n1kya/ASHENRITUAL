-- Update Chapter
UPDATE "Chapter" SET "image" = REPLACE("image", '.jpg', '.webp') WHERE "image" LIKE '%.jpg';
UPDATE "Chapter" SET "image" = REPLACE("image", '.jpeg', '.webp') WHERE "image" LIKE '%.jpeg';
UPDATE "Chapter" SET "image" = REPLACE("image", '.png', '.webp') WHERE "image" LIKE '%.png';

-- Update Product images array
UPDATE "Product" 
SET "images" = (
  SELECT array_agg(REPLACE(REPLACE(REPLACE(elem, '.jpg', '.webp'), '.jpeg', '.webp'), '.png', '.webp'))
  FROM unnest("images") AS elem
);
