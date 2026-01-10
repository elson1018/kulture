package com.example.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Centralized CORS configuration utility
 */
public class CorsConfig {

    public static void setupCORS(HttpServletResponse resp, HttpServletRequest req) {
        String origin = req.getHeader("Origin");

        // Allow Localhost and Vercel domains
        if (origin != null && (origin.startsWith("http://localhost") ||
                origin.startsWith("http://127.0.0.1") ||
                origin.endsWith(".vercel.app") ||
                origin.equals(System.getenv("FRONTEND_URL")))) {
            resp.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            // Default fallbacks if no origin header or not verified
            resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        }

        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Max-Age", "3600");
    }
}