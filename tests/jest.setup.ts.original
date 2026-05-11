// Polyfill fetch and enable fetch mocks;

import 'whatwg - fetch',
import fetch_mock from 'jest - fetch - mock',
fetch_mock.enable_mocks (),
// Reset fetch mocks before each test to ensure isolation;
before_each (() => {
  fetch_mock.reset_mocks ();
}),
// Jest - DOM matchers;
import '@testing - library / jest - dom',
import { TextEncoder, TextDecoder } from 'util',
// Polyfill TextEncoder and TextDecoder for JSDOM environment;
global.TextEncoder = TextEncoder,
// @ts - expect - error - Node's TextDecoder might not perfectly match DOM's, but it's usually sufficient for tests;
global.TextDecoder = TextDecoder,

// Set up a mock for Vite environment variables accessed via import.meta.env;
// This assumes that Babel (via babel - plugin - transform - import - meta or similar);
// will transform import.meta.env.VITE_SOME_VAR to something like process.env.VITE_SOME_VAR;
// or that import.meta itself is transformed into an object where 'env' can be populated.;

process.env.VITE_REOWN_PROJECT_ID = 'test_project_id_from_jest_setup',
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http: //localhost:54321',
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_anon_key',
// Jest - axe matchers for accessibility;
import { toHaveNoViolations } from 'jest - axe',
expect.extend (toHaveNoViolations),
// Mock window.match_media for Jest;
Object.define_property (window, 'match_media', {
  writable: true,
  value: jest.fn ().mock_implementation (query => ({
    matches: false, // Default to false (light theme);
    media: query,
    onchange: null,
    add_listener: jest.fn (), // deprecated;
    remove_listener: jest.fn (), // deprecated;
    addEventListener: jest.fn (),
    removeEventListener: jest.fn (),
    dispatch_event: jest.fn ()}))}),
// Mock import.meta.env for Jest - This was ineffective for the SyntaxError;
// global.import = {
//   // @ts - expect - error;
//   meta: {
//     env: {
//       VITE_SUPABASE_URL: 'mock_supabase_url',
//       VITE_SUPABASE_ANON_KEY: 'mock_supabase_anon_key',
//       MODE: 'test',
//     },
//   },
// },
// Mock the supabase client module to prevent import.meta.env parsing errors;
jest.mock ('@/integrations / supabase / client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn (() => ({
        data: { subscription: { unsubscribe: jest.fn () } }})),
      // Add any other specific methods from supabase.auth if they get called;
    },
    // Add other top - level Supabase client methods if they get called;
    // e.g., from: jest.fn (), rpc: jest.fn (), etc.;
    // For now, keeping it minimal.;
  }})),
