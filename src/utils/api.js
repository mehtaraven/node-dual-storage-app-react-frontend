// ─────────────────────────────────────────────────────────────────────────────
// API HELPER — Wraps fetch() with automatic JWT token handling
// ─────────────────────────────────────────────────────────────────────────────
// WHY this exists:
//   Every protected API call needs the Authorization header with the JWT token.
//   Instead of repeating that logic in every component, we centralize it here.
//
// Spring equivalent: A preconfigured RestTemplate or WebClient bean with an
//   interceptor that auto-attaches the Authorization header:
//   restTemplate.getInterceptors().add((request, body, execution) -> {
//       request.getHeaders().setBearerAuth(token);
//       return execution.execute(request, body);
//   });
// ─────────────────────────────────────────────────────────────────────────────

// Your Express backend URL
// Change this if your backend runs on a different port
const API_BASE = 'http://localhost:3000/api';

/**
 * Make an API request with automatic token attachment.
 *
 * @param {string} endpoint - The path after /api (e.g., '/records', '/auth/login')
 * @param {Object} options - fetch() options (method, body, headers, etc.)
 * @returns {Object} - { data, status, ok } or null if redirected to login
 */
export async function apiRequest(endpoint, options = {}) {
    // Get the stored JWT token (saved during login)
    // localStorage persists across page refreshes (like a browser-side cookie)
    const token = localStorage.getItem('token');

    // Build headers — always include Content-Type for JSON
    // If we have a token, add the Authorization header automatically
    const headers = {
        'Content-Type': 'application/json',
        // Conditional spread: if token exists, add Authorization header
        // If token is null/undefined, this adds nothing (spreads nothing)
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers  // Allow caller to override/add more headers
    };

    try {
        // fetch() is the browser's built-in HTTP client (like RestTemplate.exchange())
        // It returns a Promise that resolves to the Response object
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,  // Spread caller's options (method, body, etc.)
            headers      // Override headers with our version (includes token)
        });

        // Parse the JSON response body
        const data = await response.json();

        // AUTO-LOGOUT: If we get 401 and we HAD a token, it means the token expired
        // Clear it and force the user back to login
        // Spring equivalent: AuthenticationEntryPoint redirecting to /login
        if (response.status === 401 && token) {
            localStorage.removeItem('token');
            window.location.href = '/login';  // Hard redirect (full page reload)
            return null;
        }

        // Return a clean result object that every component can easily use
        return {
            data,                    // The parsed JSON body
            status: response.status, // HTTP status code (200, 201, 400, 404, etc.)
            ok: response.ok          // true if status is 200-299, false otherwise
        };
    } catch (error) {
        // Network error (server not running, no internet, CORS blocked, etc.)
        console.error('API request failed:', error);
        return {
            data: { error: 'Network error — is the backend running?' },
            status: 0,
            ok: false
        };
    }
}