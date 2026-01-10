package com.example.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;
import java.util.Map;

import io.github.cdimascio.dotenv.Dotenv;

public class CloudinaryService {
    private Cloudinary cloudinary;

    public CloudinaryService() {
        // Initialize with Environment Variable CLOUDINARY_URL
        // Try loading from .env file first
        String cloudinaryUrl = null;
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            cloudinaryUrl = dotenv.get("CLOUDINARY_URL");
        } catch (Exception e) {
            // Ignore if .env is missing
        }

        // Fallback to System environment variable
        if (cloudinaryUrl == null) {
            cloudinaryUrl = System.getenv("CLOUDINARY_URL");
        }

        if (cloudinaryUrl != null && !cloudinaryUrl.isEmpty()) {
            this.cloudinary = new Cloudinary(cloudinaryUrl);
            this.cloudinary.config.secure = true;
        }
    }

    public boolean isConfigured() {
        return this.cloudinary != null;
    }

    public String uploadImage(String base64Image) throws IOException {
        if (!isConfigured()) {
            throw new IllegalStateException("Cloudinary is not configured. Check CLOUDINARY_URL environment variable.");
        }

        Map<String, Object> params = ObjectUtils.emptyMap();
        Map uploadResult = cloudinary.uploader().upload(base64Image, params);

        // Return the secure URL (https)
        return (String) uploadResult.get("secure_url");
    }
}
