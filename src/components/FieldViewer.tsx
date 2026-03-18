import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import Link from '@tiptap/extension-link';
import { memo, useEffect } from 'react';

interface FieldViewerProps {
  content?: string;
}

export const FieldViewer = memo(({ content }: FieldViewerProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
    ],
    content: content || '',
    editable: false,
    immediatelyRender: true,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content || '', {
        contentType: 'markdown',
      });
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="w-full text-[1.6rem] font-semibold text-black-100">
      <EditorContent editor={editor} className="prose-list min-h-[5rem]" />
    </div>
  );
});

FieldViewer.displayName = 'FieldViewer';
