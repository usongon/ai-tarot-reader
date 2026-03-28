import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

/**
 * 预处理 Markdown 文本：
 * 1. 在列表项（* - 或 数字.）前插入空行，确保 Markdown 解析器识别列表
 * 2. 在标题行（# 开头）前插入空行
 */
export function normalizeMarkdown(text) {
  if (!text) return text;
  // 将行内出现的列表标记拆到新行（仅在句末标点后触发，避免误伤正常数字）
  const sentEnd = /[。！？；：）”」』…]/;
  text = text.replace(new RegExp(`(${sentEnd.source})\\s*\\* `, 'g'), '$1\n* ');
  text = text.replace(new RegExp(`(${sentEnd.source})\\s*(\\d+)\\. `, 'g'), '$1\n$2. ');
  text = text.replace(new RegExp(`(${sentEnd.source})\\s*- `, 'g'), '$1\n- ');
  const listOrHeading = /^\s*(?:[*\-] |\d+\. |#{1,6}\s)/;
  const lines = text.split('\n');
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = result.length > 0 ? result[result.length - 1] : '';
    // 当前行是列表/标题，且前一行不是空行也不是同类项，插入空行
    if (listOrHeading.test(line) && prevLine.trim() !== '' && !listOrHeading.test(prevLine)) {
      result.push('');
    }
    result.push(line);
  }
  return result.join('\n');
}

/**
 * 缓冲式 Markdown 渲染组件
 * 只有完整的行（以换行符结尾）才会被渲染为 Markdown
 * 未完成的行显示为原始文本，避免 Markdown 语法被拆分
 */
export function BufferedMarkdown({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const endsWithNewline = content.endsWith('\n');
  const completeLinesCount = lines.length - 1;
  const completeContent = normalizeMarkdown(lines.slice(0, completeLinesCount).join('\n'));
  const incompleteLine = endsWithNewline ? '' : lines[lines.length - 1];

  return (
    <>
      {completeContent && (
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{completeContent}</ReactMarkdown>
      )}
      {incompleteLine && (
        <span className="whitespace-pre-wrap">{incompleteLine}</span>
      )}
    </>
  );
}
