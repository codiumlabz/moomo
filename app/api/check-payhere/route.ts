import { NextResponse } from 'next/server';

const URLS = {
  sdk: 'https://www.payhere.lk/lib/payhere.js',
};

export async function GET() {
  const results: Record<string, any> = {};

  for (const [key, url] of Object.entries(URLS)) {
    try {
      const res = await fetch(url, { method: 'GET' });
      const text = await res.text().catch(() => null);
      results[key] = {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        contentType: res.headers.get('content-type'),
        length: text ? text.length : null,
      };
    } catch (err: any) {
      results[key] = { error: String(err) };
    }
  }

  return NextResponse.json(results);
}
