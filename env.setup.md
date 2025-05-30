# Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Setup Instructions

1. Create a Supabase project at https://app.supabase.com/
2. Get your API keys from the Supabase dashboard
3. Create a Stripe account at https://stripe.com/
4. Get your API keys from the Stripe dashboard
5. Generate a random string for NEXTAUTH_SECRET using `openssl rand -base64 32`
6. Update your `.env.local` file with the actual values
