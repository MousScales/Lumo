# LumoCase Deployment Guide

## Environment Variables

Set these environment variables in your deployment platform:

```bash
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

## Deployment Platforms

### Vercel
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### Netlify
1. Connect your GitHub repository
2. Set environment variables in Netlify dashboard
3. Deploy automatically

### Heroku
1. Create new app
2. Set environment variables: `heroku config:set STRIPE_SECRET_KEY=your_key`
3. Deploy with Git

## Local Development

1. Create `.env` file:
```
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

2. Update `script.js` line 2 with your publishable key
3. Run `npm start`

## Stripe Products Created

All 8 products are already created in your Stripe account:
- Black × AirPods 2, 3, 4, Pro
- Orange × AirPods 2, 3, 4, Pro
