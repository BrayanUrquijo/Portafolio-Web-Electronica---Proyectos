"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "w-8 h-8 rounded flex items-center justify-center text-sm transition-colors",
        active
          ? "bg-neon-cyan/20 text-neon-cyan"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Escribe aquí...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-neon-cyan underline" } }),
      Placeholder.configure({ placeholder }),
      Youtube.configure({ HTMLAttributes: { class: "rounded-lg w-full aspect-video" } }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none " +
          "prose-headings:font-[family-name:var(--font-orbitron)] prose-headings:text-text-primary " +
          "prose-p:text-text-secondary prose-a:text-neon-cyan prose-strong:text-text-primary " +
          "prose-img:rounded-lg prose-img:max-w-full",
      },
    },
  });

  if (!editor) return null;

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !editor) return;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success && data.data?.url) {
          editor.chain().focus().setImage({ src: data.data.url, alt: file.name }).run();
        }
      } catch {
        // Fallback: insert as base64 for local preview
        const reader = new FileReader();
        reader.onload = () => {
          editor.chain().focus().setImage({ src: reader.result as string, alt: file.name }).run();
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = "";
  }

  function insertLink() {
    const url = prompt("URL del enlace:");
    if (!url) return;

    const { from, to } = editor.state.selection;
    if (from === to) {
      const text = prompt("Texto del enlace:", url);
      if (!text) return;
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text,
          marks: [{ type: "link", attrs: { href: url } }],
        })
        .run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  function insertYoutube() {
    const url = prompt("URL del video de YouTube:");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  }

  return (
    <div className="rounded-lg border border-surface-border bg-surface-secondary overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-surface-border bg-surface-card">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Negrita"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Cursiva"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Tachado"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="w-px h-5 bg-surface-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Título"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Subtítulo"
        >
          H3
        </ToolbarButton>

        <div className="w-px h-5 bg-surface-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista"
        >
          •
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          1.
        </ToolbarButton>

        <div className="w-px h-5 bg-surface-border mx-1" />

        <ToolbarButton onClick={insertLink} active={editor.isActive("link")} title="Enlace">
          🔗
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Insertar imagen">
          📷
        </ToolbarButton>
        <ToolbarButton onClick={insertYoutube} title="Video de YouTube">
          ▶
        </ToolbarButton>

        <div className="w-px h-5 bg-surface-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Cita"
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Línea divisora"
        >
          —
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
