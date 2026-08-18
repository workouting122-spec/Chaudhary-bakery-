import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export default function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: "prose prose-sm max-w-none min-h-[120px] focus:outline-none" } },
  });

  // Keep external resets (e.g. loading an existing product) in sync.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;
  const Btn = ({ on, active, children }: { on: () => void; active: boolean; children: ReactNode }) => (
    <button type="button" onClick={on} className={`rounded p-1.5 ${active ? "bg-brand text-cream-50" : "hover:bg-cream-200"}`}>{children}</button>
  );

  return (
    <div className="rounded-xl border border-ink/15 bg-cream-50">
      <div className="flex gap-1 border-b border-ink/10 p-1.5">
        <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold size={15} /></Btn>
        <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic size={15} /></Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 size={15} /></Btn>
        <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List size={15} /></Btn>
        <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered size={15} /></Btn>
      </div>
      <div className="px-3 py-2"><EditorContent editor={editor} /></div>
    </div>
  );
}
