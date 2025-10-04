# Google Analytics Setup for LumoCase

## Setup Instructions

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new account or use existing
3. Create a new property for your website
4. Get your Measurement ID (starts with G-)

### 2. Update Analytics Code
Replace `GA_MEASUREMENT_ID` in `index.html` with your actual Measurement ID:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 3. Enhanced E-commerce Tracking
The following events are automatically tracked:

#### Page Views
- Homepage visits
- Cart modal views

#### E-commerce Events
- **add_to_cart**: When items are added to cart
- **view_cart**: When cart modal is opened
- **begin_checkout**: When checkout process starts
- **purchase**: When payment is completed

#### Event Data Includes
- Product details (name, category, variant)
- Pricing information
- Currency (USD)
- Transaction IDs for purchases

### 4. View Analytics Data
1. Go to your Google Analytics dashboard
2. Navigate to Reports → E-commerce
3. View Enhanced E-commerce reports
4. Monitor conversion funnel and revenue

### 5. Test Analytics
1. Visit your website
2. Add items to cart
3. Complete a test purchase
4. Check Real-time reports in Google Analytics

## Privacy Compliance
- Analytics respects user privacy
- No personal data is collected
- Complies with GDPR/CCPA requirements
- Users can opt-out via browser settings
