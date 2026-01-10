# Kulture

**Kulture** is a full-stack e-commerce platform dedicated to preserving and promoting Malaysian cultural heritage. It connects artisans with enthusiasts by offering traditional products (Food, Souvenirs, Instruments) and educational tutorials (Live & Recorded).

## Key Features

*   **E-Commerce Store**: Browse and purchase authentic Malaysian products.
*   **Tutorials Platform**: Buy access to cultural workshops (Live Classes or Recorded Video).
*   **Review System**: Users can rate and review both Physical Products and Tutorials.
*   **Search & Filter**: filtering by category, price, and sorting capabilities.
*   **Admin Dashboard**: Manage products, inventory, and sales data.
*   **Authentication**: Secure user login and registration system.

## Tech Stack

### Frontend
*   **React** (Vite build tool)
*   **React Router** (Navigation)
*   **CSS3** (Custom styling with responsive design)

### Backend
*   **Java Servlets** (Core API logic)
*   **Maven** (Dependency management & build)
*   **MongoDB** (Database)
*   **Tomcat (Embed)** (Web server via Cargo plugin)

## Getting Started

### Prerequisites
*   Node.js & npm
*   Java JDK 11+
*   Maven

### 1. Backend Setup
The backend runs on port `8082`.

```bash
cd backend
./mvnw clean package cargo:run
```

*Note: The backend includes a database seeder that automatically populates MongoDB with initial products and tutorials on first run.*

### 2. Frontend Setup
The frontend runs on port `5173`.

```bash
cd frontend
npm install
npm run dev
```

### 3. Access the App
Open your browser to `http://localhost:5173`.

## Project Structure

*   **/frontend**: Contains the React SPA source code.
    *   `src/components`: Reusable UI components (ProductCard, Navbar, etc.).
    *   `src/Pages`: Page views (Home, Shop, Tutorials, Cart, etc.).
*   **/backend**: Java Servlet application.
    *   `src/main/java/com/example`:
        *   `model`: Data models (Product, User, Tutorial).
        *   `dao`: Database Access Objects.
        *   `servlet`: API Endpoints.
    *   `src/main/resources`: Configuration and Seed data.
