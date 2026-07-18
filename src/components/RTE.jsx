import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Controller } from 'react-hook-form';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link2, Image as ImageIcon, Table as TableIcon, Undo, Redo } from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const btnClass = (isActive) => `p-1.5 rounded-md transition-colors ${isActive ? 'bg-[var(--color-border-light)] text-[var(--color-primary-text)]' : 'text-[var(--color-secondary-text)] hover:bg-[var(--color-secondary-bg)] hover:text-[var(--color-primary-text)]'}`;

  return (
    <div className="flex flex-wrap items-center gap-1 mb-6 p-1.5 border border-[var(--color-border-light)] rounded-[14px] bg-white/50 backdrop-blur-sm sticky top-24 z-10 w-max shadow-sm">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Bold">
        <Bold className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italic">
        <Italic className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="Underline">
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-[var(--color-border-light)] mx-1" />
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Align left">
        <AlignLeft className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Align center">
        <AlignCenter className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="Align right">
        <AlignRight className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-[var(--color-border-light)] mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Bullet list">
        <List className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Numbered list">
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-[var(--color-border-light)] mx-1" />
      <button type="button" onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);
          if (url === null) return;
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={btnClass(editor.isActive('link'))} title="Link"
      >
        <Link2 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => {
          const url = window.prompt('Enter the URL of the image:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className={btnClass(false)} title="Image"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={btnClass(false)} title="Insert table">
        <TableIcon className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-[var(--color-border-light)] mx-1" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={`${btnClass(false)} disabled:opacity-30`} title="Undo">
        <Undo className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={`${btnClass(false)} disabled:opacity-30`} title="Redo">
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RTE({ name, control, label, defaultValue = "" }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-8 border border-[var(--color-border-light)] shadow-sm',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--color-accent-primary)] underline decoration-1 underline-offset-2',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-[var(--color-border-light)] my-8 rounded-lg overflow-hidden',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: defaultValue,
    editorProps: {
        attributes: {
            class: 'prose prose-lg md:prose-xl focus:outline-none min-h-[50vh] text-[var(--color-primary-text)] font-body font-light leading-relaxed max-w-none',
        },
    }
  });

  return (
    <div className='w-full'>
      {label && <label className='hidden'>{label}</label>}
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange, value } }) => {
          useEffect(() => {
            if (editor && value !== editor.getHTML()) {
              editor.commands.setContent(value || defaultValue);
            }
          }, [value, editor]);

          useEffect(() => {
            if (!editor) return;
            const handleUpdate = () => {
              onChange(editor.getHTML());
            };
            editor.on('update', handleUpdate);
            return () => {
              editor.off('update', handleUpdate);
            };
          }, [editor, onChange]);

          return (
            <div className="w-full pb-32">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          );
        }}
      />
    </div>
  );
}