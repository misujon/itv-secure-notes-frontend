"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeEditorContent } from "@/lib/utils/html";

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder = "Write your content here...",
  disabled = false,
  invalid = false,
  describedBy,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: normalizeEditorContent(value),
    editable: !disabled,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
        "aria-invalid": invalid ? "true" : "false",
        class:
          "rich-text-content min-h-[240px] px-3.5 py-3 text-sm leading-relaxed text-foreground focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.isEmpty ? "" : instance.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    const normalized = normalizeEditorContent(value);
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (normalized !== current && (normalized === "" || !editor.isFocused)) {
      editor.commands.setContent(normalized, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-card transition-colors focus-within:ring-2",
        invalid
          ? "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
          : "border-input focus-within:border-ring focus-within:ring-ring/20",
        disabled && "opacity-60",
      )}
    >
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5"
      >
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold")}
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic")}
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-3.5" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          active={editor?.isActive("strike")}
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-3.5" aria-hidden="true" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

        <ToolbarButton
          label="Heading 2"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={disabled || !editor}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="size-3.5" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor?.isActive("heading", { level: 3 })}
          disabled={disabled || !editor}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="size-3.5" aria-hidden="true" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

        <ToolbarButton
          label="Bullet list"
          active={editor?.isActive("bulletList")}
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="size-3.5" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor?.isActive("orderedList")}
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-3.5" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Blockquote"
          active={editor?.isActive("blockquote")}
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-3.5" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Code block"
          active={editor?.isActive("codeBlock")}
          disabled={disabled || !editor}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="size-3.5" aria-hidden="true" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

        <ToolbarButton
          label="Undo"
          disabled={disabled || !editor || !editor.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 className="size-3.5" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={disabled || !editor || !editor.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 className="size-3.5" aria-hidden="true" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
