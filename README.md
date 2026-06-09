# Swamy Bakery E-Commerce Platform

A high-performance, monolithic Vanilla JS & Node.js E-Commerce platform tailored for Swamy Bakery.

## Architecture
- **Frontend**: Vanilla HTML/CSS/JS (Single Page Application, Mobile First)
- **Backend**: Express.js REST API
- **Database**: MongoDB Atlas via Mongoose
- **Payments**: Razorpay Gateway (Webhooks & HMAC Verification)
- **Logistics**: Shiprocket API Integration

## Features
- **Security-First**: Rate limiting, Helmet HTTP headers, NoSQL Injection prevention, bcrypt hashing, JWT auth, and server-side price validation.
- **Performance**: Zero-dependency frontend architecture for <50kb total payload size.
- **Robustness**: Atomic Order ID generation and robust webhook-based order processing.
- **Admin Dashboard**: Real-time order tracking, status updates, automated Razorpay refunds, and product CRUD.

## Local Development
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in credentials.
4. Run `npm start`
5. Navigate to `http://localhost:5000`

## Production Deployment
This platform is built as a Unified Monolith. Both the backend API and frontend static assets are served from the same Express instance.

### Render Deployment
1. Connect this GitHub repository to a new Render "Web Service".
2. **Build Command**: `cd backend && npm install`
3. **Start Command**: `cd backend && npm start`
4. Add all environment variables listed in `.env.example` to the Render dashboard.
5. In MongoDB Atlas, ensure Render's IP address (or `0.0.0.0/0`) is whitelisted.
6. In the Razorpay Dashboard, set the Webhook URL to `https://<your-render-url>/api/payments/webhook` listening for the `payment.captured` event.
