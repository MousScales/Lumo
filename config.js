// Stripe Configuration
// Replace these with your actual Stripe keys from https://dashboard.stripe.com/apikeys
const STRIPE_CONFIG = {
  SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here',
  PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key_here'
};

module.exports = STRIPE_CONFIG;
