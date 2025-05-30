'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
    image: '/images/devotion-product.jpg',
    gallery: [
      '/images/devotion-product.jpg',
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
        name: 'Single Pack',
        description: '1-month supply',
        price: 120.00,
        subscriptionPrice: 97.00,
        features: ['1-month supply', 'Standard shipping']
      },
      {
        id: 'double',
        name: '2-Pack',
        description: '2-month supply',
        price: 194.00,
        subscriptionPrice: 184.00,
        features: ['2-month supply', 'Save $46', 'Free priority shipping'],
        badge: 'POPULAR'
      },
      {
        id: 'family',
        name: 'Family Pack',
        description: '4-month supply',
        price: 388.00,
        subscriptionPrice: 360.00,
        features: ['4-month supply', 'Save $92', 'Free express shipping', 'Best value'],
        badge: 'BEST VALUE'
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
    image: '/images/experience-product.jpg',
    gallery: [
      '/images/experience-product.jpg',
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
    image: '/images/bundle-product.jpg',
    gallery: [
      '/images/bundle-product.jpg',
      '/images/devotion-product.jpg',
      '/images/experience-product.jpg'
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

// Format price helper
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

  // Get current variant
  const currentVariant = product.variants?.find(v => v.id === selectedVariant);
  
  // Get cart functions
  const { addToCart } = useCart();

  // Handle add to cart
  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: currentVariant ? currentVariant.price : product.price,
      subscriptionPrice: currentVariant ? currentVariant.subscriptionPrice : product.subscriptionPrice,
      imageSrc: product.image,
      imageAlt: product.name,
      quantity: quantity,
      isSubscription: isSubscription
    };

    addToCart(productToAdd, quantity, isSubscription);
    setIsAddedToCart(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };

  // Calculate the current price based on subscription and variant
  const getCurrentPrice = () => {
    if (currentVariant) {
      return isSubscription && currentVariant.subscriptionPrice 
        ? formatPrice(currentVariant.subscriptionPrice)
        : formatPrice(currentVariant.price);
    }
    
    return isSubscription && product.subscriptionPrice 
      ? formatPrice(product.subscriptionPrice)
      : formatPrice(product.price);
  };


  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Product Images */}
          <div className="mb-8 lg:mb-0">
            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square mb-4">
              <Image
                src={product.gallery ? product.gallery[mainImage] : product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-accent text-white">
                    {product.badge}
                  </Badge>
                </div>
              )}
            </div>
            {product.gallery && product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                      mainImage === index ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-muted-foreground hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-muted-foreground">/</span>
                    <Link href="/shop" className="text-muted-foreground hover:text-foreground">
                      Shop
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-muted-foreground">/</span>
                    <span className="text-foreground">{product.name}</span>
                  </div>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-foreground">
                  {getCurrentPrice()}
                </span>
                {isSubscription && product.subscriptionPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(Number(product.price))}
                  </span>
                )}
                {isSubscription && (
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    Save {Math.round(((Number(product.price) - Number(product.subscriptionPrice)) / Number(product.price)) * 100)}%
                  </Badge>
                )}
              </div>
              {isSubscription && (
                <p className="text-sm text-muted-foreground">
                  Billed monthly. Cancel anytime.
                </p>
              )}
            </div>

            <p className="text-lg text-foreground mb-6">
              {product.longDescription}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-2">Select Option</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className={`border rounded-lg p-3 transition-colors ${
                        selectedVariant === variant.id
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-foreground/20'
                      }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <button
                            onClick={() => setSelectedVariant(variant.id)}
                            className="font-medium text-foreground hover:text-accent"
                          >
                            {variant.name}
                          </button>
                          <p className="text-sm text-muted-foreground">{variant.description}</p>
                        </div>
                        {variant.badge && (
                          <Badge variant="outline" className="ml-2">
                            {variant.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm mb-3">
                          {isSubscription && variant.subscriptionPrice ? (
                            <>
                              <span className="font-medium">{formatPrice(variant.subscriptionPrice)}</span>
                              {' '}
                              <span className="text-muted-foreground line-through">{formatPrice(variant.price)}</span>
                            </>
                          ) : (
                            <span className="font-medium">{formatPrice(variant.price)}</span>
                          )}
                        </p>
                        <CheckoutButton
                          priceId={`price_${variant.id}_${product?.id || ''}${isSubscription ? '_sub' : ''}`}
                          productName={`${product?.name || ''} - ${variant.name}`}
                          isSubscription={isSubscription}
                          className="w-full py-2 text-sm rounded-md"
                          buttonText={`Buy Now - ${formatPrice(isSubscription && variant.subscriptionPrice ? variant.subscriptionPrice : variant.price)}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscription Toggle */}
            {!product.subscriptionOnly && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Subscribe & Save 20%</p>
                    <p className="text-sm text-muted-foreground">
                      {isSubscription 
                        ? 'Delivered monthly. Cancel anytime.'
                        : 'One-time purchase'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                      isSubscription ? 'bg-accent' : 'bg-foreground/20'
                    }`}
                    onClick={() => setIsSubscription(!isSubscription)}
                  >
                    <span className="sr-only">Toggle subscription</span>
                    <span
                      className={`${
                        isSubscription ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>
                {isSubscription && (
                  <div className="mt-3 p-3 bg-background rounded-md border border-green-100">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Save 20%</span> on every order. Free shipping. Cancel anytime.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Quantity</p>
                <div className="flex items-center border border-border rounded-md w-32">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center font-medium">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {(() => {
                    const price = currentVariant 
                      ? (isSubscription && currentVariant.subscriptionPrice 
                          ? currentVariant.subscriptionPrice 
                          : currentVariant.price)
                      : (isSubscription && product.subscriptionPrice 
                          ? product.subscriptionPrice 
                          : product.price);
                    return formatPrice(price * quantity);
                  })()}
                </p>
              </div>
            </div>

            {/* Checkout Buttons */}
            <div className="space-y-3">
              <CheckoutButton
                priceId={`price_${currentVariant?.id || 'default'}_${product?.id || ''}`}
                productName={product?.name || ''}
                isSubscription={false}
                className="w-full h-14 text-base bg-accent hover:bg-accent/90 transition-colors"
                buttonText="Buy Now"
              />
              {!product?.subscriptionOnly && (
                <CheckoutButton
                  priceId={`price_${currentVariant?.id || 'default'}_${product?.id || ''}_sub`}
                  productName={product?.name || ''}
                  isSubscription={true}
                  className="w-full h-14 text-base border border-accent text-accent hover:bg-accent/5"
                  buttonText="Subscribe & Save"
                />
              )}
              <Button variant="outline" className="w-full h-14 text-base" size="lg">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16 border-t border-border pt-12">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {['description', 'features', 'how-to-use', 'nutrition-facts'].map((tab) => {
                const tabName = tab.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-accent text-accent'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20'
                    }`}
                  >
                    {tabName}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-serif font-bold mb-4">Product Description</h3>
                <p className="text-muted-foreground">{product.longDescription}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="text-xl font-serif font-bold mb-6">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'how-to-use' && product.howToUse && (
              <div>
                <h3 className="text-xl font-serif font-bold mb-6">How to Use</h3>
                <ol className="space-y-3">
                  {product.howToUse.map((step, index) => (
                    <li key={index} className="flex">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-accent/10 text-accent font-medium text-sm mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === 'nutrition-facts' && product.nutritionFacts && (
              <div>
                <h3 className="text-xl font-serif font-bold mb-6">Nutrition Facts</h3>
                <div className="max-w-md border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 p-4 border-b border-border">
                    <h4 className="font-medium">Nutrition Information</h4>
                    <p className="text-sm text-muted-foreground">
                      Serving Size: {product.nutritionFacts.servingSize}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Servings Per Container: {product.nutritionFacts.servingsPerContainer}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="py-2 border-b border-border">
                      <div className="flex justify-between">
                        <span>Calories</span>
                        <span className="font-medium">{product.nutritionFacts.calories}</span>
                      </div>
                    </div>
                    <div className="py-2 border-b border-border">
                      <div className="flex justify-between">
                        <span>Protein</span>
                        <span className="font-medium">{product.nutritionFacts.protein}</span>
                      </div>
                    </div>
                    <div className="py-2 border-b border-border">
                      <div className="flex justify-between">
                        <span>Carbohydrates</span>
                        <span className="font-medium">{product.nutritionFacts.carbs}</span>
                      </div>
                    </div>
                    <div className="py-2 border-b border-border">
                      <div className="flex justify-between">
                        <span>Fat</span>
                        <span className="font-medium">{product.nutritionFacts.fat}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between">
                        <span>Colostrum</span>
                        <span className="font-medium">{product.nutritionFacts.colostrum}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
