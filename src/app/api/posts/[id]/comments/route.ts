import { NextRequest, NextResponse } from "next/server";
import { getComments, addComment, deleteComment } from "@/lib/data/comments";
import { v4 as uuid } from "uuid";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await getComments(id);
  return NextResponse.json({ success: true, data: comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, text } = await request.json();

  if (!text?.trim()) {
    return NextResponse.json(
      { success: false, error: "El comentario no puede estar vacío" },
      { status: 400 }
    );
  }

  const comment = {
    id: uuid(),
    name: name?.trim() || "Anónimo",
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  const comments = await addComment(id, comment);
  return NextResponse.json({ success: true, data: comments }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { commentId } = await request.json();
  const comments = await deleteComment(id, commentId);
  return NextResponse.json({ success: true, data: comments });
}
