import React, { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  adClient?: string;
  adSlot?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  adClient = 'ca-pub-7606917595989618',
  adSlot = '1234567890',
  adFormat = 'horizontal',
  fullWidthResponsive = true,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    try {
      if (!pushedRef.current && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (e) {
      console.warn('AdSense render error:', e);
    }
  }, []);

  return (
    <div className="adsense-container">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '90px' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
};
