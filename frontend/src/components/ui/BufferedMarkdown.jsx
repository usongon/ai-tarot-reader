import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * 缓冲式 Markdown 渲染组件
 * 只有完整的行（以换行符结尾）才会被渲染为 Markdown
 * 未完成的行显示为原始文本，避免 Markdown 语法被拆分
 */
export function BufferedMarkdown({ content }) {
  if (!content) return null;

  // 按换行符分割内容
  // 最后一个元素可能是未完成的行
  const lines = content.split('\n');

  // 如果最后一个字符是换行符，说明所有行都完整
  const endsWithNewline = content.endsWith('\n');

  // 确定哪些行是完整的
  const completeLinesCount = endsWithNewline ? lines.length - 1 : lines.length - 1;
  const completeContent = lines.slice(0, completeLinesCount).join('\n');
  const incompleteLine = endsWithNewline ? '' : lines[lines.length - 1];

  return (
    <>
      {/* 渲染完整的行 */}
      {completeContent && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{completeContent}</ReactMarkdown>
      )}
      {/* 未完成的行显示为原始文本，保持换行 */}
      {incompleteLine && (
        <span className="whitespace-pre-wrap">{incompleteLine}</span>
      )}
    </>
  );
}
