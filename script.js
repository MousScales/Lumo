// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SEIs1RyN1JZ733WSrAqTs40oWPn5n6mXVWANmWBRKawz8xNEv5mPjKYU13ouJK0J3Btux5pZk9eBEcctYqAPv0V0052EsT8ni';
let stripe;
let elements;
let paymentElement;

// Initialize Stripe
async function initializeStripe() {
    if (STRIPE_PUBLISHABLE_KEY.includes('your_stripe_publishable_key_here')) {
        console.warn('⚠️ Please update STRIPE_PUBLISHABLE_KEY in script.js with your actual Stripe publishable key');
        return false;
    }
    
    try {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        return true;
    } catch (error) {
        console.error('Error initializing Stripe:', error);
        return false;
    }
}

// Analytics tracking functions
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

function trackPageView(pageName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageName,
            page_location: window.location.href
        });
    }
}

// Cart functionality
let cart = {
    items: [],
    total: 0
};

// Price calculation
function updatePrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const basePrice = 30.00;
    let totalPrice = basePrice * quantity;
    
    // Apply discounts
    if (quantity === 2) {
        totalPrice = 55.00; // $5 discount
    } else if (quantity === 3) {
        totalPrice = 80.00; // $10 discount
    }
    
    document.getElementById('subtotal').textContent = `$${totalPrice.toFixed(2)}`;
    document.getElementById('total').textContent = `$${totalPrice.toFixed(2)}`;
    
    // Update add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    addToCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Add to Cart - $${totalPrice.toFixed(2)}`;
    
    // Update checkout button
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.innerHTML = `<i class="fas fa-lock"></i> Secure Checkout - $${totalPrice.toFixed(2)}`;
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const viewCartBtn = document.getElementById('viewCartBtn');
    
    cartCount.textContent = cart.items.length;
    
    if (cart.items.length > 0) {
        viewCartBtn.style.display = 'block';
    } else {
        viewCartBtn.style.display = 'none';
    }
}

// Add item to cart
function addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const color = document.querySelector('.style-btn.active').dataset.style;
    const model = document.querySelector('.model-btn.active').dataset.model;
    const basePrice = 30.00;
    let totalPrice = basePrice * quantity;
    
    // Apply discounts
    if (quantity === 2) {
        totalPrice = 55.00;
    } else if (quantity === 3) {
        totalPrice = 80.00;
    }
    
    // Format model name for display
    const modelName = model.replace('airpods-', 'AirPods ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Add item to cart
    const cartItem = {
        id: Date.now(),
        color: color,
        model: modelName,
        quantity: quantity,
        basePrice: basePrice,
        price: totalPrice,
        name: `LumoCase AirPod Case (${color})`
    };
    
    cart.items.push(cartItem);
    cart.total += totalPrice;
    
    updateCartDisplay();
    
    // Track add to cart event
    trackEvent('add_to_cart', {
        currency: 'USD',
        value: totalPrice,
        items: [{
            item_id: cartItem.id,
            item_name: cartItem.name,
            item_category: 'AirPod Case',
            item_variant: `${cartItem.color} - ${cartItem.model}`,
            quantity: cartItem.quantity,
            price: cartItem.basePrice
        }]
    });
    
    // Show success message
    const addToCartBtn = document.getElementById('addToCart');
    const originalText = addToCartBtn.innerHTML;
    addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
    addToCartBtn.style.background = '#10b981';
    
    setTimeout(() => {
        addToCartBtn.innerHTML = originalText;
        addToCartBtn.style.background = '';
    }, 2000);
}

// Event listeners for price updates
document.getElementById('quantity').addEventListener('change', updatePrice);

// Quantity controls
document.querySelector('.qty-btn.minus').addEventListener('click', function() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        updatePrice();
    }
});

document.querySelector('.qty-btn.plus').addEventListener('click', function() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
        updatePrice();
    }
});

