import Link from 'next/link';
import { PayloadImage } from '@/components/ui/PayloadImage';
import { Fragment } from 'react';

export function RichText({ content, className = '' }) {
  if (!content?.root?.children?.length) return null;

  return (
    <div className={className}>
      {content.root.children.map((node, index) => (
        <RichTextNode key={index} node={node} />
      ))}
    </div>
  );
}

function RichTextNode({ node }) {
  if (!node) return null;

  if (node.type === 'paragraph') {
    return (
      <p className="mb-4 leading-7 text-zinc-700">
        {renderChildren(node.children)}
      </p>
    );
  }

  if (node.type === 'heading') {
    const Tag = node.tag || 'h2';
    return (
      <Tag className="mb-4 mt-8 font-bold text-zinc-900">
        {renderChildren(node.children)}
      </Tag>
    );
  }

  if (node.type === 'list') {
    const Tag = node.listType === 'number' ? 'ol' : 'ul';
    return (
      <Tag className="mb-4 list-inside list-disc space-y-2 text-zinc-700">
        {renderChildren(node.children)}
      </Tag>
    );
  }

  if (node.type === 'listitem') {
    return <li>{renderChildren(node.children)}</li>;
  }

  if (node.type === 'quote') {
    return (
      <blockquote className="mb-4 border-l-4 border-zinc-300 pl-4 italic">
        {renderChildren(node.children)}
      </blockquote>
    );
  }

  if (node.type === 'link') {
    const href = node.fields?.url ?? node.url ?? '#';
    return <Link href={href}>{renderChildren(node.children)}</Link>;
  }

  if (node.type === 'upload' && node.value) {
    return (
      <div className="my-6">
        <PayloadImage
          media={node.value}
          width={1200}
          height={800}
          className="rounded-xl"
        />
      </div>
    );
  }

  if (typeof node.text === 'string') return node.text;

  return renderChildren(node.children);
}

function renderChildren(children = []) {
  return children.map((child, index) => (
    <Fragment key={index}>
      <RichTextNode node={child} />
    </Fragment>
  ));
}