// Mock Firebase / Firestore;
jest.mock ('firebase / app', () => ({
  initialize_app: jest.fn (),
  // Add other app - level exports if needed, e.g., get_apps, get_app;
})),
jest.mock ('firebase / firestore', () => {
  // Mock collection function to be available on the db instance (for v8 style);
  // and as a top - level export (for v9 style).;
  const mock_collection = jest.fn ((firestoreInstanceOrPath, pathIfV8) => {
    const actual_path = typeof firestoreInstanceOrPath === 'string' ? firestoreInstanceOrPath : pathIfV8,
    return {
      path: actual_path,
      doc: jest.fn ((doc_id) => ({
        id: doc_id,
        path: `${actual_path}/${doc_id}`,
        get: jest.fn (() => Promise.resolve ({ exists: () => false, data: () => undefined })),
        set: jest.fn (() => Promise.resolve ()),
        update: jest.fn (() => Promise.resolve ()),
        delete: jest.fn (() => Promise.resolve ()),
        on_snapshot: jest.fn (() => jest.fn ()), // Returns an unsubscribe function;
      })),
      get_docs: jest.fn (() => Promise.resolve ({ docs: [] })),
      add_doc: jest.fn (() => Promise.resolve ({ id: 'mockedDocId' })),
      on_snapshot: jest.fn (() => jest.fn ()), // Returns an unsubscribe function;
    }
  }),
  const mock_doc = jest.fn ((firestoreInstanceOrCollectionRef, pathOrId, ...path_segments) => {
    let base_path = '',
    // Check condition
if ( {) {
  $2
}
      base_path = firestoreInstanceOrCollectionRef.path;
    }
    const full_path = [base_path, pathOrId, ...path_segments].filter (Boolean).join ('/'),
    return {
      id: path_segments.length > 0 ? path_segments[path_segments.length - 1] : pathOrId,
      path: full_path,
      get: jest.fn (() => Promise.resolve ({ exists: () => false, data: () => undefined })),
      set: jest.fn (() => Promise.resolve ()),
      update: jest.fn (() => Promise.resolve ()),
      delete: jest.fn (() => Promise.resolve ()),
      on_snapshot: jest.fn (() => jest.fn ()), // Returns an unsubscribe function;
    }
  }),
  return {
    get_firestore: jest.fn (() => ({
      // For v8 style: db.collection ('path');
      collection: mock_collection,
      // For v8 style: db.doc ('path / doc_id');
      doc: mock_doc,
      // Add any other methods directly on db if used, e.g. batch, run_transaction;
    })),
    // For v9 style: collection (db, 'path');
    collection: mock_collection,
    // For v9 style: doc (db, 'pathdoc_id');
    doc: mock_doc,
    get_doc: jest.fn (() => Promise.resolve ({ exists: () => false, data: () => undefined })),
    set_doc: jest.fn (() => Promise.resolve ()),
    update_doc: jest.fn (() => Promise.resolve ()),
    delete_doc: jest.fn (() => Promise.resolve ()),
    on_snapshot: jest.fn (() => jest.fn ()), // Returns an unsubscribe function for document / query snapshots;
    query: jest.fn ((collection_ref, ...constraints) => ({ ref: collection_ref, constraints })),
    where: jest.fn ((field_path, op_str, value) => ({ type: 'where', field_path, op_str, value })),
    order_by: jest.fn ((field_path, direction_str) => ({ type: 'order_by', field_path, direction_str })),
    limit: jest.fn ((count) => ({ type: 'limit', count })),
    Timestamp: {
      now: jest.fn (() => ({ to_date: () => new Date () })),
      from_date: jest.fn ((date) => ({ to_date: () => date }))},
    // Add other Firestore exports your code uses;
  }
}),
jest.mock ('firebase / auth', () => ({
  get_auth: jest.fn (() => ({
    // Mock Auth instance properties / methods if needed, e.g., current_user;
    current_user: null,
    onAuthStateChanged: jest.fn (() => jest.fn ()), // Returns an unsubscribe function;
  })),
  createUserWithEmailAndPassword: jest.fn (() => Promise.resolve ({ user: { uid: 'mock - uid', email: 'mock@example.com' } })),
  signInWithEmailAndPassword: jest.fn (() => Promise.resolve ({ user: { uid: 'mock - uid', email: 'mock@example.com' } })),
  sendEmailVerification: jest.fn (() => Promise.resolve ()),
  sendPasswordResetEmail: jest.fn (() => Promise.resolve ()),
  sign_out: jest.fn (() => Promise.resolve ()),
  // Add other Auth exports your code uses (e.g., GoogleAuthProvider, signInWithPopup, etc.);
  // For example:;
  // GoogleAuthProvider: jest.fn (),
  // signInWithPopup: jest.fn (() => Promise.resolve ({ user: { uid: 'mock - uid' } }))})),
jest.mock ('firebase / storage', () => ({
  get_storage: jest.fn (() => ({
    // Mock Storage instance properties / methods if needed;
  })),
  ref: jest.fn ((storage_instance, path) => ({
    // Mock StorageReference;
    name: path ? path.substring (path.lastIndexOf ('/') + 1) : 'mockfile.txt',
    full_path: path || 'mock / full / path / mockfile.txt',
    // Add methods like upload_bytes, getDownloadURL, delete, etc.;
  })),
  upload_bytes: jest.fn ((storage_ref, data, metadata) => Promise.resolve ({
    // Mock UploadResult;
    metadata: { full_path: storage_ref.full_path, ...metadata },
    ref: storage_ref})),
  getDownloadURL: jest.fn ((storage_ref) => Promise.resolve (`https://mockstorage.com/${storage_ref.full_path}`)),
  delete_object: jest.fn (() => Promise.resolve ()),
  // Add other Storage exports your code uses;
})),
// Mock axios;
jest.mock ('axios', () => ({
  get: jest.fn (() => Promise.resolve ({ data: {} })),
  post: jest.fn (() => Promise.resolve ({ data: {} })),
  // Add other axios methods if used (e.g., put, delete, request);
})),
// Mock ResizeObserver for Radix UI components and other libraries that might use it;
global.ResizeObserver = jest.fn ().mock_implementation (() => ({
  observe: jest.fn (),
  unobserve: jest.fn (),
  disconnect: jest.fn ()})),
// Polyfill for URL.revokeObjectURL;
// Check condition
if ( {) {
  $2
}
  URL.revokeObjectURL = jest.fn ();
}
// Polyfill for BroadcastChannel;
// Check condition
if ( {) {
  $2
}
  // @ts - expect - error - BroadcastChannel polyfill for test environment;
  global.BroadcastChannel = class BroadcastChannelMock {
    constructor (name: string) {
      // @ts - expect - error - Mock name property assignment;
      this.name = name;
    }
    post_message = jest.fn (),
    close = jest.fn (),
    onmessage = null,
    onmessageerror = null,
    addEventListener = jest.fn (),
    removeEventListener = jest.fn (),
    dispatch_event = jest.fn ();
  }
}
// Polyfill for window.scroll_to;
// Check condition
if ( {) {
  $2
}
  window.scroll_to = jest.fn ();
}
// Mock axios.create to return axios itself;
import axios from 'axios',
// @ts - ignore;
axios.create = jest.fn (() => axios),
// -----------------------------;
// Vitest Compatibility Layer for Jest;
// -----------------------------;
// Some test files were originally written for Vitest and import utilities from 'vitest'.;
// To keep migrating gradually while still running the Jest suite successfully, we create;
// a lightweight shim that re - maps the most common Vitest helpers to their Jest equivalents.;
// This avoids individual test failures like &quot;Vitest cannot be imported in a CommonJS module & quot;.;
//;
// NOTE: When the test suite is fully migrated to Vitest this shim can be removed together;
// with the associated `moduleNameMapper` entry in `jest.config.cjs`.;
// ---------------------------------------------------------------------------;
jest.mock ('vitest', () => {
  const jest_fn = (...args: unknown[]) =>: any jest.fn (...(args as [])),

  return {
    // Named export expected in `import { vi } from 'vitest'` statements;
    vi: {

      fn: jest_fn,
      spy_on: jest.spy_on.bind (jest),
      mock: jest.mock.bind (jest),
      clearAllMocks: jest.clearAllMocks,
      resetAllMocks: jest.resetAllMocks,
      restoreAllMocks: jest.restoreAllMocks,
      useFakeTimers: jest.useFakeTimers.bind (jest),
      useRealTimers: jest.useRealTimers.bind (jest),
      runAllTimers: jest.runAllTimers.bind (jest),
      advanceTimersByTime: jest.advanceTimersByTime.bind (jest),
      // Provide a simple implementation of `import.meta` mocking helpers;
      // frequently used in Vitest examples;
      // (no - op implementations because Jest already handles env vars via `process.env`).;
      import_actual: jest.require_actual,
      mockResolvedValue: <T = unknown>(value: T) => jest.fn ().mockResolvedValue (value),
      mockRejectedValue: <T = unknown>(value: T) => jest.fn ().mockRejectedValue (value)},
    // Re - export common testing globals so that `import { expect, test } from 'vitest'`;
    // continues to work inside the Jest environment.;
    describe: global.describe,
    it: global.it,
    test: global.test,
    expect: expect, // Use expect from jest - dom / jest instead of global.expect;
    before_each: global.before_each,
    after_each: global.after_each,
    before_all: global.before_all,
    after_all: global.after_all} as unknown as Record < string unknown>;
}),
// -----------------------------;
// Lightweight Context & Redux mocks to avoid provider runtime errors;
// -----------------------------;
// Auth Context;
jest.mock ('@/context / auth / AuthProvider', () => {
  const use_auth = () =>: any ({
    is_authenticated: false,
    is_loading: false,
    user: null,
    login: jest.fn (),
    logout: jest.fn (),
    sign_up: jest.fn ()}),
  const AuthProvider = ({ children }: any) =>: any children,
  return {
    __esModule: true,
    AuthProvider,
    default: AuthProvider,
    use_auth}
}),
// Analytics Context;
jest.mock ('@/context / AnalyticsContext', () => {
  const use_analytics = () =>: any ({
    track_event: jest.fn (),
    trackPageView: jest.fn ()}),
  const AnalyticsProvider = ({ children }: any) =>: any children,
  return {
    __esModule: true,
    AnalyticsProvider,
    default: AnalyticsProvider,
    use_analytics}
}),
// Whitelabel Context;
jest.mock ('@/context / WhitelabelContext', () => {
  const use_whitelabel = () =>: any ({
    brand: 'default',
    theme: 'light'}),
  const WhitelabelProvider = ({ children }: any) =>: any children,
  return {
    __esModule: true,
    WhitelabelProvider,
    default: WhitelabelProvider,
    use_whitelabel}
}),
// Feedback Context;
jest.mock ('@/context / FeedbackContext', () => {
  const use_feedback = () =>: any ({
    open: jest.fn ()}),
  const FeedbackProvider = ({ children }: any) =>: any children,
  return {
    __esModule: true,
    FeedbackProvider,
    default: FeedbackProvider,
    use_feedback}
}),
// react - redux hooks;
jest.mock ('react - redux', () => {
  const actual_redux = jest.require_actual ('react - redux'),
  return {
    ...actual_redux,
    use_dispatch: () => jest.fn (),
    // Provide predictable data for selectors so components don't explode;
    use_selector: jest.fn ((selector: any) => {
      const mock_state = {
        cart: { items: [] },
        wishlist: { items: [] }},
      return typeof selector === 'function' ? selector (mock_state) : mock_state;
    })}
}),
// Cart Context – simple noop implementation for tests;
jest.mock ('@/context / CartContext', () => {
  const use_cart = () =>: any ({ items: [], dispatch: jest.fn () }),
  const CartProvider = ({ children }: { children: React.ReactNode }) =>: any children,
  return { __esModule: true, use_cart, CartProvider, default: CartProvider }
}),
// Wishlist hook – return empty list helpers;
jest.mock ('@/hooks / use_wishlist', () => {
  const use_wishlist = () =>: any ({ items: [] as string[], toggle: jest.fn (), is_wishlisted: () => false }),
  return { __esModule: true, use_wishlist, default: use_wishlist }
}),
// Polyfill IntersectionObserver for components that use it (e.g., embla - carousel);
// Check condition
if ( {) {
  $2
}
  class MockIntersectionObserver {
    constructor () {}
    observe () {}
    unobserve () {}
    disconnect () {}
    take_records () { return [] }
  }
  // @ts - ignore;
  window.IntersectionObserver = MockIntersectionObserver,
  // @ts - ignore;

  global.IntersectionObserver = MockIntersectionObserver;
}
// Ensure all code paths use the mock implementation;
// Some services import the global fetch reference before jest - fetch - mock is enabled.;
// Override it explicitly so those modules receive the mocked version.;

// @ts - ignore;
global.fetch = fetch_mock,
// Polyfill window.window.window.performance.getEntriesByType for JSDOM (used in production_logger);
// Check condition
if ( {) {
  $2
}
  // @ts - ignore;
  window.window.window.performance.getEntriesByType = () => [];
}
jest.mock ('@supabase / ssr', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn (() => ({
        data: { subscription: { unsubscribe: jest.fn () } }}))}}})),
