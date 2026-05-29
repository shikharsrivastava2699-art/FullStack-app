# Car Research Platform - Implementation Plan

## TL;DR
Build a car research platform that helps buyers navigate options through filtering, comparison, user reviews, and a smart recommendation quiz. Start with backend data foundation (PostgreSQL + APIs), move to frontend UI components, integrate features incrementally, and validate each phase before moving to the next.

**Stack**: Express.js + TypeScript (BE) | React 19 + TypeScript + Vite (FE) | PostgreSQL | Context API | Cloud Deployment

---

## Phase 1: Foundation & Data Layer
**Goal**: Set up the database schema, seed initial data, and create basic API structure.
**Duration**: 2-3 days
**Deliverable**: Fully functional backend with data endpoints

### Progress (May 29, 2026)
- `backend/src/index.ts`: added `/health` JSON endpoint returning status, timestamp, and env.
- `frontend/src/App.tsx`: added a health-check fetch and displays backend status.
- `vite.config.ts`: added dev server proxy for `/health` to `http://localhost:5000`.
- `backend/src/config/env.ts`: created environment configuration for the backend.
- `backend/src/routes/healthRoutes.ts` and `backend/src/routes/index.ts`: added a versioned API route layer.
- `backend/src/controllers/healthController.ts`: added a dedicated health controller.
- `backend/src/middleware/errorHandler.ts`: added global error handling middleware.
- `backend/src/types/make.ts`: added type definitions for car makes.
- `backend/src/data/sampleMakes.ts`: added Phase 1 sample make data.
- `backend/src/services/makeService.ts`: added a makes service layer with future DB replacement note.
- `backend/src/controllers/makeController.ts`: added a makes controller.
- `backend/src/routes/makeRoutes.ts`: added a makes API route.
- `backend/src/config/database.ts`: added placeholder DB client scaffolding for future integration.

### 1.1 Database Setup & Schema Design
- [ ] Install and configure PostgreSQL locally
- [ ] Create .env file with DB credentials (host, port, user, password, database name)
- [ ] Design database schema:
  - makes table (id, name, logo_url)
  - models table (id, make_id, name, image_url)
  - ariants table (id, model_id, name, variant_specs_id)
  - specs table (id, engine_type, transmission, fuel_type, power, torque, mileage, safety_rating, price)
  - 
eviews table (id, variant_id, user_name, rating, title, content, created_at)
  - Add indexes on frequently queried columns (make_id, model_id, price, safety_rating)
- [ ] Create database migrations system (using a tool like sequelize, 	ypeorm, or raw SQL files)
- [ ] Document schema in ackend/DATABASE_SCHEMA.md

**Review Checklist**:
- [ ] Schema follows normalization principles
- [ ] Foreign key relationships are properly defined
- [ ] Indexes added for performance
- [ ] Migration files are version-controlled

---

### 1.2 Backend Project Structure & Configuration
- [ ] Set up folder structure:
  - backend/src/config - DB config, env validation
  - backend/src/models - TypeScript interfaces
  - backend/src/controllers - Request handlers
  - backend/src/services - Business logic
  - backend/src/routes - API route definitions
  - backend/src/middleware - Auth, logging, error handling
  - backend/src/utils - Helpers, constants
  - backend/src/types - Shared TypeScript types
- [ ] Create config/database.ts for PostgreSQL connection pooling
- [ ] Add config/env.ts to validate required environment variables on startup
- [ ] Set up error handling middleware in middleware/errorHandler.ts
- [ ] Create logging middleware in middleware/logger.ts
- [ ] Update src/index.ts to initialize Express server with all middleware

**Review Checklist**:
- [ ] All required directories created
- [ ] Database connection tested
- [ ] Server starts without errors on npm run dev
- [ ] Environment validation works

---

### 1.3 Database Client & Connection Setup
- [ ] Install PostgreSQL driver (pg package) or ORM (typeorm, prisma, knex)
- [ ] Create config/database.ts:
  - Initialize connection pool with proper settings
  - Implement connection retry logic
  - Add connection timeout handling
