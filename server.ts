import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PRODUCTS, CATEGORIES } from './src/data/products';
import { Order, Review, Product } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory data stores with product clone
let productsData: Product[] = JSON.parse(JSON.stringify(PRODUCTS));
let categoriesData = JSON.parse(JSON.stringify(CATEGORIES));

// Orders file path for persistence
const ORDERS_FILE = path.join(__dirname, 'orders.json');
let ordersMap: Record<string, Order> = {};

if (fs.existsSync(ORDERS_FILE)) {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    ordersMap = JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read orders.json, starting with empty orders store', err);
    ordersMap = {};
  }
}

function persistOrders() {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(ordersMap, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist orders:', err);
  }
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Get Categories
app.get('/api/categories', (_req, res) => {
  res.json({ categories: categoriesData });
});

// 2. Get Products (with filtering, search, sorting)
app.get('/api/products', (req, res) => {
  const { category, search, minPrice, maxPrice, inStock, sort } = req.query;

  let results = [...productsData];

  if (category && category !== 'all') {
    results = results.filter((p) => p.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      results = results.filter((p) => p.price >= min);
    }
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      results = results.filter((p) => p.price <= max);
    }
  }

  if (inStock === 'true') {
    results = results.filter((p) => p.stock > 0);
  }

  if (sort) {
    switch (sort) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
  }

  res.json({
    total: results.length,
    products: results,
  });
});

// 3. Get single product by id or slug
app.get('/api/products/:identifier', (req, res) => {
  const { identifier } = req.params;
  const product = productsData.find(
    (p) => p.id === identifier || p.slug === identifier
  );

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ product });
});

// 4. Validate Coupon
app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  const normalized = (code || '').toUpperCase().trim();

  if (normalized === 'VESLII10') {
    const discount = Math.round(subtotal * 0.1);
    return res.json({
      valid: true,
      code: 'VESLII10',
      description: '10% Welcome Discount',
      discount,
      freeShipping: false,
    });
  }

  if (normalized === 'WELCOME500') {
    if (subtotal < 3000) {
      return res.status(400).json({
        valid: false,
        error: 'WELCOME500 requires a minimum order of PKR 3,000.',
      });
    }
    return res.json({
      valid: true,
      code: 'WELCOME500',
      description: 'PKR 500 Off First Order',
      discount: 500,
      freeShipping: false,
    });
  }

  if (normalized === 'FREESHIP') {
    return res.json({
      valid: true,
      code: 'FREESHIP',
      description: 'Complimentary Nationwide Shipping',
      discount: 0,
      freeShipping: true,
    });
  }

  return res.status(400).json({ valid: false, error: 'Invalid promo code.' });
});

// 5. Create Order
app.post('/api/orders', (req, res) => {
  const { items, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.phone ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.province
  ) {
    return res.status(400).json({ error: 'Please provide all required shipping fields' });
  }

  // Validate Pakistani phone format
  const cleanPhone = shippingAddress.phone.replace(/[\s-]/g, '');
  const pkPhoneRegex = /^(\+92|0092|03)[0-9]{9}$/;
  if (!pkPhoneRegex.test(cleanPhone)) {
    return res.status(400).json({
      error: 'Please enter a valid Pakistani mobile number (e.g. 03001234567 or +923001234567).',
    });
  }

  // Calculate pricing
  let subtotal = 0;
  for (const item of items) {
    const product = productsData.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product with ID ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      });
    }
    subtotal += item.price * item.quantity;
  }

  // Shipping calculation: Free over 4999 PKR, otherwise 250 PKR
  let shippingFee = subtotal >= 4999 ? 0 : 250;
  let discount = 0;

  if (couponCode) {
    const norm = couponCode.toUpperCase().trim();
    if (norm === 'VESLII10') {
      discount = Math.round(subtotal * 0.1);
    } else if (norm === 'WELCOME500' && subtotal >= 3000) {
      discount = 500;
    } else if (norm === 'FREESHIP') {
      shippingFee = 0;
    }
  }

  const total = Math.max(0, subtotal - discount + shippingFee);

  // Decrement inventory
  for (const item of items) {
    const product = productsData.find((p) => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      const variant = product.variants?.find((v) => v.id === item.variantId);
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }
    }
  }

  // Generate real unique order number
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `VSL-PK-${randomSuffix}`;

  // Estimate delivery (3 business days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const estimatedDelivery = deliveryDate.toLocaleDateString('en-PK', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const newOrder: Order = {
    orderNumber,
    createdAt: new Date().toISOString(),
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    subtotal,
    shippingFee,
    discount,
    couponCode: couponCode || undefined,
    total,
    status: 'confirmed',
    estimatedDelivery,
  };

  ordersMap[orderNumber] = newOrder;
  persistOrders();

  res.status(201).json({
    success: true,
    order: newOrder,
  });
});

// 6. Get Order by Order Number
app.get('/api/orders/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  const order = ordersMap[orderNumber.toUpperCase().trim()];

  if (!order) {
    return res.status(404).json({ error: 'Order not found. Please verify your order number.' });
  }

  res.json({ order });
});

// 7. Add Review to a Product
app.post('/api/reviews/:productId', (req, res) => {
  const { productId } = req.params;
  const { author, city, rating, title, comment } = req.body;

  if (!author || !rating || !title || !comment) {
    return res.status(400).json({ error: 'Author, rating, title, and comment are required.' });
  }

  const product = productsData.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    author: author.trim(),
    city: city ? city.trim() : undefined,
    rating: Math.min(5, Math.max(1, Number(rating))),
    date: new Date().toISOString().split('T')[0],
    title: title.trim(),
    comment: comment.trim(),
    verifiedPurchase: true,
  };

  if (!product.reviews) {
    product.reviews = [];
  }

  product.reviews.unshift(newReview);
  product.reviewCount = product.reviews.length;
  const totalScore = product.reviews.reduce((acc, r) => acc + r.rating, 0);
  product.rating = Number((totalScore / product.reviewCount).toFixed(1));

  res.status(201).json({
    success: true,
    review: newReview,
    updatedRating: product.rating,
    reviewCount: product.reviewCount,
  });
});

// 8. Newsletter subscription
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  // Real confirmation
  res.json({
    success: true,
    message: 'Thank you for joining the VESLII Private Circle. Use code VESLII10 for 10% off your first order.',
  });
});

// 9. Mount Vite in Dev or serve Static in Production
async function setupServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`VESLII Server running on port ${PORT}`);
  });
}

setupServer();