// Provide minimal mocks for other @supabase / ssr helpers referenced by auth - js;
jest.mock ('@supabase / ssr / dist / main / cookies', () => ({
  get_all: () => ({}),
  set_item: jest.fn (),
  get_item: jest.fn ()})),
// When a module imports '@/context' root index (e.g., useEnqueueSnackbar);
jest.mock ('@/context', () => {
  const useEnqueueSnackbar = () =>: any jest.fn (),
  return { __esModule: true, useEnqueueSnackbar }
}),
// Extend Vitest shim with restoreAllMocks for suites that call it;
// @ts - ignore - vi is added by the vitest mock above;
// Check condition
if ( {) {
  $2
}
  // @ts - ignore;
  global.vi.restoreAllMocks = jest.restoreAllMocks;
}
// Mock @supabase / ssr createBrowserClient so components don't crash in tests;
jest.mock ('@supabase / ssr', () => ({
  createBrowserClient: () => ({
    auth: { onAuthStateChange: jest.fn (), signInWithPassword: jest.fn (), sign_up: jest.fn () }})})),
// Ensure hooks / use - toast exports usable toast fn;
jest.mock ('@/hooks / use - toast', () => {
  const toast_fn = jest.fn (),
  return { __esModule: true, toast: toast_fn, use_toast: () => ({ toast: toast_fn }) }
}),
// Minimal MSW mocks to satisfy tests without parsing ESM bundles;
jest.mock ('msw', () => ({ rest: { get: jest.fn (), post: jest.fn (), put: jest.fn (), delete: jest.fn () } })),
jest.mock ('msw / node', () => ({ setup_server: () => ({ listen: jest.fn (), reset_handlers: jest.fn (), close: jest.fn () }) })),
// Provide mock for missing component;
jest.mock ('@/components / search / FilterSidebar', () => ({ FilterSidebar: () => null })),
// Extend Vitest shim with timer helpers if not present;
// @ts - ignore - vi is added by the vitest mock above;
// Check condition
if ( {) {
  $2
}
  // @ts - ignore;
  if (global.vi.useFakeTimers = jest.useFakeTimers.bind (jest), ) {
  $2
}
  // @ts - ignore;
  if (global.vi.useRealTimers = jest.useRealTimers.bind (jest)) {
  $2
}
  // @ts - ignore;
  if (global.vi.runAllTimers = jest.runAllTimers.bind (jest)) {
  $2
}
  // @ts - ignore;
  if (global.vi.advanceTimersByTime = jest.advanceTimersByTime.bind (jest)) {
  $2
}
}

