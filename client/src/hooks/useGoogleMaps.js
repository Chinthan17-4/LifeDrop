import { useState, useEffect, useCallback } from "react";

const GOOGLE_MAPS_SCRIPT_ID = "lifedrop-google-maps-script";

export function useGoogleMaps(apiKey) {
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error | missing-key

  const loadScript = useCallback(() => {
    if (!apiKey) {
      setStatus("missing-key");
      return;
    }

    // Already loaded
    if (window.google && window.google.maps) {
      setStatus("ready");
      return;
    }

    // Already a script tag in DOM
    if (document.getElementById(GOOGLE_MAPS_SCRIPT_ID)) {
      setStatus("loading");
      const checkReady = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkReady);
          setStatus("ready");
        }
      }, 100);
      return;
    }

    setStatus("loading");

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => setStatus("ready");
    script.onerror = () => setStatus("error");

    document.head.appendChild(script);
  }, [apiKey]);

  useEffect(() => {
    loadScript();
  }, [loadScript]);

  return { status, isReady: status === "ready" };
}

