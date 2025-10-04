# LumoCase AirPod Case - E-commerce Website

A sleek, modern e-commerce website for LumoCase AirPod cases with Stripe payment integration.

## Features

- 🎨 **Modern Design**: Dark theme with glow effects and animations
- 🛒 **Shopping Cart**: Professional cart popup with item management
- 💳 **Stripe Integration**: Secure payment processing
- 📱 **Responsive**: Works on all devices
- 🎯 **Product Variants**: Black/Orange colors × AirPods 2/3/4/Pro models

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Stripe

1. Create a Stripe account at [https://stripe.com](https://stripe.com)
2. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Update the keys in `config.js`:

```javascript
const STRIPE_CONFIG = {
  SECRET_KEY: 'sk_test_your_actual_secret_key_here',
  PUBLISHABLE_KEY: 'pk_test_your_actual_publishable_key_here'
};
```

4. Update the publishable key in `script.js`:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_publishable_key_here';
```

### 3. Run the Application

```bash
npm start
```

The application will be available at `http://localhost:3001`

## Stripe Products

The application automatically creates 8 Stripe products:

### Black Cases
- LumoCase AirPod Case (Black) - AirPods 2
- LumoCase AirPod Case (Black) - AirPods 3
- LumoCase AirPod Case (Black) - AirPods 4
- LumoCase AirPod Case (Black) - AirPods Pro

### Orange Cases
- LumoCase AirPod Case (Orange) - AirPods 2
- LumoCase AirPod Case (Orange) - AirPods 3
- LumoCase AirPod Case (Orange) - AirPods 4
- LumoCase AirPod Case (Orange) - AirPods Pro

## Pricing

- **Base Price**: $30.00 per case
- **Quantity Discounts**:
  - 2 cases: $55.00 total ($27.50 each)
  - 3 cases: $80.00 total ($26.67 each)

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── server.js           # Express server with Stripe integration
├── config.js           # Configuration file
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## API Endpoints

- `GET /api/products` - Get all Stripe products
- `POST /api/create-payment-intent` - Create payment intent for checkout

## Testing

Use Stripe's test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

## Deployment

1. Set up environment variables for production
2. Deploy to your preferred hosting service (Heroku, Vercel, etc.)
3. Update the Stripe keys to production keys
4. Test the payment flow thoroughly

## Support

For issues or questions, please check the Stripe documentation or create an issue in this repository.