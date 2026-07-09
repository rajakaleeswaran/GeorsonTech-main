import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Mozilla Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Internet";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Trident")) return "Internet Explorer";
  if (ua.includes("Edge") || ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("Chrome")) return "Google Chrome";
  if (ua.includes("Safari")) return "Apple Safari";
  return "Unknown";
}

function getDeviceName() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

export function useVisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackingData = {
      url: window.location.pathname,
      referrer: document.referrer || null,
      browser: getBrowserName(),
      device: getDeviceName(),
      country: 'India' // Default local placeholder, can be geolocated in production via cloud flare header
    };

    fetch('http://localhost:5000/api/visitor/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackingData)
    })
      .catch(() => console.log('Local visitor tracking skipped (Offline mode)'));
  }, [location.pathname]);
}
