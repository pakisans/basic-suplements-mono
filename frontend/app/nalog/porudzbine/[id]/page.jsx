'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { getOrderById } from '@/services/orders';
import { CURRENCY, ROUTES } from '@/constants';

const STATUS_LABEL = {
  processing: 'U obradi',
  completed: 'Završena',
  cancelled: 'Otkazana',
  refunded: 'Refundirana',
};

const STATUS_CLASS = {
  processing: 'bg-amber-950/60 text-amber-400 border border-amber-900/40',
  completed: 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40',
  cancelled: 'bg-red-950/60 text-red-400 border border-red-900/40',
  refunded: 'bg-zinc-900 text-zinc-400 border border-zinc-800',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const accessToken = searchParams.get('accessToken');

  const [order, setOrder] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (loading) return;
    // Must be logged in OR have accessToken to view
    if (!user && !accessToken) {
      router.replace(ROUTES.login);
      return;
    }

    getOrderById(id, { token: token ?? null, accessToken: accessToken ?? null })
      .then((data) => {
        if (!data) setNotFound(true);
        else setOrder(data);
      })
      .finally(() => setFetching(false));
  }, [id, loading, user, token, accessToken, router]);

  if (loading || fetching) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-sm text-zinc-500">Učitavanje...</div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-zinc-400">Porudžbina nije pronađena.</p>
        <Link
          href={user ? ROUTES.orders : ROUTES.products}
          className="text-xs font-medium tracking-widest text-zinc-500 uppercase hover:text-white"
        >
          {user ? '← Moje porudžbine' : '← Idi na proizvode'}
        </Link>
      </div>
    );
  }

  const status = order.status ?? 'processing';
  const addr = order.shippingAddress;
  const total = order.total ?? order.amount ?? null;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-900 pb-8">
        <Link
          href={user ? ROUTES.orders : ROUTES.products}
          className="text-xs font-medium tracking-widest text-zinc-600 uppercase transition-colors hover:text-white"
        >
          ← {user ? 'Moje porudžbine' : 'Nastavi kupovinu'}
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Porudžbina #{order.id}
          </h1>
          <span
            className={`px-2.5 py-1 text-[10px] font-medium tracking-widest uppercase ${STATUS_CLASS[status] ?? STATUS_CLASS.processing}`}
          >
            {STATUS_LABEL[status] ?? status}
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <div className="mb-3 text-xs font-medium tracking-widest text-zinc-500 uppercase">
              Artikli
            </div>
            <div className="divide-y divide-zinc-900 border border-zinc-800">
              {order.items?.map((item, idx) => {
                const product = item.product;
                const variant = item.variant;
                const img = product?.gallery?.[0]?.image;
                const price =
                  variant?.price ??
                  product?.salePrice ??
                  product?.price ??
                  null;

                return (
                  <div key={idx} className="flex items-center gap-4 p-4">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-zinc-900">
                      {img && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${img.url}`}
                          alt={product?.title ?? ''}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white">
                        {product?.title ??
                          `Proizvod #${typeof product === 'number' ? product : product?.id}`}
                      </div>
                      {variant?.options?.length > 0 && (
                        <div className="mt-0.5 text-xs text-zinc-500">
                          {variant.options.map((o) => o.label ?? o).join(' / ')}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-zinc-500">
                        ×{item.quantity}
                      </div>
                      {price != null && (
                        <div className="text-sm text-white">
                          {(price * item.quantity).toLocaleString('sr-RS')}{' '}
                          {CURRENCY.symbol}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {addr && (
            <div>
              <div className="mb-3 text-xs font-medium tracking-widest text-zinc-500 uppercase">
                Adresa dostave
              </div>
              <div className="border border-zinc-800 p-4 text-sm">
                <p className="font-medium text-white">
                  {addr.firstName} {addr.lastName}
                </p>
                {addr.company && (
                  <p className="text-zinc-400">{addr.company}</p>
                )}
                <p className="mt-1 text-zinc-400">{addr.addressLine1}</p>
                {addr.addressLine2 && (
                  <p className="text-zinc-400">{addr.addressLine2}</p>
                )}
                <p className="text-zinc-400">
                  {addr.postalCode} {addr.city}
                  {addr.state ? `, ${addr.state}` : ''}
                </p>
                <p className="text-zinc-400">{addr.country}</p>
                {addr.phone && (
                  <p className="mt-1 text-zinc-500">{addr.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-fit space-y-4">
          <div className="border border-zinc-800 bg-zinc-950 p-5">
            <div className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
              Sažetak
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Email</span>
                <span className="text-zinc-300 text-right max-w-[180px] truncate">
                  {order.customerEmail ?? '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Artikala</span>
                <span className="text-white">
                  {order.items?.reduce((s, i) => s + (i.quantity ?? 1), 0) ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Dostava</span>
                <span className="text-white">Besplatno</span>
              </div>
              {total != null && (
                <div className="flex justify-between border-t border-zinc-900 pt-3 text-base font-semibold">
                  <span className="text-white">Ukupno</span>
                  <span className="text-white">
                    {total.toLocaleString('sr-RS')} {CURRENCY.symbol}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!user && accessToken && (
            <div className="border border-zinc-800 p-4">
              <p className="text-[10px] font-medium tracking-widest text-zinc-600 uppercase">
                Kod za praćenje
              </p>
              <p className="mt-1 break-all font-mono text-[11px] text-zinc-400">
                {accessToken}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
