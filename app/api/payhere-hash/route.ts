import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Resolves the PayHere merchant secret.
 * PayHere shows secrets in their portal as base64-encoded strings.
 * This function tries to decode it; if the decoded result is a valid
 * alphanumeric string (the real secret), it returns that.
 * Otherwise, returns the raw value unchanged.
 */
function resolveMerchantSecret(raw: string): { secret: string; wasDecoded: boolean } {
  const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(raw) && raw.length % 4 === 0;

  if (isBase64) {
    try {
      const decoded = Buffer.from(raw, 'base64').toString('utf8');
      // Valid if decoded result is purely alphanumeric (PayHere secrets are numeric strings)
      if (/^[a-zA-Z0-9]+$/.test(decoded) && decoded.length >= 10) {
        return { secret: decoded, wasDecoded: true };
      }
    } catch {
      // fall through
    }
  }

  // Also try padding if length not divisible by 4
  if (raw.length % 4 !== 0) {
    const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4);
    try {
      const decoded = Buffer.from(padded, 'base64').toString('utf8');
      if (/^[a-zA-Z0-9]+$/.test(decoded) && decoded.length >= 10) {
        return { secret: decoded, wasDecoded: true };
      }
    } catch {
      // fall through
    }
  }

  return { secret: raw, wasDecoded: false };
}

export function generatePayhereHash(
  merchantId: string,
  orderId: string,
  amount: string,
  currency: string,
  merchantSecret: string
): string {
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const rawString = merchantId + orderId + amount + currency + hashedSecret;

  return crypto.createHash('md5').update(rawString).digest('hex').toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, amount, currency } = body;

    if (!order_id || amount === undefined || !currency) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
    const merchantSecretEnv = process.env.PAYHERE_MERCHANT_SECRET || process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;

    if (!merchantId || !merchantSecretEnv) {
      return NextResponse.json({ error: 'PayHere credentials not configured on server' }, { status: 500 });
    }

    const { secret: merchantSecret, wasDecoded } = resolveMerchantSecret(merchantSecretEnv);
    console.log(`[PayHere] Using ${wasDecoded ? 'decoded (base64)' : 'raw'} merchant secret. Secret length: ${merchantSecret.length}`);

    // Format amount to 2 decimal places (e.g. 1500.00)
    const formattedAmount = Number(amount).toFixed(2);

    const hash = generatePayhereHash(merchantId, order_id, formattedAmount, currency, merchantSecret);

    return NextResponse.json({ hash });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
