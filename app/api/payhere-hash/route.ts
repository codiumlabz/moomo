import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

    // Auto-decode base64 secret if needed
    let merchantSecret = merchantSecretEnv;
    if (/^[A-Za-z0-9+/]+={0,2}$/.test(merchantSecretEnv) && merchantSecretEnv.length % 4 === 0 && merchantSecretEnv.includes('=')) {
      try {
        const decoded = Buffer.from(merchantSecretEnv, 'base64').toString('utf8');
        if (/^[a-zA-Z0-9]+$/.test(decoded)) {
          merchantSecret = decoded;
          console.log('Decoded PayHere Merchant Secret from Base64 successfully');
        }
      } catch (e) {
        console.warn('Failed to decode base64 merchant secret, using raw value', e);
      }
    }

    // Format amount to 2 decimal places (e.g. 1500.00)
    const formattedAmount = Number(amount).toFixed(2);

    // Calculate MD5 hash:
    // hash = UPPERCASE(MD5(merchant_id + order_id + formattedAmount + currency + UPPERCASE(MD5(merchant_secret))))
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const rawString = merchantId + order_id + formattedAmount + currency + hashedSecret;

    const hash = crypto
      .createHash('md5')
      .update(rawString)
      .digest('hex')
      .toUpperCase();

    return NextResponse.json({ hash });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
