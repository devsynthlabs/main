import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Loader2 } from 'lucide-react';

interface PackageInfo {
  id: string;
  title: string;
  slug: string;
}

interface CountryInfo {
  id: string;
  name: string;
  title?: string | null;
  description?: string | null;
  image?: { url: string } | null;
  packages: PackageInfo[];
}

// Removed hardcoded fallback data to strictly use API response

export const ResponsiveHero = ({ initialCountries }: { initialCountries?: CountryInfo[] }) => {
  const [countries, setCountries] = useState<CountryInfo[]>(initialCountries || []);
  const [loading, setLoading] = useState(!initialCountries);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', watchDrag: true, duration: 60 },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!initialCountries || initialCountries.length === 0) {
      fetch('/api/countries')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setCountries(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch countries client-side:', err);
          setLoading(false);
        });
    }
  }, [initialCountries]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();

    // Custom logic to resume autoplay after 5 seconds of inactivity
    let resumeTimeout: NodeJS.Timeout;
    const onPointerDown = () => {
      const autoplay = emblaApi?.plugins()?.autoplay;
      if (!autoplay) return;
      
      // The plugin stops automatically on interaction. We just need to schedule a resume.
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        autoplay.play();
      }, 5000);
    };

    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('pointerUp', onPointerDown); // Reset timer on release too

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('pointerDown', onPointerDown);
      emblaApi.off('pointerUp', onPointerDown);
      clearTimeout(resumeTimeout);
    };
  }, [emblaApi]);

  const displayCountries = countries;

  if (loading) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#EBB337] animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP VIEW (>=1024px) */}
      <div className="hidden lg:flex h-full w-full relative overflow-hidden font-poppins">
        {/* Middle Divider */}
        {displayCountries.length > 1 && (
          <div className="absolute top-0 bottom-0 left-1/2 w-[3px] -translate-x-1/2 bg-[#EBB337] z-40"></div>
        )}

        {displayCountries.slice(0, 2).map((country, idx) => {
          const countrySlug = country.name.toLowerCase().replace(/\s+/g, '');
          const bgImage = country.image?.url 
            ? `url('${country.image.url}')` 
            : (idx === 0 ? "url('/IMAGE/Landing%20page/TAJ.png')" : "url('/IMAGE/Landing%20page/SRI.png')");
          const subtitle = country.title || '';
          const description = country.description || '';
          const packages = country.packages || [];

          return (
            <div key={country.id} className="w-1/2 h-full relative group cursor-default overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out group-hover:scale-110"
                style={{ backgroundImage: bgImage }}
              />
              
              <div className="absolute bottom-16 left-16 right-12 z-10 flex flex-col items-start text-white">
                <p className="text-[#EBB337] text-xs font-semibold tracking-[0.2em] mb-3 uppercase">
                  {subtitle}
                </p>
                <Link to={`/${countrySlug}`} className="hover:opacity-90 transition-opacity">
                  <h2 
                    className="mb-8 font-poppins text-white"
                    style={{ fontWeight: 500, fontSize: '74.11px', lineHeight: '100%' }}
                  >
                    {country.name}
                  </h2>
                </Link>
                
                <div className="flex flex-wrap gap-3 mb-8 w-full">
                  {packages.map((pkg) => (
                    <Link 
                      key={pkg.id} 
                      to={`/package/${countrySlug}/${pkg.slug}`}
                      className="px-4 py-1.5 rounded-full border border-white/60 text-[12px] font-light backdrop-blur-sm hover:bg-white/10 transition-colors whitespace-nowrap"
                    >
                      {pkg.title}
                    </Link>
                  ))}
                </div>
                
                <p className="max-w-md text-gray-200 text-sm leading-relaxed mb-10 font-light">
                  {description}
                </p>
                
                <Link 
                  to={`/${countrySlug}`} 
                  className="px-6 py-3 text-sm font-medium rounded border border-[#EBB337] text-[#EBB337] hover:bg-[#EBB337] hover:text-black transition-all duration-300"
                >
                  BEGIN YOUR JOURNEY &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE / TABLET VIEW (<1024px) */}
      <div className="relative lg:hidden h-full w-full font-poppins bg-black">
        {/* Scroll Indicator */}
        <button 
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white transition-colors animate-pulse p-2 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        
        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full w-full touch-pan-y">
          
          {displayCountries.map((country, idx) => {
            const countrySlug = country.name.toLowerCase().replace(/\s+/g, '');
            const bgImage = country.image?.url 
              ? `url('${country.image.url}')` 
              : (idx === 0 ? "url('/IMAGE/Landing%20page/TAJ.png')" : "url('/IMAGE/Landing%20page/SRI.png')");
            const subtitle = country.title || '';
            const description = country.description || '';
            const packages = country.packages || [];

            return (
              <div key={country.id} className="relative flex-[0_0_100vw] h-full min-w-0 overflow-hidden">
                {/* Background Image with slight scale animation on active */}
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out origin-right ${selectedIndex === idx ? 'scale-100' : 'scale-110'}`}
                  style={{ backgroundImage: bgImage }}
                />
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                
                {/* Animated Content */}
                <div className={`absolute bottom-12 left-6 right-6 z-10 flex flex-col items-start text-white transition-all duration-[800ms] delay-100 ease-out transform ${selectedIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  <p className="text-[#EBB337] text-xs font-semibold tracking-[0.2em] mb-2 uppercase">
                    {subtitle}
                  </p>
                  <Link to={`/${countrySlug}`} className="hover:opacity-90 transition-opacity">
                    <h2 className="mb-6 font-poppins text-white" style={{ fontWeight: 500, fontSize: '56px', lineHeight: '100%' }}>
                      {country.name}
                    </h2>
                  </Link>
                  
                  <div className="flex flex-wrap gap-1.5 mb-6 max-w-full">
                    {packages.map((pkg) => (
                      <Link 
                        key={pkg.id} 
                        to={`/package/${countrySlug}/${pkg.slug}`}
                        className="px-2.5 py-1 rounded-full border border-white/60 text-[10px] font-light backdrop-blur-sm bg-black/20 hover:bg-white/10 transition-colors"
                      >
                        {pkg.title}
                      </Link>
                    ))}
                  </div>
                  
                  <p className="max-w-md text-gray-200 text-sm leading-relaxed mb-8 font-light">
                    {description}
                  </p>
                  
                  <Link 
                    to={`/${countrySlug}`} 
                    className="px-6 py-3 w-full text-center text-sm font-medium rounded border border-[#EBB337] text-[#EBB337] active:bg-[#EBB337] active:text-black transition-all duration-300"
                  >
                    BEGIN YOUR JOURNEY &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
          
          </div>
        </div>
      </div>
    </>
  );
};
