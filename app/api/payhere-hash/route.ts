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
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;

    if (!merchantId || !merchantSecret) {
      return NextResponse.json({ error: 'PayHere credentials not configured on server' }, { status: 500 });
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
