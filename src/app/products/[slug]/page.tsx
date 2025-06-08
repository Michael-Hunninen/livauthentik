'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Minus, Plus, Heart, Check, ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CheckoutButton from '@/components/checkout/CheckoutButton';

// Product data - in a real app, this would come from an API or database
interface ProductVariant {
  id: string;
  name: string;
  description: string;
  price: number;
  subscriptionPrice: number;
  features: string[];
  badge?: string;
  image?: string;
}

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  description: string;
  longDescription: string;
  price: number;
  subscriptionPrice: number;
  category: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  features: string[];
  variants?: ProductVariant[];
  href: string;
  badge?: string;
  nutritionFacts?: {
    servingSize: string;
    servingsPerContainer: number;
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    colostrum: string;
  };
  howToUse?: string[];
  programDetails?: {
    duration: string;
    access: string;
    devices: string;
    updates: string;
    support: string;
  };
  subscriptionOnly?: boolean;
  regularPrice?: number;
}

const productsData: Product[] = [
  {
    id: '1',
    name: 'Devotion',
    slug: 'devotion',
    href: '/products/devotion',
    description: 'Premium Protein & Colostrum Supplement',
    longDescription: 'Our flagship supplement designed to enhance your overall wellness. Made with premium ingredients including the highest quality colostrum and protein blend to support immunity, vitality, and optimal health.',
    price: 120.00,
    subscriptionPrice: 97.00,
    category: 'Supplements',
    rating: 4.9,
    reviewCount: 124,
    image: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png',
    gallery: [
      'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png',
      '/images/devotion-lifestyle-1.jpg',
      '/images/devotion-lifestyle-2.jpg',
    ],
    features: [
      'Premium grass-fed colostrum',
      'High-quality protein blend',
      'Immune system support',
      'Enhanced recovery',
      'Improved gut health',
      'No artificial ingredients',
      'Sustainably sourced'
    ],
    variants: [
      {
        id: 'single',
        name: 'Single',
        description: '1-month supply',
        price: 120.00,
        subscriptionPrice: 97.00,
        features: ['1-month supply', 'Standard shipping'],
        image: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png'
      },
      {
        id: 'double',
        name: '2-Pack',
        description: '2-month supply',
        price: 194.00,
        subscriptionPrice: 184.00,
        features: ['2-month supply', 'Save $46', 'Free priority shipping'],
        badge: 'POPULAR',
        image: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e596ce73703ec16efedb3.png'
      },
      {
        id: 'family',
        name: 'Family',
        description: '4-month supply',
        price: 388.00,
        subscriptionPrice: 360.00,
        features: ['4-month supply', 'Save $92', 'Free express shipping', 'Best value'],
        badge: 'BEST VALUE',
        image: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e596c12775b3f22df09f1.png'
      }
    ],
    nutritionFacts: {
      servingSize: '30g (1 scoop)',
      servingsPerContainer: 30,
      calories: 120,
      protein: '20g',
      carbs: '4g',
      fat: '2g',
      colostrum: '5g'
    },
    howToUse: [
      'Mix one scoop with 8-10 oz of water, milk, or your favorite beverage',
      'Can be consumed once daily, preferably in the morning',
      'For best results, use consistently as part of a balanced diet and exercise routine'
    ]
  },
  {
    id: '2',
    name: 'Devotion Experience',
    slug: 'devotion-experience',
    href: '/products/devotion-experience',
    description: 'Mind, Body & Nutrition Program',
    longDescription: 'Transform your wellness journey with our comprehensive digital program that combines nutrition guidance, mindfulness practices, and expert coaching to help you achieve optimal health and vitality. Subscription includes ongoing support and content updates.',
    price: 150.00,
    subscriptionPrice: 150.00,
    subscriptionOnly: true,
    category: 'Digital Program',
    rating: 4.9,
    reviewCount: 87,
    image: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png',
    gallery: [
      'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png',
      '/images/experience-sample-1.jpg',
      '/images/experience-sample-2.jpg'
    ],
    features: [
      'Personalized nutrition plans',
      'Guided mindfulness practices',
      'Expert coaching sessions',
      'Community support',
      'Exclusive content access',
      'Monthly live Q&A sessions',
      'Ongoing program updates'
    ],
    programDetails: {
      duration: 'Ongoing',
      access: 'Full',
      devices: 'Mobile, tablet, desktop',
      updates: 'Weekly',
      support: 'Email, community, live sessions'
    }
  },
  {
    id: '3',
    name: 'Ultimate Devotion Bundle',
    slug: 'ultimate-devotion-bundle',
    href: '/products/ultimate-devotion-bundle',
    description: 'Complete Wellness System',
    longDescription: 'Experience the full power of the LivAuthentik ecosystem with our premium bundle that includes both the Devotion supplement and the complete Devotion Experience program at a special value.',
    price: 270.00,
    subscriptionPrice: 249.00,
    category: 'Bundles',
    rating: 5.0,
    reviewCount: 42,
    image: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png',
    gallery: [
      'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png',
      '/images/devotion-package.jpg',
      '/images/devotion-scoop.jpg'
    ],
    features: [
      'Devotion supplement (customizable monthly supply)',
      'Full access to Devotion Experience program',
      'Priority customer support',
      'Exclusive wellness consultation',
      'Special bundle savings',
      'Digital starter guide',
      'Access to member community'
    ],
    variants: [
      {
        id: 'one-bag',
        name: '1 Bag',
        description: '1 bag per month',
        price: 249.00,
        subscriptionPrice: 249.00,
        features: ['1 bag monthly', 'Full digital access', 'Free shipping']
      },
      {
        id: 'two-bag',
        name: '2 Bags',
        description: '2 bags per month',
        price: 270.00,
        subscriptionPrice: 249.00,
        features: ['2 bags monthly', 'Full digital access', 'Save $20', 'Free express shipping'],
        badge: 'BEST DEAL'
      }
    ],
    regularPrice: 299.00
  }
];

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;

  // State variables
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [isSubscription, setIsSubscription] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Find product by href
  const product = productsData.find((p) => p.href === `/products/${productSlug}`);
  console.log('Product slug:', productSlug);
  console.log('Looking for href:', `/products/${productSlug}`);
  console.log('Available products:', productsData.map((p) => p.href));

  // Handle cases where product is not found
  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you are looking for does not exist.</p>
          <Button asChild>
            <Link href="/products">Return to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Set default selected variant if product has variants
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0].id);
    }
    
    // Set default subscription state based on product
    if (product.subscriptionOnly) {
      setIsSubscription(true);
    }
  }, [product]);

  // Find the current variant
  const currentVariant = product.variants?.find(v => v.id === selectedVariant) || product.variants?.[0];
  
  // Initialize router
  const router = useRouter();

  // Get cart functions
  const { addToCart, openCart } = useCart();

  // Handle add to cart
  const handleAddToCart = () => {
    const productToAdd = {
      id: currentVariant?.id || product.id,
      name: product.name,
      price: isSubscription && currentVariant?.subscriptionPrice ? currentVariant.subscriptionPrice : currentVariant?.price || product.price,
      imageSrc: currentVariant?.image || product.image,
      imageAlt: product.name,
      description: currentVariant?.description || product.description,
    };

    addToCart(productToAdd, quantity, isSubscription);
    setIsAddedToCart(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };
  
  // Handle buy now - bypass cart and go directly to checkout with current product
  const handleBuyNow = () => {
    // Create a properly formatted product with all required fields
    const variantName = currentVariant?.name || '';
    const productId = currentVariant?.id || product.id;
    
    // Generate a unique cart item ID just like in the cart
    const cartItemId = `${productId}-${variantName}-${isSubscription ? 'sub' : 'one'}`;
    
    // Create the full product object for checkout
    const directCheckoutItem = {
      items: [{
        id: productId,
        name: variantName ? `${product.name} - ${variantName}` : product.name,
        price: isSubscription && currentVariant?.subscriptionPrice !== undefined
          ? currentVariant.subscriptionPrice 
          : currentVariant?.price !== undefined
            ? currentVariant.price 
            : product.price,
        imageSrc: currentVariant?.image || product.image,
        imageAlt: product.name,
        description: currentVariant?.description || product.description,
        quantity: quantity,
        isSubscription: isSubscription,
        variant: variantName,
        cartItemId: cartItemId,
        subscriptionPrice: currentVariant?.subscriptionPrice || product.subscriptionPrice
      }]
    };
    
    // Clear any previous direct checkout data first
    localStorage.removeItem('livauthentik-direct-checkout');
    
    // Store this item separately from the cart for direct checkout
    localStorage.setItem('livauthentik-direct-checkout', JSON.stringify(directCheckoutItem));
    console.log('Buy Now: Stored direct checkout item', directCheckoutItem);
    
    // Navigate directly to checkout - no cart interaction
    router.push('/checkout?direct=true');
  };

  // Calculate the current price based on subscription and variant
  const getCurrentPrice = () => {
    const price = isSubscription && currentVariant?.subscriptionPrice !== undefined
      ? currentVariant.subscriptionPrice 
      : currentVariant?.price !== undefined
        ? currentVariant.price 
        : product.price;
    return formatPrice(price * quantity);
  };

  return (
    <div className="relative">
      <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="fixed inset-0 -z-10">
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: 'url(https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67bf7ffd1185a5e16e45e460.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-40 z-0" />
      <div className="absolute bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl opacity-30 z-0" />
      <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Product Images - Sticky */}
          <div className="mb-12 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-accent/5 via-background/50 to-accent/5 shadow-xl aspect-square mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-accent/5 z-10" />
              <Image
                src={currentVariant?.image || (product.gallery ? product.gallery[mainImage] : product.image)}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl"
                priority
              />
              {product.badge && (
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-medium shadow-lg border border-accent/20">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">
                      {product.badge}
                    </span>
                  </span>
                </div>
              )}
            </div>
            {product.gallery && product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.gallery.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setMainImage(index)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                      mainImage === index 
                        ? 'ring-2 ring-accent/80 ring-offset-2 ring-offset-background/50 shadow-lg shadow-accent/20' 
                        : 'ring-1 ring-white/10 hover:ring-accent/40 hover:ring-2'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-accent/5 z-10" />
                    <Image
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-white/80 hover:text-white transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-white/60">/</span>
                    <Link href="/shop" className="text-white/80 hover:text-white transition-colors duration-300">
                      Shop
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-white/60">/</span>
                    <span className="text-white/90 font-light">
                      {product.name}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-serif font-light mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 drop-shadow-sm">
                {product.name}
              </span>
            </h1>
            <p className="text-lg text-white/90 font-light mb-6">
              {product.description}
            </p>

            {product.rating > 0 && (
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`${
                        product.rating > rating ? 'text-amber-400' : 'text-muted-foreground/30'
                      } h-5 w-5 flex-shrink-0`}
                      aria-hidden="true"
                      fill={product.rating > rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-white/90">
                  {product.rating} ({product.reviewCount} reviews)
                </p>
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl md:text-4xl font-serif font-light bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">
                  {getCurrentPrice()}
                </span>
                {isSubscription && currentVariant?.subscriptionPrice && (
                  <span className="text-base font-light text-white/70 line-through">
                    {formatPrice(currentVariant.price)}
                  </span>
                )}
                {!isSubscription && product.regularPrice && product.regularPrice > product.price && (
                  <span className="text-base font-light text-white/70 line-through">
                    {formatPrice(product.regularPrice)}
                  </span>
                )}
                {isSubscription && (
                  <span className="ml-2 text-sm font-medium bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full">
                    Save {Math.round((1 - (currentVariant?.subscriptionPrice || product.subscriptionPrice || 0) / (currentVariant?.price || product.price)) * 100)}% with subscription
                  </span>
                )}
              </div>
              {isSubscription && (
                <p className="text-sm text-white/90">
                  Billed monthly. Cancel anytime.
                </p>
              )}
            </div>

            <p className="text-lg text-white/90 mb-6 backdrop-blur-sm bg-black/20 p-4 rounded-lg shadow-inner">
              {product.longDescription}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-2">Select Option</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button 
                      key={variant.id} 
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`w-full text-left border rounded-lg p-3 transition-colors ${
                        selectedVariant === variant.id
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-foreground/20 hover:bg-foreground/5'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-white">
                          {variant.name}
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm font-medium">
                            <span className="text-white">
                              {isSubscription && variant.subscriptionPrice 
                                ? formatPrice(variant.subscriptionPrice)
                                : formatPrice(variant.price)
                              }
                            </span>
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subscription Toggle */}
            {!product.subscriptionOnly && (
              <div className="mb-6 p-5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-white">
                        Subscribe & Save
                      </h3>
                      {isSubscription && (
                        <span className="ml-2 text-xs font-medium bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
                          Save {Math.round((1 - (currentVariant?.subscriptionPrice || product.subscriptionPrice || 0) / (currentVariant?.price || product.price)) * 100)}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/80 mt-1">
                      {isSubscription ? 'Delivered monthly. Cancel anytime.' : 'One-time purchase'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`${
                      isSubscription ? 'bg-accent' : 'bg-white/10'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background`}
                    role="switch"
                    aria-checked={isSubscription}
                    onClick={() => setIsSubscription(!isSubscription)}
                  >
                    <span className="sr-only">Toggle subscription</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        isSubscription ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out`}
                    />
                  </button>
                </div>
                {isSubscription && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/80">
                      First order ships immediately. Future orders can be managed from your account.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-white mb-3">Quantity</h3>
              <div className="flex items-center">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 border border-white/20 bg-white/10 rounded-l-xl text-white hover:bg-white/20 hover:border-accent/50 hover:text-accent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
                >
                  <span className="sr-only">Decrease quantity</span>
                  <Minus className="h-4 w-4" />
                </motion.button>
                <span className="px-5 py-2.5 border-t border-b border-white/20 text-sm font-medium text-white bg-white/10">
                  {quantity}
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 border border-white/20 border-l-0 bg-white/10 rounded-r-xl text-white hover:bg-white/20 hover:border-accent/50 hover:text-accent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
                >
                  <span className="sr-only">Increase quantity</span>
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
              <p className="text-sm text-white/90 mt-2">
                Total: <span className="text-accent font-medium">{getCurrentPrice()}</span>
              </p>
            </div>
            
            {/* Checkout Buttons - Moved below the product details */}
            <div className="mt-8 space-y-2">
              <Button 
                className="w-full h-12 text-sm font-medium bg-gradient-to-r from-accent via-amber-500 to-accent/80 hover:from-accent/90 hover:via-amber-500/90 hover:to-accent/90 transition-all duration-300 shadow-md shadow-accent/20 hover:shadow-accent/30"
                onClick={handleBuyNow}
              >
                <ShoppingBag className="mr-1.5 h-4 w-4" />
                Buy Now
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 text-sm font-medium border-white/20 hover:border-accent/50 hover:bg-white/5 transition-all duration-300" 
                size="sm"
                onClick={() => {
                  const productToAdd = {
                    id: currentVariant?.id || product.id,
                    name: product.name,
                    price: isSubscription && currentVariant?.subscriptionPrice ? 
                      currentVariant.subscriptionPrice : 
                      currentVariant?.price || product.price,
                    imageSrc: currentVariant?.image || product.image,
                    imageAlt: product.name,
                    description: currentVariant?.description || product.description
                  };
                  // Add to cart and automatically open the cart drawer
                  addToCart(productToAdd, quantity, isSubscription);
                  openCart();
                }}
              >
                <ShoppingBag className="h-4 w-4 mr-1.5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Product Information Section */}
    <div className="py-20 bg-gradient-to-b from-background/90 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-cinzel font-light text-center mb-12">
          <span className="text-accent">Product</span> Information
        </h2>
        
        {/* Product Tabs */}
        <div className="max-w-5xl mx-auto bg-background/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          <div className="border-b border-border">
            <nav className="flex space-x-1 px-2 pt-2" role="tablist">
              {[
                { id: 'description', label: 'Description' },
                { id: 'features', label: 'Features' },
                ...(product.howToUse ? [{ id: 'how-to-use', label: 'How to Use' }] : []),
                ...(product.nutritionFacts ? [{ id: 'nutrition-facts', label: 'Nutrition Facts' }] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 rounded-t-lg font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-accent font-semibold border-b-2 border-accent'
                      : 'font-medium hover:text-accent hover:bg-white/5'
                  }`}
                  style={{ color: activeTab === tab.id ? '' : '#3d2e25' }}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  id={`${tab.id}-tab`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-8 backdrop-blur-sm rounded-b-lg rounded-tr-lg shadow-inner" style={{ backgroundColor: 'rgba(61, 46, 37, 0.6)' }}>
            <div className="prose max-w-none">
              {activeTab === 'description' && (
                <div id="description-panel" role="tabpanel" aria-labelledby="description-tab">
                  <h3 className="text-xl font-serif font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-white">Product Description</h3>
                  <p className="text-white/90">{product.longDescription}</p>
                </div>
              )}

              {activeTab === 'features' && (
                <div id="features-panel" role="tabpanel" aria-labelledby="features-tab">
                  <h3 className="text-xl font-serif font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-white">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: '#3d2e25' }} />
                        <span className="text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'how-to-use' && product.howToUse && (
                <div id="how-to-use-panel" role="tabpanel" aria-labelledby="how-to-use-tab">
                  <h3 className="text-xl font-serif font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-white">How to Use</h3>
                  <ol className="space-y-3">
                    {product.howToUse.map((step, index) => (
                      <li key={index} className="flex">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#3d2e25]/10 text-[#3d2e25] font-medium text-sm mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-white/90">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeTab === 'nutrition-facts' && product.nutritionFacts && (
                <div id="nutrition-facts-panel" role="tabpanel" aria-labelledby="nutrition-facts-tab">
                  <h3 className="text-xl font-serif font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-white">Nutrition Facts</h3>
                  <div className="border border-white/10 rounded-lg p-6 bg-white/5">
                    <h4 className="text-lg font-medium mb-4 text-white">Nutrition Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/80">Serving Size:</span>
                        <span className="text-white">{product.nutritionFacts.servingSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Servings Per Container:</span>
                        <span className="text-white">{product.nutritionFacts.servingsPerContainer}</span>
                      </div>
                      <div className="h-px bg-white/10 my-3"></div>
                      <div className="flex justify-between font-medium">
                        <span>Calories</span>
                        <span>{product.nutritionFacts.calories}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2"></div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Protein</span>
                        <span className="text-white">{product.nutritionFacts.protein}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Carbohydrates</span>
                        <span className="text-white">{product.nutritionFacts.carbs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Fat</span>
                        <span className="text-white">{product.nutritionFacts.fat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Colostrum</span>
                        <span className="text-white">{product.nutritionFacts.colostrum}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