// Style selection
document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Update thumbnail selection
        const style = this.dataset.style;
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        document.querySelector(`[data-style="${style}"]`).classList.add('active');
        
        // Update main product display
        updateProductDisplay(style);
    });
});

// AirPods model selection
document.querySelectorAll('.model-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all model buttons
        document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Thumbnail selection
document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
        // Remove active class from all thumbnails
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Update main product display
        const imageSrc = this.dataset.image;
        updateProductImage(imageSrc);
        
        // Update style buttons based on image
        const isBlack = imageSrc === 'black.png';
        const isOrange = imageSrc === 'orange.png';
        document.querySelectorAll('.style-btn').forEach(btn => btn.classList.remove('active'));
        if (isBlack) {
            document.querySelector('[data-style="black"]').classList.add('active');
        } else if (isOrange) {
            document.querySelector('[data-style="orange"]').classList.add('active');
        }
    });
});

// Update product display based on selected style
function updateProductDisplay(style) {
    const mainImage = document.getElementById('mainProductImage');
    
    switch(style) {
        case 'black':
            mainImage.src = 'black.png';
            mainImage.alt = 'Black LumoCase AirPod Case';
            break;
        case 'orange':
            mainImage.src = 'orange.png';
            mainImage.alt = 'Orange LumoCase AirPod Case';
            break;
    }
}

// Update product image directly
function updateProductImage(imageSrc) {
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = imageSrc;
    
    // Update alt text based on image
    if (imageSrc === 'black.png') {
        mainImage.alt = 'Black LumoCase AirPod Case';
    } else if (imageSrc === 'orange.png') {
        mainImage.alt = 'Orange LumoCase AirPod Case';
    } else {
        mainImage.alt = 'LumoCase AirPod Case';
    }
}

// Add to cart functionality
document.getElementById('addToCart').addEventListener('click', function() {
    addToCart();
});

// Cart popup functionality
function showCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'flex';
    updateCartModal();
    
    // Track cart view event
    trackEvent('view_cart', {
        currency: 'USD',
        value: cart.total,
        items: cart.items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: 'AirPod Case',
            item_variant: `${item.color} - ${item.model}`,
            quantity: item.quantity,
            price: item.basePrice
        }))
    });
}

function hideCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

