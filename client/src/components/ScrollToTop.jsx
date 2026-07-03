import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Extract the current location pathname index
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly reset scroll to top-left corner on route transition
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render any visible UI markup
};

export default ScrollToTop;