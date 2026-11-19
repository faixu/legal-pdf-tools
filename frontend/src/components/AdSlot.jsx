import { useEffect, useRef } from 'react'

/**
 * AdSense-compliant ad slot component.
 * Placeholder for Google AdSense auto-ads or manual ad units.
 * Never overlaps interactive elements. Positioned between content sections.
 */
export default function AdSlot({ slotName = 'content', className = '' }) {
  const adRef = useRef(null)

  useEffect(() => {
    // Initialize AdSense auto-ads if available
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({})
      } catch (e) {
        // AdSense not loaded or blocked
      }
    }
  }, [])

  // In production, replace with actual AdSense ad unit code:
  // <ins className="adsbygoogle"
  //      style={{ display: 'block' }}
  //      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  //      data-ad-slot="XXXXXXXXXX"
  //      data-ad-format="auto"
  //      data-full-width-responsive="true">
  // </ins>

  return (
    <div
      ref={adRef}
      className={`ad-slot ${className}`}
      role="complementary"
      aria-label="Advertisement"
      data-ad-slot={slotName}
    >
      <div className="text-center">
        <span className="text-neutral-400 text-sm font-medium">Advertisement</span>
        {/*
           In production, this would be replaced by actual AdSense code:
           <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
           <ins className="adsbygoogle" style={{display:'block'}} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins>
           <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        */}
      </div>
    </div>
  )
}