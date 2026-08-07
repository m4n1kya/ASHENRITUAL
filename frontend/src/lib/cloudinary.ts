import { api } from './api';

export async function uploadToCloudinary(file: File, folder: string = 'misc'): Promise<string> {
  try {
    // 1. Get signature from our backend
    const signData = await api.get<{
      timestamp: number;
      signature: string;
      folder: string;
      cloudName: string;
      apiKey: string;
    }>(`/cloudinary/signature?folder=${folder}`);

    // 2. Prepare form data for Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signData.apiKey);
    formData.append('timestamp', signData.timestamp.toString());
    formData.append('signature', signData.signature);
    formData.append('folder', signData.folder);

    // 3. Upload directly to Cloudinary
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}
