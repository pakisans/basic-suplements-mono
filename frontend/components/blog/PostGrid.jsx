import { PostCard } from './PostCard';

export function PostGrid({ posts, columns = 3, className = '' }) {
  if (!posts?.length) return null;

  const classes = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      className={`grid gap-6 ${classes[columns] ?? classes[3]} ${className}`}
    >
      {posts.map((post, i) => (
        <PostCard key={post.id} post={post} priority={i < 3} />
      ))}
    </div>
  );
}
