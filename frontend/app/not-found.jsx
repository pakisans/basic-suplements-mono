import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-bold text-zinc-900">404</h1>
      <h2 className="text-2xl font-semibold tracking-tight text-white mt-4">
        Stranica nije pronađena
      </h2>
      <p className="text-zinc-500 mt-3 max-w-sm text-sm">
        Stranica koju tražite ne postoji ili je premestena.
      </p>
      <div className="flex gap-4 mt-8">
        <Button href="/">Idi na početnu</Button>
        <Button href="/proizvodi" variant="outline">
          Pogledaj proizvode
        </Button>
      </div>
    </div>
  );
}
