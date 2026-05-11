// CSS optimization utilities

export const criticalCSS = `
  /* Critical CSS for above-the-fold content */
  .min-h-screen { min-height: 100vh; }
  .bg-slate-900 { background-color: rgb(15 23 42); }
  .text-white { color: rgb(255 255 255); }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
`;

export const preloadCriticalStyles = () => {
  if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }
};

export const loadNonCriticalCSS = () => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles.css';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  }
};