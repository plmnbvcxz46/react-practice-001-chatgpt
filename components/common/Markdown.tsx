import { memo } from 'react';
import ReactMarkdown, { type Options as ReactMarkdownOptions } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type MarkdownProps = ReactMarkdownOptions & {
  className?: string;
};

const Markdown = ({
  className = '',
  components,
  remarkPlugins,
  ...rest
}: MarkdownProps) => {
  const defaultCodeRenderer = ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className ?? '');
    const language = match?.[1] ?? 'plaintext';
    const code = String(children).replace(/\n$/, '');

    if (!inline) {
      return (
        <SyntaxHighlighter
          style={a11yDark as any}
          language={language}
          PreTag="div"
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  const mergedComponents = {
    code: defaultCodeRenderer,
    ...(components ?? undefined),
  };

  const normalizedRemarkPlugins = Array.isArray(remarkPlugins)
    ? remarkPlugins
    : remarkPlugins
    ? [remarkPlugins]
    : [];

  const mergedRemarkPlugins = [remarkGfm, ...normalizedRemarkPlugins];

  const wrapperClassName = ['markdown prose dark:prose-invert', className]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div className={wrapperClassName}>
      <ReactMarkdown
        components={mergedComponents}
        remarkPlugins={mergedRemarkPlugins}
        {...rest}
      />
    </div>
  );
};

export default memo(Markdown);