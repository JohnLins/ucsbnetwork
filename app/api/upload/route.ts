import { NextResponse } from "next/server";

import { getSupabaseServiceClient } from "@/lib/supabase/service";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const BUCKET = "application-uploads";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, PNG, and JPG files are accepted." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be 10 MB or smaller." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Storage is not configured." },
        { status: 500 }
      );
    }

    // Generate a unique filename: timestamp-randomhex-originalname
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).slice(2, 10);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${timestamp}-${randomHex}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Unable to upload file. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      path: storagePath,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Unable to process upload." },
      { status: 500 }
    );
  }
}