function updateCartModal() {
    const cartModalBody = document.getElementById('cartModalBody');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    
    if (cart.items.length === 0) {
        cartModalBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotalAmount.textContent = '0.00';
        return;
    }
    
    let cartHTML = '';
    cart.items.forEach((item, index) => {
        const imageSrc = item.color === 'black' ? 'black.png' : 'orange.png';
        cartHTML += `
            <div class="cart-item">
                <img src="${imageSrc}" alt="${item.color} LumoCase" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-model">${item.model}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <button class="remove-item-btn" onclick="removeCartItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartModalBody.innerHTML = cartHTML;
    cartTotalAmount.textContent = cart.total.toFixed(2);
}

function updateCartItemQuantity(index, change) {
    const item = cart.items[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeCartItem(index);
        return;
    }
    
    item.quantity = newQuantity;
    
    // Recalculate price with discounts
    let totalPrice = item.basePrice * item.quantity;
    if (item.quantity === 2) {
        totalPrice = 55.00;
    } else if (item.quantity === 3) {
        totalPrice = 80.00;
    }
    item.price = totalPrice;
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + item.price, 0);
    
    updateCartModal();
    updateCartDisplay();
}

function removeCartItem(index) {
    cart.items.splice(index, 1);
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + item.price, 0);
    
    updateCartModal();
    updateCartDisplay();
}

// View cart functionality
document.getElementById('viewCartBtn').addEventListener('click', function() {
    showCartModal();
});

// Cart icon click functionality
document.getElementById('cartIcon').addEventListener('click', function() {
    showCartModal();
});

// Close cart modal
document.getElementById('closeCartBtn').addEventListener('click', function() {
    hideCartModal();
});

// Close cart modal when clicking overlay
document.getElementById('cartModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideCartModal();
    }
});

// Checkout button in cart modal
document.getElementById('checkoutBtn').addEventListener('click', async function() {
    hideCartModal();
    
    // Track begin checkout event
    trackEvent('begin_checkout', {
        currency: 'USD',
        value: cart.total,
        items: cart.items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: 'AirPod Case',
            item_variant: `${item.color} - ${item.model}`,
            quantity: item.quantity,
            price: item.basePrice
        }))
    });
    
    // Initialize Stripe if not already done
    if (!stripe) {
        const stripeInitialized = await initializeStripe();
        if (!stripeInitialized) {
            alert('Payment system not available. Please try again later.');
            return;
        }
    }
    
    // Show checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.style.display = 'block';
    
    // Scroll to checkout form
    checkoutForm.scrollIntoView({ behavior: 'smooth' });
    
    // Update checkout form with cart items
    updateCheckoutForm();
    
    // Process Stripe payment
    await processStripePayment();
});

// Update checkout form with cart items
function updateCheckoutForm() {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    let cartTotal = 0;
    cart.items.forEach(item => {
        cartTotal += item.price;
    });
    
    subtotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    totalElement.textContent = `$${cartTotal.toFixed(2)}`;
    
    // Update checkout button
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.innerHTML = `<i class="fas fa-lock"></i> Secure Checkout - $${cartTotal.toFixed(2)}`;
    }
}

// Form validation and submission
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const email = formData.get('email');
    const name = formData.get('name');
    const address = formData.get('address');
    const city = formData.get('city');
    const zip = formData.get('zip');
    
    // Validate form
    if (!email || !name || !address || !city || !zip) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (cart.items.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }
    
    // Show loading state
    const checkoutButton = document.getElementById('checkout-button');
    const originalText = checkoutButton.innerHTML;
    checkoutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    checkoutButton.disabled = true;
    
    try {
        // Handle Stripe payment
        await handleSubmit(e);
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
    } finally {
        // Reset button
        checkoutButton.innerHTML = originalText;
        checkoutButton.disabled = false;
    }
});

// Stripe payment processing function
async function processStripePayment() {
    if (!stripe) {
        console.error('Stripe not initialized');
        return;
    }
    
    try {
        // Create payment intent
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: cart.items
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create payment intent');
        }
        
        const { clientSecret, totalAmount } = await response.json();
        
        if (!clientSecret) {
            throw new Error('No client secret received from server');
        }
        
        // Create payment element
        elements = stripe.elements({
            clientSecret: clientSecret,
            appearance: {
                theme: 'night',
                variables: {
                    colorPrimary: '#fbbf24',
                    colorBackground: '#1a1a1a',
                    colorText: '#ffffff',
                    colorDanger: '#df1b41',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px',
                }
            }
        });
        
        paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');
        
        // Show payment form
        document.getElementById('checkoutForm').style.display = 'block';
        document.getElementById('payment-section').style.display = 'block';
        
        // Handle form submission
        const form = document.getElementById('orderForm');
        form.addEventListener('submit', handleSubmit);
        
    } catch (error) {
        console.error('Error creating payment intent:', error);
        alert('Error processing payment: ' + error.message);
    }
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();
    
    if (!stripe || !elements) {
        console.error('Stripe not initialized');
        return;
    }
    
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: window.location.origin + '/success',
        },
    });
    
    if (error) {
        console.error('Payment failed:', error);
        alert('Payment failed: ' + error.message);
    } else {
        // Track purchase event
        trackEvent('purchase', {
            transaction_id: Date.now().toString(),
            currency: 'USD',
            value: cart.total,
            items: cart.items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                item_category: 'AirPod Case',
                item_variant: `${item.color} - ${item.model}`,
                quantity: item.quantity,
                price: item.basePrice
            }))
        });
        
        // Payment succeeded
        showSuccessModal({
            items: cart.items,
            total: cart.total
        });
        
        // Clear cart
        cart.items = [];
        cart.total = 0;
        updateCartDisplay();
    }
}

// Success modal
function showSuccessModal(orderDetails) {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <i class="fas fa-check-circle"></i>
                    <h2>Order Successful!</h2>
                </div>
                <div class="modal-body">
                    <p>Thank you for your order! Your LumoCase will be shipped within 1-2 business days.</p>
                    <div class="order-details">
                        <div class="detail-row">
                            <span>Color:</span>
                            <span>${orderDetails.color.charAt(0).toUpperCase() + orderDetails.color.slice(1)}</span>
                        </div>
                        <div class="detail-row">
                            <span>Quantity:</span>
                            <span>${orderDetails.quantity}</span>
                        </div>
                        <div class="detail-row">
                            <span>Total:</span>
                            <span>$${orderDetails.total.toFixed(2)}</span>
                        </div>
                    </div>
                    <p class="shipping-info">You will receive a confirmation email shortly with tracking information.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="closeModal()">Continue Shopping</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: #1a1a1a;
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            animation: modalSlideIn 0.3s ease;
            border: 1px solid #333;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal-header i {
            font-size: 4rem;
            color: #10b981;
            margin-bottom: 1rem;
        }
        
        .modal-header h2 {
            color: white;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .modal-body p {
            color: #d1d5db;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .order-details {
            background: #0a0a0a;
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid #333;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            font-weight: 500;
            color: white;
        }
        
        .detail-row:last-child {
            margin-bottom: 0;
            font-weight: 700;
            font-size: 1.1rem;
            color: #fbbf24;
        }
        
        .shipping-info {
            font-size: 0.9rem;
            color: #9ca3af;
            font-style: italic;
        }
        
        .modal-footer {
            margin-top: 1.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #0a0a0a;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
}

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    // Track page view
    trackPageView('LumoCase Homepage');
    
    // Initialize Stripe
    await initializeStripe();
    
    // Set initial price
    updatePrice();
    
    // Add smooth scrolling to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId === 'product') {
                // Scroll to product showcase
                document.querySelector('.product-gallery').scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === 'checkout') {
                // Scroll to checkout form
                document.querySelector('.checkout-form').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add loading animation to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Add hover effects to style buttons
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.borderColor = '#6366f1';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.borderColor = '#333';
            }
        });
    });
    
    // Add hover effects to model buttons
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.borderColor = '#6366f1';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.borderColor = '#333';
            }
        });
    });
    
    // Add hover effects to thumbnails
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.borderColor = '#6366f1';
            }
        });
        
        thumb.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.borderColor = 'transparent';
            }
        });
    });
});

// Stripe Integration Setup (for future implementation)
/*
To integrate with Stripe, you would need to:

1. Include Stripe.js in your HTML:
   <script src="https://js.stripe.com/v3/"></script>

2. Initialize Stripe with your publishable key:
   const stripe = Stripe('pk_test_your_publishable_key_here');

3. Create a payment method and process the payment:
   async function processStripePayment(color, quantity) {
       const { error, paymentMethod } = await stripe.createPaymentMethod({
           type: 'card',
           card: cardElement,
       });
       
       if (error) {
           console.error('Error:', error);
           return;
       }
       
       // Send payment method to your backend
       const response = await fetch('/create-payment-intent', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({
               payment_method_id: paymentMethod.id,
               amount: totalPrice * 100, // Convert to cents
               currency: 'usd',
               metadata: {
                   color: color,
                   quantity: quantity
               }
           }),
       });
       
       const { client_secret } = await response.json();
       
       // Confirm payment
       const { error: confirmError } = await stripe.confirmPayment({
           clientSecret: client_secret,
           confirmParams: {
               return_url: window.location.origin + '/success',
           },
       });
       
       if (confirmError) {
           console.error('Error:', confirmError);
       } else {
           showSuccessModal({ color, quantity, total: totalPrice });
       }
   }
*/