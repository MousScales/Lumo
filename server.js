const express = require('express');
const config = require('./config');
const stripe = require('stripe')(config.SECRET_KEY);
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Stripe products configuration
const PRODUCTS = {
  'black-airpods-2': {
    name: 'LumoCase AirPod Case (Black) - AirPods 2',
    description: 'Glow-in-the-dark AirPod case with mesmerizing moving sand effects for AirPods 2',
    price: 3000, // $30.00 in cents
    images: ['black.png']
  },
  'black-airpods-3': {
    name: 'LumoCase AirPod Case (Black) - AirPods 3',
    description: 'Glow-in-the-dark AirPod case with mesmerizing moving sand effects for AirPods 3',
    price: 3000,
    images: ['black.png']
  },
  'black-airpods-4': {
    name: 'LumoCase AirPod Case (Black) - AirPods 4',
    description: 'Glow-in-the-dark AirPod case with mesmerizing moving sand effects for AirPods 4',
    price: 3000,
    images: ['black.png']
  },
  'black-airpods-pro': {
    name: 'LumoCase AirPod Case (Black) - AirPods Pro',
    description: 'Glow-in-the-dark AirPod case with mesmerizing moving sand effects for AirPods Pro',
    price: 3000,
    images: ['black.png']
  },
  'orange-airpods-2': {
    name: 'LumoCase AirPod Case (Orange) - AirPods 2',
    description: 'Glow-in-the-dark AirPod case with mesmerizing moving sand effects for AirPods 2',
    price: 3000,
    images: ['orange.png']
  },
  'orange-airpods-3': {
    name: 'LumoCase AirPod Case (Orange) - AirPods 3',
    description: 'Glow-in-the-dark AirPod case with mesmerizing moving sand effects for AirPods 3',
    price: 3000,
    images: ['orange.png']
  },
  'orange-airpods-4': {
    name: 'LumoCase AirPod Case (Orange) - AirPods 4',
    description: 'Glow-in-the-dark AirPod case with mesmerizing moving sand effects for AirPods 4',
    price: 3000,
    images: ['orange.png']
  },
  'orange-airpods-pro': {
    name: 'LumoCase AirPod Case (Orange) - AirPods Pro',
    description: 'Glow-in-the-dark AirPod case with mesmerizing moving sand effects for AirPods Pro',
    price: 3000,
    images: ['orange.png']
  }
};

// Initialize Stripe products
async function initializeStripeProducts() {
  console.log('Initializing Stripe products...');
  
  for (const [productId, productData] of Object.entries(PRODUCTS)) {
    try {
      // Check if product already exists
      const existingProducts = await stripe.products.list({
        limit: 100,
        active: true
      });
      
      const existingProduct = existingProducts.data.find(p => p.metadata.productId === productId);
      
      if (!existingProduct) {
        // Create product
        const product = await stripe.products.create({
          name: productData.name,
          description: productData.description,
          images: productData.images,
          metadata: {
            productId: productId,
            color: productId.split('-')[0],
            airpodsModel: productId.split('-')[1] + '-' + productId.split('-')[2]
          }
        });
        
        // Create price
        await stripe.prices.create({
          product: product.id,
          unit_amount: productData.price,
          currency: 'usd',
          metadata: {
            productId: productId
          }
        });
        
        console.log(`✅ Created product: ${productData.name}`);
      } else {
        console.log(`ℹ️  Product already exists: ${productData.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating product ${productId}:`, error.message);
    }
  }
}

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await stripe.products.list({
      limit: 100,
      active: true,
      expand: ['data.default_price']
    });
    
    const formattedProducts = products.data
      .filter(product => product.metadata.productId)
      .map(product => ({
        id: product.id,
        productId: product.metadata.productId,
        name: product.name,
        description: product.description,
        price: product.default_price ? product.default_price.unit_amount : 3000,
        currency: product.default_price ? product.default_price.currency : 'usd',
        images: product.images,
        color: product.metadata.color,
        airpodsModel: product.metadata.airpodsModel
      }));
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    const lineItems = [];
    
    for (const item of items) {
      const productId = `${item.color}-${item.model}`;
      const productData = PRODUCTS[productId];
      
      if (!productData) {
        return res.status(400).json({ error: `Invalid product: ${productId}` });
      }
      
      // Apply quantity discounts
      let itemPrice = productData.price;
      if (item.quantity === 2) {
        itemPrice = 2750; // $27.50 each
      } else if (item.quantity === 3) {
        itemPrice = 2667; // $26.67 each
      }
      
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;
      
      lineItems.push({
        name: productData.name,
        quantity: item.quantity,
        amount: itemTotal
      });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        items: JSON.stringify(items)
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      totalAmount: totalAmount
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('🔑 Make sure to set STRIPE_SECRET_KEY environment variable');
  
  // Initialize Stripe products
  if (process.env.STRIPE_SECRET_KEY) {
    await initializeStripeProducts();
  } else {
    console.log('⚠️  STRIPE_SECRET_KEY not set. Products will not be initialized.');
  }
});

module.exports = app;
