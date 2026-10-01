// Tiny inline markup for editable copy (tournament description, news):
//   **mots**  → bold
//   [mots]    → link (the target URL is chosen by the component)
// Everything else is plain text, so the copy stays safe to render.

export type Segment = { text: string; bold: boolean; link: boolean };

export function parseRichText(input: string): Segment[] {
  const segments: Segment[] = [];
  let bold = false;
  let link = false;
  let buffer = '';
  const flush = () => {
    if (buffer) segments.push({ text: buffer, bold, link });
    buffer = '';
  };
  for (let i = 0; i < input.length; i++) {
    if (input.startsWith('**', i)) {
      flush();
      bold = !bold;
      i++;
    } else if (input[i] === '[' || input[i] === ']') {
      flush();
      link = input[i] === '[';
    } else {
      buffer += input[i];
    }
  }
  flush();
  return segments;
}

/** Same text without the markup (for meta descriptions and structured data). */
export function plainText(input: string): string {
  return input.replace(/\*\*|\[|\]/g, '');
}
