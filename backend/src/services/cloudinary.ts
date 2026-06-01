import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 encoded receipt image to Cloudinary.
 * @param base64Image Base64-encoded receipt string (with or without data URI header)
 * @returns Secure HTTPS CDN URL of the uploaded image
 */
export async function uploadToCloudinary(base64Image: string): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn("[Cloudinary] Credentials not configured. Falling back to local/placeholder URL.");
    // In local sandbox or when keys aren't added yet, return a safe mock placeholder
    return `https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800&auto=format&fit=crop&q=60`;
  }

  try {
    // Add data URI prefix if not present (Cloudinary requires it)
    const fileStr = base64Image.startsWith("data:")
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;

    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "payment_receipts",
      resource_type: "auto",
    });

    console.log("[Cloudinary] Upload successful:", uploadResponse.secure_url);
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("[Cloudinary] Upload failed:", error);
    throw new Error("Failed to upload document to Cloudinary");
  }
}
