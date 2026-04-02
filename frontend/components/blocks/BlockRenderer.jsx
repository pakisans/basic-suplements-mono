import { BannerBlock } from './BannerBlock';
import { CallToActionBlock } from './CallToActionBlock';
import { ContentBlock } from './ContentBlock';
import { MediaBlockComponent } from './MediaBlockComponent';
import { CarouselBlock } from './CarouselBlock';
import { ThreeItemGridBlock } from './ThreeItemGridBlock';
import { ArchiveBlock } from './ArchiveBlock';
import { QuoteBlock } from './QuoteBlock';
import { FAQBlock } from './FAQBlock';
import { StatsBlock } from './StatsBlock';
import { VideoBlock } from './VideoBlock';
import { SpacerBlock } from './SpacerBlock';

export function BlockRenderer({ blocks, className = '' }) {
  if (!blocks?.length) return null;

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <div key={block.id ?? index} className="mb-12 last:mb-0">
          <BlockItem block={block} />
        </div>
      ))}
    </div>
  );
}

function BlockItem({ block }) {
  switch (block.blockType) {
    case 'banner':
      return <BannerBlock block={block} />;
    case 'cta':
    case 'callToAction':
      return <CallToActionBlock block={block} />;
    case 'content':
      return <ContentBlock block={block} />;
    case 'mediaBlock':
    case 'media':
      return <MediaBlockComponent block={block} />;
    case 'carousel':
      return <CarouselBlock block={block} />;
    case 'threeItemGrid':
      return <ThreeItemGridBlock block={block} />;
    case 'archive':
      return <ArchiveBlock block={block} />;
    case 'quote':
      return <QuoteBlock block={block} />;
    case 'faq':
      return <FAQBlock block={block} />;
    case 'stats':
      return <StatsBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} />;
    case 'spacer':
      return <SpacerBlock block={block} />;
    default:
      return null;
  }
}