- [ ] Create utility function to execute queries safely
- [ ] Test connection by running a simple query

**Review Checklist**:
- [ ] Database client installed and configured
- [ ] Connection pool working
- [ ] Error handling in place for connection failures

---

### 1.4 Data Seeding
- [ ] Create scripts/seedDatabase.ts with:
  - 5-10 popular car makes (Toyota, Honda, BMW, Mercedes, etc.)
  - 2-3 models per make
  - 2-3 variants per model with specs (engine, transmission, price, safety rating)
  - 5-10 sample reviews per variant
- [ ] Create seed script that can be run with npm run seed
- [ ] Add documentation on how to re-seed data
- [ ] Verify data integrity after seeding

**Review Checklist**:
- [ ] Seed script runs without errors
- [ ] Data is properly inserted with relationships
- [ ] Sample data is realistic and diverse
- [ ] Script can be run multiple times safely

---

## Phase 2: Backend API Endpoints
**Goal**: Create REST endpoints for all core features.
**Duration**: 2-3 days
**Deliverable**: Fully functional backend API that frontend can consume

### 2.1 Car Browse API Endpoints
Create endpoints for discovering and filtering cars:

**Endpoint 1**: GET /api/v1/makes - List all car makes
- [ ] Controller: Get all makes
- [ ] Service: Fetch makes from DB
- [ ] Response: { makes: [{ id, name, logo_url }, ...] }

**Endpoint 2**: GET /api/v1/makes/:makeId/models - Get models for a make
- [ ] Controller: Get models by makeId
- [ ] Service: Fetch models with count of variants
- [ ] Response: { models: [{ id, name, image_url, variantCount }, ...] }

**Endpoint 3**: GET /api/v1/models/:modelId/variants - Get variants for a model
- [ ] Controller: Get variants with full specs
- [ ] Service: Join variants with specs table
- [ ] Response: { variants: [{ id, name, specs: {...}, reviewCount, avgRating }, ...] }

**Endpoint 4**: GET /api/v1/variants/search - Search and filter variants (with query params)
- [ ] Query params: ?priceMin=100000&priceMax=3000000&fuelType=petrol&transmission=automatic&safetyRating=4
- [ ] Controller: Parse and validate query params
- [ ] Service: Build dynamic SQL query with filters
- [ ] Response: { variants: [...], total: number, appliedFilters: {...} }

**Review Checklist**:
- [ ] All 4 endpoints return correct data
- [ ] Query parameters work for filtering
- [ ] Error handling for invalid makeId/modelId
- [ ] Response time is acceptable (< 500ms)

---

## Phase 3: Frontend Foundation & UI Components
**Goal**: Create reusable UI components and project structure.
**Duration**: 2-3 days
**Deliverable**: Component library ready for feature integration

### 3.1 Frontend Project Structure & Setup
- [ ] Set up folder structure with components, pages, hooks, services, context, types, utils, styles
- [ ] Create .env.local for API base URL: VITE_API_URL=http://localhost:5000/api/v1
- [ ] Install required libraries: react-router-dom, axios, Tailwind CSS or CSS modules

**Review Checklist**:
- [ ] All directories created
- [ ] Environment variables set up
- [ ] Dev server runs on npm run dev
- [ ] No TypeScript errors

---

## Phase 4: Feature Integration - Browse & Filter
**Goal**: Implement the core car browsing and filtering feature.
**Duration**: 2 days
**Deliverable**: Users can browse and filter cars

---

## Phase 5: Feature Integration - Comparison Tool
**Goal**: Allow users to compare multiple cars side-by-side.
**Duration**: 1-2 days
**Deliverable**: Functional comparison feature

---

## Phase 6: Feature Integration - Reviews
**Goal**: Display user reviews and allow submission.
**Duration**: 1-2 days
**Deliverable**: Full review system

---

