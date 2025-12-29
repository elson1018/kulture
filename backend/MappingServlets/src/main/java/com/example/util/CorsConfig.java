package com.example.util;

import javax.servlet.http.HttpServletResponse;

/**
 * Centralized CORS configuration utility
 * Automatically configures CORS based on environment
 */
public class CorsConfig {

    private static final String ALLOWED_ORIGIN = System.getenv("FRONTEND_URL") != null
            ? System.getenv("FRONTEND_URL")
            : "http://localhost:5173";

    /**
     * Setup CORS headers for a response
     * 
     * @param resp HttpServletResponse to configure
     */
    public static void setupCORS(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Max-Age", "3600");
    }

    /**
     * Get the configured allowed origin
     * 
     * @return The allowed origin URL
     */
    public static String getAllowedOrigin() {
        return ALLOWED_ORIGIN;
    }
}
