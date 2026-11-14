import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const MAX_UPLOAD_SIZE = 15 * 1024 * 1024; // 15 MB

export interface ProcessedImageResult {
  url: string;
  fileName: string;
  originalSize: number;
  finalSize: number;
  width: number;
  height: number;
  mimeType: "image/webp";
}

/**
 * Validates real magic bytes signature of the buffer
 */
export function validateImageSignature(buffer: Buffer): { valid: boolean; detectedFormat?: string } {
  if (!buffer || buffer.length < 12) {
    return { valid: false };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedFormat: "jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedFormat: "png" };
  }

  // WEBP: RIFF....WEBP
  const riff = buffer.subarray(0, 4).toString("ascii");
  const webp = buffer.subarray(8, 12).toString("ascii");
  if (riff === "RIFF" && webp === "WEBP") {
    return { valid: true, detectedFormat: "webp" };
  }

  // HEIC / HEIF / AVIF: ftyp box
  const ftyp = buffer.subarray(4, 8).toString("ascii");
  if (ftyp === "ftyp") {
    const brand = buffer.subarray(8, 12).toString("ascii").toLowerCase();
    if (
      brand.includes("hei") ||
      brand.includes("mif") ||
      brand.includes("msf") ||
      brand.includes("hev") ||
      brand.includes("avi")
    ) {
      return { valid: true, detectedFormat: "heic" };
    }
  }

  return { valid: false };
}

/**
 * Sanitizes a title/string for use in filenames
 */
export function sanitizeSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "martita"
  );
}

/**
 * Processes, auto-rotates, resizes, and converts image to WebP format
 */
export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string,
  title?: string
): Promise<ProcessedImageResult> {
  const originalSize = buffer.length;

  if (originalSize > MAX_UPLOAD_SIZE) {
    throw new Error(
      `Arquivo excede o limite máximo de 15 MB (${(originalSize / (1024 * 1024)).toFixed(1)} MB).`
    );
  }

  const signature = validateImageSignature(buffer);
  if (!signature.valid) {
    throw new Error(
      "Formato ou conteúdo de arquivo inválido. Envie uma imagem válida nos formatos JPG, PNG, WEBP ou HEIC."
    );
  }

  // Process with Sharp
  // 1. auto-rotate EXIF
  // 2. resize inside 2560x2560 without enlargement
  // 3. convert to webp quality 82, effort 5
  const transformer = sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({
      width: 2560,
      height: 2560,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
      effort: 5,
    });

  const finalBuffer = await transformer.toBuffer();
  const metadata = await sharp(finalBuffer).metadata();

  const finalWidth = metadata.width || 0;
  const finalHeight = metadata.height || 0;
  const finalSize = finalBuffer.length;

  // Generate safe unique filename
  const prefix = title ? sanitizeSlug(title) : sanitizeSlug(path.parse(originalFilename).name);
  const randomSuffix = crypto.randomBytes(6).toString("hex");
  const fileName = `${prefix}-${Date.now()}-${randomSuffix}.webp`;

  // Destination folder: public/uploads/gallery
  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, finalBuffer);

  return {
    url: `/uploads/gallery/${fileName}`,
    fileName,
    originalSize,
    finalSize,
    width: finalWidth,
    height: finalHeight,
    mimeType: "image/webp",
  };
}

/**
 * Safely deletes an image from disk if it is in /uploads/gallery/
 */
export async function deleteUploadedImage(urlOrPath: string | null | undefined): Promise<boolean> {
  if (!urlOrPath) return false;
  if (!urlOrPath.startsWith("/uploads/gallery/")) return false;

  const fileName = path.basename(urlOrPath);
  // Ensure we do not allow directory traversal
  if (!fileName || fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return false;
  }

  const filePath = path.join(process.cwd(), "public", "uploads", "gallery", fileName);
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.warn("Could not delete image file:", filePath, error);
    }
    return false;
  }
}
