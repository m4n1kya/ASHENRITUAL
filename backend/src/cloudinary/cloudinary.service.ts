import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    // These should ideally come from ConfigService in a real app,
    // but we can set them directly for now if they exist in env.
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  generateSignature(folder: string) {
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new InternalServerErrorException(
        'Cloudinary credentials not configured',
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Enforce folder structure as per Phase 2 requirements
    const allowedFolders = [
      'avatars',
      'banners',
      'concepts',
      'collections',
      'products',
      'showrooms',
      'logos',
      'gallery',
    ];
    const safeFolder = allowedFolders.includes(folder) ? folder : 'misc';

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: safeFolder,
      },
      process.env.CLOUDINARY_API_SECRET,
    );

    return {
      timestamp,
      signature,
      folder: safeFolder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    };
  }
}
