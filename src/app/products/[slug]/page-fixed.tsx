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
        price: 270.00,
        subscriptionPrice: 249.00,
        features: ['1 bag of Devotion per month', 'Full Experience program access']
      },
      {
        id: 'two-bags',
        name: '2 Bags',
        description: '2 bags per month',
        price: 449.00,
        subscriptionPrice: 449.00,
        features: ['2 bags of Devotion per month', 'Full Experience program access', 'Free priority shipping']
      },
      {
        id: 'family',
        name: 'Family Pack',
        description: '4 bags per month',
        price: 849.00,
        subscriptionPrice: 849.00,
        features: ['4 bags of Devotion per month', 'Family Experience program access (up to 4 accounts)', 'Free express shipping', 'Personal wellness coach'],
        badge: 'BEST VALUE'
      }
    ]
  }
];

// Format price helper
const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | undefined>();
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | undefined>();
  const [activeTab, setActiveTab] = useState('description');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  // Fetch product data
  useEffect(() => {
    if (params.slug) {
      const foundProduct = productsData.find(p => p.slug === params.slug);
      setProduct(foundProduct);
      
      // If product has variants, set the first one as default
      if (foundProduct?.variants && foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0].id);
        setCurrentVariant(foundProduct.variants[0]);
      }
      
      // If product is subscription only, enable subscription by default
      if (foundProduct?.subscriptionOnly) {
        setIsSubscription(true);
      }
    }
  }, [params.slug]);
  
  // Update current variant when selected variant changes
  useEffect(() => {
    if (product?.variants && selectedVariant) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      setCurrentVariant(variant);
    }
  }, [selectedVariant, product]);
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    const item = {
      id: currentVariant ? `${product.id}-${currentVariant.id}` : product.id.toString(),
      name: product.name,
      variant: currentVariant ? currentVariant.name : undefined,
      price: currentVariant 
        ? (isSubscription && currentVariant.subscriptionPrice ? currentVariant.subscriptionPrice : currentVariant.price)
        : (isSubscription && product.subscriptionPrice ? product.subscriptionPrice : product.price),
      quantity,
      image: product.image,
      isSubscription
    };
    
    addToCart(item);
    setIsAddedToCart(true);
    
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };
  
  // Get formatted current price based on variant and subscription status
  const getCurrentPrice = () => {
    if (!product) return '$0.00';
    
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
                src={product?.gallery ? product.gallery[mainImage] : product?.image || ''}
                alt={product?.name || 'Product image'}
                fill
                className="object-cover"
                priority
              />
              {product?.badge && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-accent text-white">
                    {product.badge}
                  </Badge>
                </div>
              )}
            </div>
            {product?.gallery && product.gallery.length > 1 && (
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
            <div className="mb-4">
              <Link 
                href="/shop" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Shop
              </Link>
            </div>
            
            <div className="mb-2">
              <Badge variant="outline" className="mb-2">
                {product?.category}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground tracking-tight md:text-4xl">
                {product?.name}
              </h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 ${
                        product && rating < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {product?.rating} ({product?.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-foreground">
                  {getCurrentPrice()}
                </span>
                {isSubscription && product?.subscriptionPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(Number(product.price))}
                  </span>
                )}
                {isSubscription && product?.price && product?.subscriptionPrice && (
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
              {product?.longDescription}
            </p>

            {/* Variant Selector */}
            {product?.variants && product.variants.length > 0 && (
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
            {!product?.subscriptionOnly && (
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
                      : (isSubscription && product?.subscriptionPrice 
                          ? product.subscriptionPrice 
                          : product?.price || 0);
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
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose prose-sm md:prose-base max-w-none text-foreground">
                <p className="text-lg">{product?.longDescription}</p>
                
                {product?.programDetails && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Program Details</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Duration</dt>
                        <dd className="mt-1 text-base">{product.programDetails.duration}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Access</dt>
                        <dd className="mt-1 text-base">{product.programDetails.access}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Compatible Devices</dt>
                        <dd className="mt-1 text-base">{product.programDetails.devices}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Updates</dt>
                        <dd className="mt-1 text-base">{product.programDetails.updates}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Support</dt>
                        <dd className="mt-1 text-base">{product.programDetails.support}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div>
                <h3 className="text-lg font-medium mb-6">Key Benefits</h3>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {product?.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-accent shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* How to Use Tab */}
            {activeTab === 'how-to-use' && product?.howToUse && (
              <div>
                <h3 className="text-lg font-medium mb-6">Usage Instructions</h3>
                <ul className="space-y-4">
                  {product.howToUse.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex items-center justify-center bg-accent/10 text-accent h-6 w-6 rounded-full text-sm font-medium mr-3 shrink-0">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutrition Facts Tab */}
            {activeTab === 'nutrition-facts' && product?.nutritionFacts && (
              <div>
                <h3 className="text-lg font-medium mb-6">Nutrition Information</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 px-4 py-3 border-b">
                    <h4 className="font-bold text-base">Nutrition Facts</h4>
                    <p className="text-sm text-muted-foreground">Serving Size: {product.nutritionFacts.servingSize}</p>
                    <p className="text-sm text-muted-foreground">Servings Per Container: {product.nutritionFacts.servingsPerContainer}</p>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 divide-y">
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Calories</span>
                        <span>{product.nutritionFacts.calories}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Protein</span>
                        <span>{product.nutritionFacts.protein}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Carbohydrates</span>
                        <span>{product.nutritionFacts.carbs}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Fat</span>
                        <span>{product.nutritionFacts.fat}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Colostrum</span>
                        <span>{product.nutritionFacts.colostrum}</span>
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
