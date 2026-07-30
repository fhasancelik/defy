/**
 * Central app configuration.
 * Rebranding? Change `appName` here + `name` in app.json — that's it.
 */
export const CONFIG = {
  appName: 'Defy',
  appTagline: 'Quit vaping & nicotine pouches. For good.',

  /**
   * RevenueCat public iOS SDK key (starts with `appl_`).
   * RevenueCat dashboard → Project → API keys → App-specific keys.
   * While this is a placeholder the app runs in MOCK BILLING mode
   * (purchases always "succeed") so you can develop in Expo Go.
   */
  revenueCatIosApiKey: 'appl_wdpJPeQgiRNkWyYGvPVNRmOsKHZ',
  entitlementId: 'Defy Pro',
  productIds: {
    monthly: 'defy_pro_monthly',
    annual: 'defy_pro_annual',
  },

  /** Deployed backend URL (the `backend/` folder in this repo). */
  apiUrl: 'https://defy-backend.example.com',

  /** Hard paywall (Quittr model). Set false for a soft paywall. */
  requirePurchase: true,

  /** Display fallbacks only — real prices come from RevenueCat offerings. */
  prices: { monthly: '$12.99', annual: '$44.99', annualMonthlyEq: '$3.75', savePct: '71%' },

  supportEmail: 'hasancelikjob@gmail.com',
  privacyUrl: 'https://defy-backend.example.com/privacy.html',
  termsUrl: 'https://defy-backend.example.com/terms.html',
} as const;
