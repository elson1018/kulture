# Deployment Guide

This guide explains how to deploy your Kulture application (Frontend + Backend).

## Prerequisites
- A GitHub account (where your code is hosted).
- Accounts on **Render.com** (recommended for both) or **Vercel** (for Frontend).
- A **MongoDB Atlas** database (cloud database).

## 1. Database (MongoDB Atlas)
Since your app uses MongoDB, you need a cloud database.
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Get your connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`).
3. You will need to provide this to your backend environment variables.

## 2. Backend Deployment (Render)
1. Log in to [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Select the `backend/MappingServlets` directory as the **Root Directory** (if asked) or ensure the build context is correct.
   - **Runtime**: Docker
   - **Region**: Singapore (or closest to you)
   - **Branch**: `main` (or your working branch)
5. **Environment Variables**:
   Add the following variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JAVA_OPTS`: `-Xmx512m` (optional, for memory limits)
6. Click **Create Web Service**.
7. Once deployed, Render will give you a URL (e.g., `https://kulture-backend.onrender.com`). **Copy this URL.**

**Important Note on Images**: Your current backend saves images to the local file system. On Render, these files will disappear when the server restarts. For a production app, you should update the code to use Cloudinary or AWS S3.

## 3. Frontend Deployment (Vercel)
1. Log in to [Vercel.com](https://vercel.com).
2. **Add New** -> **Project**.
3. Import your Git repository.
4. **Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (Edit this to point to the frontend folder)
5. **Environment Variables**:
   Add the variable:
   - `VITE_API_BASE_URL`: The URL of your deployed backend + `/api` (e.g. `https://kulture-backend.onrender.com/api`).
     *Note: Since we renamed the WAR in Docker to ROOT.war, the path is just `/api`, not `/MappingServlets.../api`.*
6. Click **Deploy**.

## 4. Final Configuration (CORS)
Your Java backend currently allows `http://localhost:5173`. You need to ensure it allows your Vercel frontend URL.
- You may need to edit `src/main/java/com/example/servlet/AuthServlet.java` (and others) to change:
  ```java
  resp.setHeader("Access-Control-Allow-Origin", "https://your-vercel-app.vercel.app");
  ```
  Or verify if the dynamic origin change was applied.

## 5. Testing
Visit your Vercel URL. It should load the frontend and connect to your Render backend.
