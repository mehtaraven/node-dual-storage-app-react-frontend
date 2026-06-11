// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLER — Catches any unhandled errors in route handlers
// ─────────────────────────────────────────────────────────────────────────────
// Spring equivalent: @ControllerAdvice + @ExceptionHandler(Exception.class)
//
// In Express, an error-handling middleware has FOUR parameters: (err, req, res, next)
// Express identifies it as an error handler BECAUSE of the 4 parameters.
// Regular middleware has 3 params: (req, res, next)
//
// This MUST be the LAST middleware registered (after all routes).
// Any error thrown or passed via next(error) in any route lands here.
// ─────────────────────────────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
    // Log the full error server-side (for debugging)
    // NEVER expose stack traces to the client in production
    console.error('Unhandled error:', err.message);
    console.error('Stack:', err.stack);

    // MongoDB connection errors → 503 Service Unavailable
    if (err.message === 'Storage backend unreachable') {
        return res.status(503).json({
            error: 'Storage service is currently unavailable. Please try again later.'
        });
    }

    // Mongoose validation errors → 400 Bad Request
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: err.message
        });
    }

    // Everything else → 500 Internal Server Error (generic)
    // Don't reveal internal details to the client
    res.status(500).json({
        error: 'Internal server error'
    });
};

module.exports = errorHandler;