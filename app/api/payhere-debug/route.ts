import { NextResponse } from 'next/server';
import crypto from 'crypto';

function resolveMerchantSecret(raw: string): { secret: string; wasDecoded: boolean } {
  const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(raw) && raw.length % 4 === 0;
  if (isBase64) {
    try {
      const decoded = Buffer.from(raw, 'base64').toString('utf8');
      if (/^[a-zA-Z0-9]+$/.test(decoded) && decoded.length >= 10) {
        return { secret: decoded, wasDecoded: true };
      }
    } catch { /* fall through */ }
  }
  if (raw.length % 4 !== 0) {
    const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4);
    try {
      const decoded = Buffer.from(padded, 'base64').toString('utf8');
      if (/^[a-zA-Z0-9]+$/.test(decoded) && decoded.length >= 10) {
        return { secret: decoded, wasDecoded: true };
      }
    } catch { /* fall through */ }
  }
  return { secret: raw, wasDecoded: false };
}

export async function GET() {
  const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
  const secretPrivate = process.env.PAYHERE_MERCHANT_SECRET;
  const secretPublic = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;
  const sandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX;

  const rawSecret = secretPrivate || secretPublic || '';
  const { secret: resolvedSecret, wasDecoded } = rawSecret ? resolveMerchantSecret(rawSecret) : { secret: '', wasDecoded: false };

  // Generate a test hash with known values so you can verify
  let testHash = 'N/A (no credentials)';
  if (merchantId && resolvedSecret) {
    const hashedSecret = crypto.createHash('md5').update(resolvedSecret).digest('hex').toUpperCase();
    const raw = merchantId + 'TEST-ORDER' + '1000.00' + 'LKR' + hashedSecret;
    testHash = crypto.createHash('md5').update(raw).digest('hex').toUpperCase();
  }

  return NextResponse.json({
    merchant_id: merchantId || '❌ NOT SET',
    secret_private_set: !!secretPrivate,
    secret_private_length: secretPrivate?.length ?? 0,
    secret_public_set: !!secretPublic,
    active_secret: secretPrivate ? 'PAYHERE_MERCHANT_SECRET' : secretPublic ? 'NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET' : '❌ NONE',
    secret_was_base64_decoded: wasDecoded,
    resolved_secret_length: resolvedSecret.length,
    sandbox: sandbox ?? 'not set (defaults to true)',
    // Test hash for merchant_id + "TEST-ORDER" + "1000.00" + "LKR" + hashed_secret
    test_hash_for_1000_LKR: testHash,
  });
}
