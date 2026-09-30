import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import os from "os";
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

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const raw = isRawFile(file.type, file.name);

      if (raw) {
        const tmpPath = path.join(os.tmpdir(), `upload-${uuid()}-${file.name}`);
        await fs.writeFile(tmpPath, buffer);

        try {
          const result = await cloudinary.uploader.upload(tmpPath, {
            folder: "portafolio",
            resource_type: "raw",
            public_id: file.name.replace(/\.[^.]+$/, ""),
            format: file.name.split(".").pop(),
          });

          return NextResponse.json({
            success: true,
            data: {
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              filename: file.name,
              resourceType: "raw",
            },
          });
        } finally {
          await fs.unlink(tmpPath).catch(() => {});
        }
      }

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
      console.error("Cloudinary upload error:", error);
      return NextResponse.json(
        { success: false, error: "Error al subir archivo" },
        { status: 500 }
      );
    }
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      { success: false, error: "Cloudinary no está configurado. Agrega las variables NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en Vercel." },
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
