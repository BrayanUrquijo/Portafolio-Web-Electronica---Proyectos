import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isImage(mimeType: string) {
  return mimeType.startsWith("image/");
}

function isVideo(mimeType: string) {
  return mimeType.startsWith("video/");
}

function isRawFile(mimeType: string, fileName: string) {
  return (
    mimeType === "application/pdf" ||
    mimeType === "text/markdown" ||
    mimeType === "text/x-markdown" ||
    fileName.endsWith(".md") ||
    fileName.endsWith(".pdf") ||
    (!isImage(mimeType) && !isVideo(mimeType))
  );
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const raw = isRawFile(file.type, file.name);

  if (raw && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`uploads/${file.name}`, buffer, {
        access: "private",
        addRandomSuffix: true,
      });

      return NextResponse.json({
        success: true,
        data: {
          url: blob.downloadUrl,
          publicId: blob.pathname,
          format: file.name.split(".").pop() || "",
          filename: file.name,
          resourceType: "raw",
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Blob upload error:", message);
      return NextResponse.json(
        { success: false, error: `Error al subir archivo: ${message}` },
        { status: 500 }
      );
    }
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      const uploadOptions: Record<string, unknown> = {
        folder: "portafolio",
        resource_type: "auto",
      };

      if (isImage(file.type)) {
        uploadOptions.format = "webp";
        uploadOptions.quality = "auto";
      }

      const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

      return NextResponse.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          filename: file.name,
          resourceType: result.resource_type,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Cloudinary upload error:", message, error);
      return NextResponse.json(
        { success: false, error: `Error al subir archivo: ${message}` },
        { status: 500 }
      );
    }
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      { success: false, error: "Storage no configurado. Verifica BLOB_READ_WRITE_TOKEN y las variables de Cloudinary en Vercel." },
      { status: 500 }
    );
  }

  const ext = file.name.split(".").pop() || "bin";
  const filename = `${uuid()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({
    success: true,
    data: { url: `/uploads/${filename}`, filename },
  });
}
