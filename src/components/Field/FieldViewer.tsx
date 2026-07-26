import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import Link from '@tiptap/extension-link';
import { memo, useEffect } from 'react';
import { MarkdownImage } from './markdownExtensions';

interface FieldViewerProps {
  content?: string;
}

export const FieldViewer = memo(({ content }: FieldViewerProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      MarkdownImage,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: content || '',
    contentType: 'markdown',
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
    <div className="w-full text-[1.6rem] font-normal text-black-100">
      <EditorContent editor={editor} className="prose-list min-h-[5rem]" />
    </div>
  );
});

FieldViewer.displayName = 'FieldViewer';
