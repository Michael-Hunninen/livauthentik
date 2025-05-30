'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const faqItems = [
  {
    question: 'How do I subscribe to a product?',
    answer: 'You can subscribe to our products by selecting the subscription option on the product page. Subscriptions come with a discount and are billed monthly. You can cancel or modify your subscription at any time through your account settings.'
  },
  {
    question: 'What are the shipping costs?',
    answer: 'We offer free shipping on all orders over $75 within the continental United States. For orders under $75, a flat shipping rate of $7.95 applies. International shipping rates vary by location and will be calculated at checkout.'
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you will receive a shipping confirmation email with tracking information. You can also view your order status and tracking details in your account dashboard under the "Orders" section.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day satisfaction guarantee on all products. If you\'re not completely satisfied, you can return unopened products for a full refund or opened products for store credit. Please contact our customer support team to initiate a return.'
  },
  {
    question: 'Are your supplements safe to use?',
    answer: 'Yes, all our supplements are formulated with premium ingredients and manufactured in FDA-registered facilities following Good Manufacturing Practices (GMP). We conduct rigorous testing for purity and potency. However, we always recommend consulting with your healthcare provider before starting any new supplement regimen.'
  }
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!formState.name || !formState.email || !formState.message) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // In a real application, this would be an API call to send the form data
      // For this example, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError('There was an error submitting your message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background/80"></div>
        </div>
        <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Get in <span className="text-accent">Touch</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                Have questions about our products or need assistance with your order? We're here to help.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="py-16 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-card rounded-xl shadow-sm p-8 border border-border/40">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
                    <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-green-800 mb-2">Thank You!</h3>
                    <p className="text-green-700">
                      Your message has been sent successfully. We'll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4">
                        {error}
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                      >
                        <option value="">Select a subject</option>
                        <option value="Product Inquiry">Product Inquiry</option>
                        <option value="Order Status">Order Status</option>
                        <option value="Returns & Refunds">Returns & Refunds</option>
                        <option value="Subscription Management">Subscription Management</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-2 border border-border rounded-md focus:ring-accent focus:border-accent bg-background text-foreground"
                        required
                      />
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-accent-foreground px-6 py-3 rounded-md hover:bg-accent/90 transition-colors flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-accent-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-card rounded-xl shadow-sm p-8 border border-border/40">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-foreground">Email</h3>
                      <p className="mt-1 text-muted-foreground">
                        <a href="mailto:support@livauthentik.com" className="hover:text-accent transition-colors">
                          support@livauthentik.com
                        </a>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        We aim to respond to all inquiries within 24 hours.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-foreground">Phone</h3>
                      <p className="mt-1 text-muted-foreground">
                        <a href="tel:+18005551234" className="hover:text-accent transition-colors">
                          +1 (800) 555-1234
                        </a>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Available Monday-Friday, 9AM-5PM EST
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-foreground">Address</h3>
                      <p className="mt-1 text-muted-foreground">
                        123 Wellness Way<br />
                        Austin, TX 78701<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl shadow-sm p-8 border border-border/40">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                  Follow Us
                </h2>
                <div className="flex space-x-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted/50 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted/50 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted/50 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted/50 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    <span className="sr-only">YouTube</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 sm:py-24 bg-muted/20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-background rounded-xl border border-border/40 shadow-sm overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer">
                      <h3 className="text-lg font-medium text-foreground">{item.question}</h3>
                      <svg className="w-5 h-5 text-accent group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Still have questions? We're here to help.
              </p>
              <Link 
                href="#contact-form" 
                className="inline-flex items-center text-accent hover:text-accent/80 transition-colors"
              >
                Contact our support team
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
