import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-bold text-zinc-900">404</h1>
      <h2 className="text-2xl font-semibold tracking-tight text-white mt-4">
        Page not found
      </h2>
      <p className="text-zinc-500 mt-3 max-w-sm text-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4 mt-8">
        <Button href="/">Back to home</Button>
        <Button href="/products" variant="outline">
          Browse products
        </Button>
      </div>
    </div>
  );
}
