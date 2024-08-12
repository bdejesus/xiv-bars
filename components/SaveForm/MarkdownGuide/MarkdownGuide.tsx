import ReactMarkdown from 'react-markdown';

import styles from './MarkdownGuide.module.scss';

const headers = [
  {
    title: 'Heading level 1',
    markdown: '# Heading level 1'
  },
  {
    title: 'Heading level 2',
    markdown: '## Heading level 2'
  },
  {
    title: 'Heading level 3',
    markdown: '### Heading level 3'
  },
  {
    title: 'Heading level 4',
    markdown: '#### Heading level 4'
  },
  {
    title: 'Heading level 5',
    markdown: '##### Heading level 5'
  }
];

const textStyles = [
  {
    title: 'Bold text',
    markdown: 'Emphasize **bold** text.'
  },
  {
    title: 'Italicized text',
    markdown: 'Emphasize _italicized_ text.'
  },
  {
    title: 'Blockquote text',
    markdown: '> Lorem ipsum...'
  },
  {
    title: 'Inline code',
    markdown: 'This `code` is styled.'
  },
  {
    title: 'Code block',
    markdown: 'Sample macro:\n\n```\n/ac "Sprint"\n/wait 1\n/echo se.1\n```'
  }
];

const listStyles = [
  {
    title: 'Unordered list',
    markdown: '* List item 1\n* List item 2\n* List item 3'
  },
  {
    title: 'Ordered list',
    markdown: '1. List item 1\n1. List item 2\n1. List item 3'
  }
];

const other = [
  {
    title: 'Horizontal rule',
    markdown: 'Some text separated\n\n---\n\nby a horizontal rule'
  }
];

interface DisplayMarkdownProps {
  title: string,
  defs: {
    title: string,
    markdown: string
  }[]
}

function DisplayMarkdown({ title, defs }:DisplayMarkdownProps) {
  return (
    <div className={styles.section}>
      <h2>{title}</h2>

      <dl>
        { defs.map((def) => (
          <>
            <dt>{def.title}</dt>

            <dd>
              <div className={styles.markdown}>
                <div className={styles.label}>
                  Markdown
                </div>

                <pre>
                  { def.markdown }
                </pre>
              </div>

              <div className={styles.output}>
                <div className={styles.label}>
                  Output
                </div>

                <ReactMarkdown components={{
                  h1: 'h2', h2: 'h3', h3: 'h4', h4: 'h5', h5: 'h6', h6: 'p'
                }}
                >
                  { def.markdown }
                </ReactMarkdown>
              </div>
            </dd>
          </>
        )) }
      </dl>
    </div>
  );
}

export default function MarkdownGuide() {
  return (
    <div className={`${styles.container} markdown`}>
      <h1>Markdown Basic Syntax</h1>
      <div className={styles.sections}>
        <DisplayMarkdown title="Headers" defs={headers} />
        <DisplayMarkdown title="Text" defs={textStyles} />
        <DisplayMarkdown title="Lists" defs={listStyles} />
        <DisplayMarkdown title="Other Elements" defs={other} />
      </div>
    </div>
  );
}
