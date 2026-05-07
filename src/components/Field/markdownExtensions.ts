import { mergeAttributes, Node } from '@tiptap/core';
import type { JSONContent, MarkdownToken } from '@tiptap/core';

const escapeMarkdownText = (value = '') =>
  value.replace(/\\/g, '\\\\').replace(/]/g, '\\]');

const escapeMarkdownTitle = (value = '') => value.replace(/"/g, '\\"');

const isAllowedImageSrc = (src: unknown): src is string => {
  if (typeof src !== 'string') return false;

  return /^(https?:\/\/|data:image\/(?:png|jpeg|jpg|webp|gif);base64,)/i.test(
    src,
  );
};

export const MarkdownImage = Node.create({
  name: 'image',

  inline: true,
  group: 'inline',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'img[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const src = isAllowedImageSrc(HTMLAttributes.src) ? HTMLAttributes.src : '';

    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        src,
        class:
          'my-[1.2rem] inline-block max-h-[36rem] max-w-full rounded-[0.8rem] object-contain align-middle',
      }),
    ];
  },

  markdownTokenName: 'image',

  parseMarkdown: (token: MarkdownToken) => {
    return {
      type: 'image',
      attrs: {
        src: isAllowedImageSrc(token.href) ? token.href : '',
        alt: token.text || null,
        title: token.title || null,
      },
    };
  },

  renderMarkdown: (node: JSONContent) => {
    const src = node.attrs?.src ?? '';
    const alt = escapeMarkdownText(node.attrs?.alt ?? '');
    const title = node.attrs?.title
      ? ` "${escapeMarkdownTitle(node.attrs.title)}"`
      : '';

    return `![${alt}](${src}${title})`;
  },
});
