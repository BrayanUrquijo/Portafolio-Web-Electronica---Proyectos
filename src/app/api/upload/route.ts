import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isImage(mimeType: string) {
  return mimeType.startsWith("image/");
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

  const hasCloudinary =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinary) {
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
          filename: result.original_filename,
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
