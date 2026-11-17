import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { GetSessionByserver } from '@/lib/core/apiget'

export async function POST() {
  const Usersession=await GetSessionByserver();
  console.log(Usersession?.user);
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1UcJmILTlnkYabdCaAVtFtlg',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email:Usersession?.user.email,
      metadata:{
        userID:Usersession?.user.id as string,
      },
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'heir_loop_web_007',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
      const error = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    )
  }
}