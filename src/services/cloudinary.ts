import cloudinary from "../lib/cloudinary";

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export async function uploadToCloudinary(
  file: File,
): Promise<CloudinaryUploadResult> {
  // Validate file size (max 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image size must be less than 5MB");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  const dataURL = `data:${file.type};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataURL, {
      folder: "tech-blog",
      transformation: [{ format: "webp" }],
      timeout: 120000, // 2 minutes timeout
      resource_type: "auto",
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
}
