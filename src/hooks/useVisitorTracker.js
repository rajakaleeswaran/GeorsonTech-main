import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';
import { supabase } from '../lib/supabase';

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
    const currentPath = window.location.pathname;

    // Session deduplication check (prevent logging exact same path within 10 seconds)
    try {
      const lastTracked = sessionStorage.getItem('last_visit_track');
      if (lastTracked) {
        const parsed = JSON.parse(lastTracked);
        if (parsed.path === currentPath && (Date.now() - parsed.time) < 10000) {
          return; // Skip duplicate hit within 10 seconds
        }
      }
      sessionStorage.setItem('last_visit_track', JSON.stringify({ path: currentPath, time: Date.now() }));
    } catch (_) {}

    const trackingData = {
      url: currentPath,
      referrer: document.referrer || null,
      browser: getBrowserName(),
      device: getDeviceName(),
      country: 'India'
    };

    // 1. Try local Express backend
    fetch(`${API_BASE_URL}/visitor/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackingData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Express track failed');
      })
      .catch(async () => {
        // 2. Supabase fallback if Express backend is offline / on Vercel
        try {
          await supabase
            .from('visitor_logs')
            .insert([{
              ip_address: '127.0.0.1',
              url: trackingData.url,
              country: trackingData.country,
              device: trackingData.device,
              browser: trackingData.browser,
              referrer: trackingData.referrer
            }]);
        } catch (_) {
          console.log('Visitor tracking unavailable.');
        }
      });
  }, [location.pathname]);
}


