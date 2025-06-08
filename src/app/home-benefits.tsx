'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const benefits = [
  {
    name: 'Premium Quality',
    description: 'Sourced from the finest ingredients for optimal wellness and performance.',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    name: 'Scientifically Formulated',
    description: 'Research-backed formulations that deliver measurable results you can feel.',
    icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15c-1.876 0-3.67.402-5.227 1.13L5 14.5m14.8.8l1.402 1.402c.5.5.5 1.3 0 1.8l-1.2 1.2a1.2 1.2 0 01-1.8 0l-1.4-1.4m-12.6 0l-1.4 1.4a1.2 1.2 0 01-1.8 0l-1.2-1.2a1.2 1.2 0 010-1.8l1.4-1.4m12.6 0l-1.4-1.4m-12.6 0l-1.4-1.4'
  },
  {
    name: 'Holistic Approach',
    description: 'Nourishing mind, body, and spirit for complete wellness transformation.',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    name: 'Sustainable Sourcing',
    description: 'Ethically and responsibly sourced ingredients that respect our planet.',
    icon: 'M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6z'
  }
];

export const HomeBenefits = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-beige/10 via-background to-beige/20">
      {/* Opulent background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-beige/5 via-background/90 to-beige/10"></div>
        
        {/* Organic Blob Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23caac8e' fill-opacity='0.1'%3E%3Cpath d='M400 0h400v400c0 220.5-178.5 400-400 400S0 620.5 0 400 178.5 0 400 0zm0 100c165 0 300 135 300 300S565 700 400 700 100 565 100 400 235 100 400 100z'/%3E%3Cpath d='M400 200c110.5 0 200 89.5 200 200S510.5 600 400 600 200 510.5 200 400s89.5-200 200-200zm0 50c82.8 0 150 67.2 150 150s-67.2 150-150 150S250 482.8 250 400s67.2-150 150-150z'/%3E%3Cpath d='M400 300c55.2 0 100 44.8 100 100s-44.8 100-100 100-100-44.8-100-100 44.8-100 100-100z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '800px 800px'
        }}></div>
        
        {/* Soft Cloud-like Texture */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23caac8e' fill-opacity='0.1'%3E%3Cpath d='M600 200c0 110.5-89.5 200-200 200S200 310.5 200 200 289.5 0 400 0s200 89.5 200 200z'/%3E%3Cpath d='M200 600c0 110.5 89.5 200 200 200s200-89.5 200-200S510.5 400 400 400 200 489.5 200 600z'/%3E%3Cpath d='M0 400c0 110.5 89.5 200 200 200s200-89.5 200-200S310.5 200 200 200 0 289.5 0 400z'/%3E%3Cpath d='M400 0c110.5 0 200 89.5 200 200s-89.5 200-200 200S200 310.5 200 200 289.5 0 400 0z'/%3E%3Cpath d='M600 200c0 110.5 89.5 200 200 200s200-89.5 200-200S910.5 0 800 0s-200 89.5-200 200z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '600px 600px',
          mixBlendMode: 'overlay'
        }}></div>
        
        {/* Decorative border elements */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-beige/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-beige/20 to-transparent"></div>
        
        {/* Organic corner accents */}
        <div className="absolute top-0 left-0 w-80 h-80 -translate-x-1/3 -translate-y-1/3 bg-beige/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 translate-x-1/3 translate-y-1/3 bg-beige/5 rounded-full filter blur-3xl"></div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-beige/10 via-transparent to-transparent"></div>
        
        {/* Soft dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #caac8e 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Creamy texture */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23caac8e' fill-opacity='0.05'%3E%3Cpath d='M400 0h400v400c0 220.5-178.5 400-400 400S0 620.5 0 400 178.5 0 400 0zm0 100c165 0 300 135 300 300S565 700 400 700 100 565 100 400 235 100 400 100z'/%3E%3Cpath d='M400 200c110.5 0 200 89.5 200 200S510.5 600 400 600 200 510.5 200 400 289.5 200 400 200z'/%3E%3Cpath d='M400 300c55.2 0 100 44.8 100 100s-44.8 100-100 100-100-44.8-100-100 44.8-100 100-100z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px',
          mixBlendMode: 'overlay'
        }}></div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)"></div>
        
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)"></div>
      </div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5 blur-xl"></div>
              <div className="absolute inset-0 border border-accent/10 rounded-2xl"></div>
              <div className="absolute inset-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <Image 
                  src="https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/684209cd5983922801d0fc1b.jpeg" 
                  alt="LivAuthentik Benefits" 
                  width={600} 
                  height={750} 
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-beige/30 via-beige/20 to-beige/10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-beige/60 via-beige/20 to-transparent"></div>
                <div className="absolute inset-0 bg-beige/5 mix-blend-overlay"></div>
              </div>
            </div>
            
            {/* Floating stat */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 backdrop-blur-sm bg-white/90 border border-white/20"
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-accent">94%</p>
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
              </div>
            </motion.div>
            
            {/* Floating stat */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 backdrop-blur-sm bg-white/90 border border-white/20"
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">7K+</p>
                <p className="text-sm text-muted-foreground">Lives Transformed</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side - Benefits list */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Experience the LivAuthentik Difference
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our products and programs are meticulously designed to enhance your overall wellbeing 
                through a unique blend of science, nature, and transformative practices.
              </p>
            </motion.div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="group"
                >
                  <div className="flex">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mr-4 group-hover:bg-accent/20 transition-colors duration-300">
                      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">{benefit.name}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
