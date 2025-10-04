// Test script to verify Stripe setup
const config = require('./config');

console.log('🧪 Testing LumoCase Stripe Setup...\n');

// Check if Stripe keys are configured
if (config.SECRET_KEY.includes('your_stripe_secret_key_here')) {
    console.log('❌ Stripe Secret Key not configured');
    console.log('   Please update config.js with your actual Stripe secret key');
} else {
    console.log('✅ Stripe Secret Key configured');
}

if (config.PUBLISHABLE_KEY.includes('your_stripe_publishable_key_here')) {
    console.log('❌ Stripe Publishable Key not configured');
    console.log('   Please update config.js with your actual Stripe publishable key');
} else {
    console.log('✅ Stripe Publishable Key configured');
}

console.log('\n📋 Next Steps:');
console.log('1. Get your Stripe keys from https://dashboard.stripe.com/apikeys');
console.log('2. Update config.js with your actual keys');
console.log('3. Update script.js with your publishable key');
console.log('4. Run: npm start');
console.log('5. Visit: http://localhost:3001');

console.log('\n🎯 Product Combinations:');
const colors = ['black', 'orange'];
const models = ['airpods-2', 'airpods-3', 'airpods-4', 'airpods-pro'];

colors.forEach(color => {
    models.forEach(model => {
        console.log(`   - ${color}-${model}`);
    });
});

console.log('\n💰 Pricing:');
console.log('   - Base Price: $30.00 per case');
console.log('   - 2 cases: $55.00 total ($27.50 each)');
console.log('   - 3 cases: $80.00 total ($26.67 each)');

console.log('\n🚀 Ready to launch!');
