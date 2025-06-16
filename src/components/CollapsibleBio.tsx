'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CollapsibleBio = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && contentInnerRef.current) {
      contentRef.current.style.maxHeight = isExpanded 
        ? `${contentInnerRef.current.scrollHeight}px` 
        : '0px';
    }
  }, [isExpanded]);

  return (
    <div className="mt-6 w-full">
      <div 
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out w-full"
        style={{ maxHeight: '0px' }}
      >
        <div ref={contentInnerRef} className="w-full">
          <div className="prose prose-amber pt-4 max-w-none w-full">
            <p className="text-amber-900/90 leading-relaxed text-lg font-light mb-6">
              As <strong className="text-[#3d2e25]">teachers of A Course in Miracles for over 12 years</strong>, Brandon and Olivia have actively contributed to the <em>Foundation for Inner Peace</em>, demonstrating their deep commitment to personal growth and spiritual education. Their collaborative approach allows them to combine their unique insights to guide individuals toward <strong className="text-[#3d2e25]">profound self-discovery and empowerment</strong>.
            </p>
            
            <p className="text-amber-900/90 leading-relaxed text-lg font-light mb-6">
              Their expertise has garnered recognition across <strong className="text-[#3d2e25]">various media platforms</strong>, including <em>VH1, ABC, ESPN, and USA Today</em>. They've worked with an impressive client roster featuring individuals like <strong className="text-[#3d2e25]">Ohio State quarterback Braxton Miller</strong>, entrepreneur <strong className="text-[#3d2e25]">Jordyn Woods</strong>, and former mayor of Columbus, <strong className="text-[#3d2e25]">Michael Coleman</strong>, among other notable figures.
            </p>
            
            <div className="mb-6">
              <p className="text-amber-900/90 leading-relaxed text-lg font-light mb-2">
                Brandon and Olivia have delivered <strong className="text-[#3d2e25]">impactful presentations</strong> to numerous esteemed organizations, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-amber-900/90 text-lg font-light">
                <li>Ohio State University</li>
                <li>Nationwide Insurance</li>
                <li>Whole Foods Market</li>
                <li>Berklee College of Music</li>
                <li>And many more educational and corporate institutions</li>
              </ul>
            </div>
            
            <p className="text-amber-900/90 leading-relaxed text-lg font-light mb-6">
              With <strong className="text-[#3d2e25]">17 years and over 48,960 hours of experience</strong>, their combined expertise has helped clients generate <strong className="text-[#3d2e25]">more than $200 million in sales</strong> through self-mastery and effective leadership, emphasizing <em>sustainable success over hustle and grind</em>. They are co-authors of the book <em>"Dare to Succeed"</em> with Jack Canfield and were recognized in <strong className="text-[#3d2e25]">2013 as leading experts</strong> in personal development and leadership.
            </p>
            
            <p className="text-amber-900/90 leading-relaxed text-lg font-light">
              Their commitment to <strong className="text-[#3d2e25]">personal growth</strong> is evident through their mentorship and certifications by renowned experts like <strong className="text-[#3d2e25]">Bob Proctor</strong>. Brandon is a <em>certified Holistic Health Practitioner</em> from the Chek Institute, and both are <em>certified leadership development consultants</em> with Giant Worldwide. Having coached clients in <strong className="text-[#3d2e25]">14 countries</strong> and delivered <strong className="text-[#3d2e25]">500+ keynotes</strong>, they balance professional excellence with a fulfilling personal life—happily married for <strong className="text-[#3d2e25]">11 years</strong> and proud parents of <strong className="text-[#3d2e25]">five children</strong>. Together, they invite you to unlock your <strong className="text-[#3d2e25]">extraordinary potential</strong> through the power of self-mastery.
            </p>
          </div>
        </div>
      </div>
      
      <button 
        className="mt-6 flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors duration-200 group"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="collapsible-bio-content"
      >
        <span className="mr-2">Read {isExpanded ? 'Less' : 'More'}</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 transition-transform duration-300" />
        ) : (
          <ChevronDown className="w-4 h-4 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
};

export default CollapsibleBio;
