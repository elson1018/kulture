package com.example.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;
import java.util.Map;

public class CloudinaryService {
    private Cloudinary cloudinary;

    public CloudinaryService() {
        // Initialize with Environment Variable CLOUDINARY_URL
        // This variable MUST be set in Railway/System (e.g.
        // cloudinary://key:secret@cloud_name)
        String cloudinaryUrl = System.getenv("CLOUDINARY_URL");
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

        // Upload params: use base64 data directly
        Map uploadResult = cloudinary.uploader().upload(base64Image, ObjectUtils.emptyMap());

        // Return the secure URL (https)
        return (String) uploadResult.get("secure_url");
    }
}