## Phase 7: Feature Integration - Smart Recommendation Quiz
**Goal**: Implement the recommendation engine with interactive quiz.
**Duration**: 2 days
**Deliverable**: Smart quiz that recommends cars

---

## Phase 8: Polish & Optimization
**Goal**: Improve performance, UX, and prepare for deployment.
**Duration**: 2-3 days
**Deliverable**: Production-ready application

---

## Phase 9: Deployment
**Goal**: Deploy application to cloud.
**Duration**: 1-2 days
**Deliverable**: Live application accessible online

---

## Phase 10: Monitoring & Maintenance
**Goal**: Set up monitoring and maintain application post-launch.
**Duration**: Ongoing
**Deliverable**: Monitoring dashboard and alert system

---

## Key Integration Points

### Frontend ↔ Backend Communication Flow
\\\
User Action (Browse/Filter/Compare/Quiz)
    ↓
Frontend Component handles event
    ↓
API Service (carService.ts) makes request
    ↓
Backend Receives request at endpoint
    ↓
Controller validates input
    ↓
Service queries database
    ↓
Response formatted with response formatter
    ↓
Frontend receives and updates Context
    ↓
Components re-render with new data
\\\

### Critical Touch Points
1. **Browse Flow**: Browse → Filter → Detail → Comparison
2. **Review Flow**: VariantDetail → ReviewForm → New Review → Summary Update
3. **Quiz Flow**: Quiz Questions → Submit → Results → Recommendations → Details
4. **Comparison Flow**: Add to Comparison → Comparison Page → Export

---

## Database Schema Overview

\\\sql
-- Makes (Car manufacturers)
CREATE TABLE makes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(255)
);

-- Models
CREATE TABLE models (
  id SERIAL PRIMARY KEY,
  make_id INT REFERENCES makes(id),
  name VARCHAR(100) NOT NULL,
  image_url VARCHAR(255)
);

-- Specs (Car specifications)
CREATE TABLE specs (
  id SERIAL PRIMARY KEY,
  engine_type VARCHAR(50),
  power INT,
  torque INT,
  fuel_type VARCHAR(30),
  transmission VARCHAR(30),
  mileage INT,
  safety_rating DECIMAL(2,1)
);

-- Variants (Specific trim levels)
CREATE TABLE variants (
  id SERIAL PRIMARY KEY,
  model_id INT REFERENCES models(id),
  name VARCHAR(100) NOT NULL,
  specs_id INT REFERENCES specs(id),
  price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  variant_id INT REFERENCES variants(id),
  user_name VARCHAR(100),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_models_make_id ON models(make_id);
CREATE INDEX idx_variants_model_id ON variants(model_id);
CREATE INDEX idx_variants_price ON variants(price);
CREATE INDEX idx_reviews_variant_id ON reviews(variant_id);
\\\

---

## Summary of Deliverables

| Phase | Deliverable | By End |
|-------|-------------|--------|
| 1 | PostgreSQL setup, schema, seeded data | Day 3 |
| 2 | 11 REST API endpoints, Swagger docs | Day 6 |
| 3 | Component library, Context API, services | Day 9 |
| 4 | Browse, filter, details pages working | Day 11 |
| 5 | Comparison tool fully functional | Day 13 |
| 6 | Reviews system with submission | Day 14 |
| 7 | Smart recommendation quiz | Day 16 |
| 8 | Optimization, testing, accessibility | Day 19 |
| 9 | Deployed to cloud, live | Day 20 |
| 10 | Monitoring & maintenance | Ongoing |

---

## Notes & Assumptions
- All tasks include error handling
- Each phase is independently testable and reviewable
- Phases build on each other; complete previous phases first
- All code follows the instructions.md guidelines (both FE and BE)
- Use TypeScript strict mode throughout
- Use existing dependencies; minimize new package additions
- Test on desktop first, then optimize for mobile
- Database queries optimized with indexes where needed
- API responses < 500ms target

---

*Last Updated: May 29, 2026*
