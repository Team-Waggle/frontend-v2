export const normalizePastedText = (text: string) =>
  text
    .normalize('NFKC')
    .replace(/[\u2018\u2019\u02BC\uFF07]/g, "'")
    .replace(/\r\n?/g, '\n');
