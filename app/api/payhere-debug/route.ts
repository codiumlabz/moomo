import { NextResponse } from 'next/server';

export async function GET() {
  const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
  const secretPrivate = process.env.PAYHERE_MERCHANT_SECRET;
  const secretPublic = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;
  const sandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX;

  return NextResponse.json({
    merchant_id: merchantId || '❌ NOT SET',
    merchant_id_set: !!merchantId,
    secret_private_set: !!secretPrivate,
    secret_private_length: secretPrivate ? secretPrivate.length : 0,
    secret_public_set: !!secretPublic,
    secret_public_length: secretPublic ? secretPublic.length : 0,
    active_secret: secretPrivate ? 'PAYHERE_MERCHANT_SECRET' : secretPublic ? 'NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET' : '❌ NONE',
    sandbox: sandbox || 'not set (defaults to true)',
  });
}
