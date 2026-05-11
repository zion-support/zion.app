// @/instrumentation.ts

// Import server polyfills FIRST to handle client-side globals in server context
// Immediately define self for webpack chunk loading
if (typeof global !== 'undefined' && typeof (global as any).self === 'undefined') {
  (global as any).self = global;
}
if (typeof globalThis !== 'undefined' && typeof (globalThis as any).self === 'undefined') {
  (globalThis as any).self = globalThis;
}

import './src/utils/server-polyfill';

// Conditionally import Sentry to avoid Node.js dependencies in browser
let Sentry: any = null;
let onRequestError: any = null;

async function initializeSentryOrMock() {
  if (process.env['NEXT_RUNTIME'] === 'edge') {
    console.log('instrumentation.ts: Edge runtime detected. Forcing Sentry mock.');
    const mockSentry = await import('./src/utils/sentry-mock'); // Ensure this path is correct
    Sentry = mockSentry.default;
    onRequestError = mockSentry.onRequestError; // Ensure mock provides this if used
  } else if (typeof window === 'undefined') { // Node.js server environment
    console.log('instrumentation.ts: Node.js runtime detected.');
    try {
      const shouldDisableSentry =
        process.env['SKIP_SENTRY_BUILD'] === 'true' ||
        process.env['CI'] === 'true' ||
        !process.env['SENTRY_DSN'] ||
        process.env['SENTRY_DSN']?.includes('dummy') ||
        process.env['SENTRY_DSN']?.includes('placeholder');

      if (shouldDisableSentry) {
        console.log('instrumentation.ts: Sentry DSN invalid or disabled by env var, using Sentry mock for Node.js.');
        const mockSentry = await import('./src/utils/sentry-mock');
        Sentry = mockSentry.default;
        onRequestError = mockSentry.onRequestError;
      } else {
        console.log('instrumentation.ts: Valid Sentry DSN found, attempting to load actual @sentry/nextjs for Node.js.');
        const sentryModule = await import("@sentry/nextjs");
        Sentry = sentryModule;
        // If ./sentry has specific onRequestError, it should be imported here too.
        // For now, assuming @sentry/nextjs covers it or it's not critical for this path.
        console.log('instrumentation.ts: Actual Sentry SDK loaded for Node.js.');
      }
    } catch (error) {
      console.warn('instrumentation.ts: Sentry SDK import/init failed for Node.js, falling back to mock:', error);
      const mockSentry = await import('./src/utils/sentry-mock');
      Sentry = mockSentry.default;
      onRequestError = mockSentry.onRequestError;
    }
  } else {
    // Client-side environment, Sentry is typically handled by _app.tsx or similar client-specific setup.
    // The instrumentation hook (register function) primarily runs server-side (Node or Edge).
    console.log('instrumentation.ts: Client-side context detected, Sentry init deferred to client-specific logic.');
  }
}

// Call initializeSentryOrMock at module load time.
// The register function will then use the initialized Sentry object.
// We need to handle the promise here or make register async and await this.
const sentryInitializationPromise = initializeSentryOrMock();

export { onRequestError }; // This might be null if not set by mock/actual

export async function register() {
  await sentryInitializationPromise; // Ensure initialization is complete

  console.log("instrumentation.ts: register() called");

  if (!Sentry || typeof Sentry.init !== 'function') {
    console.log("instrumentation.ts: Sentry SDK not available or not correctly initialized, skipping Sentry.init().");
    return;
  }

  const SENTRY_DSN = process.env['SENTRY_DSN'] || process.env['NEXT_PUBLIC_SENTRY_DSN'];
  const SENTRY_RELEASE = process.env['SENTRY_RELEASE'] || process.env['NEXT_PUBLIC_SENTRY_RELEASE'];
  const SENTRY_ENVIRONMENT = process.env['SENTRY_ENVIRONMENT'] || process.env['NEXT_PUBLIC_SENTRY_ENVIRONMENT'];

  // Enhanced validation for development placeholders and dummy values
  const isInvalidDsn = !SENTRY_DSN || 
    SENTRY_DSN.startsWith('YOUR_') || 
    SENTRY_DSN.startsWith('https_example') ||
    SENTRY_DSN.startsWith('https_dummy') ||
    SENTRY_DSN.includes('dummy') ||
    SENTRY_DSN.includes('placeholder') ||
    SENTRY_DSN.includes('local_build') ||
    SENTRY_DSN === 'test_sentry_dsn' ||
    SENTRY_DSN.length < 50; // Real Sentry DSNs are much longer

  if (isInvalidDsn) {
    if (process.env.NODE_ENV === 'development') {
      console.log("instrumentation.ts: Sentry disabled in development (no valid DSN configured)");
    } else {
      console.warn("instrumentation.ts: Sentry DSN not configured for production environment");
    }
    return;
  }

  console.log(`instrumentation.ts: Initializing Sentry for server-side. Release: ${SENTRY_RELEASE}, Env: ${SENTRY_ENVIRONMENT}`);

  try {
    Sentry.init({
      dsn: SENTRY_DSN!,
      release: SENTRY_RELEASE,
      environment: SENTRY_ENVIRONMENT,
      tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

      beforeSend(event: any, hint: any) {
        // Drop events without meaningful exception messages
        if (event.exception?.values?.[0]?.value === '' || event.exception?.values?.[0]?.value === undefined) {
          console.log("instrumentation.ts: Sentry event dropped due to empty exception value.");
          return null;
        }

        // Filter out common development noise
        if (process.env.NODE_ENV === 'development') {
          const errorMessage = hint.originalException?.toString() || '';
          if (errorMessage.includes('ResizeObserver') || 
              errorMessage.includes('Non-Error promise rejection captured') ||
              errorMessage.includes('Loading chunk')) {
            return null; // Skip these development-only errors
          }
        }

        return event;
      },
      
      initialScope: (scope: any) => {
        if (SENTRY_RELEASE) {
          scope.setTag("release", SENTRY_RELEASE);
        }
        if (SENTRY_ENVIRONMENT) {
          scope.setTag("environment", SENTRY_ENVIRONMENT);
        }
        scope.setTag("runtime", "server-side");
        return scope;
      },

      // Enable debug logging only in development
      debug: process.env.NODE_ENV === 'development',
      
      // Optimize for production performance
      maxBreadcrumbs: process.env.NODE_ENV === 'production' ? 50 : 100,
      attachStacktrace: true,
      sendDefaultPii: false, // Don't send personally identifiable information
    });
    
    console.log("instrumentation.ts: Server-side Sentry initialized successfully");
  } catch (error) {
    console.error("instrumentation.ts: Failed to initialize Sentry:", error);
  }
}
