const STRUCTURAL_LINE_PATTERN = /^(?:#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```|---$)/;

export const serializePostContent = (markdown: string) =>
  markdown.replace(/\\\n/g, '\n');

export const parsePostContent = (markdown: string) => {
  const lines = markdown.split('\n');

  return lines.reduce((result, line, index) => {
    if (index === lines.length - 1) return result + line;

    const nextLine = lines[index + 1];
    const isBlankLine = line === '' || nextLine === '';
    const isStructuralBreak = STRUCTURAL_LINE_PATTERN.test(nextLine);
    const lineBreak = isBlankLine || isStructuralBreak ? '\n' : '\\\n';

    return result + line + lineBreak;
  }, '');
};
