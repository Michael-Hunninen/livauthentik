'use client';

import { motion } from 'framer-motion';
import { TestimonialCarousel } from '@/components/testimonial-carousel';

export const HomeTestimonials = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-accent/5"></div>
        <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-10 mix-blend-overlay"></div>
      </div>
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            What Our Community Says
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied customers who have transformed their lives with LivAuthentik
          </p>
        </motion.div>
        
        <div className="relative max-w-6xl mx-auto">
          <TestimonialCarousel />
        </div>
      </div>
    </section>
  );
};
