import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function unique(values = []) {
  return [...new Set(values.filter((value) => typeof value === 'string' && value.trim()))];
}

export async function POST(request) {
  const configuredSecret = process.env.REVALIDATE_SECRET?.trim();
  const requestSecret = request.headers.get('x-revalidate-secret')?.trim();

  if (configuredSecret && requestSecret !== configuredSecret) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const tags = unique(body?.tags);
  const paths = unique(body?.paths);

  for (const tag of tags) {
    revalidateTag(tag);
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: {
      paths,
      tags,
    },
  });
}
