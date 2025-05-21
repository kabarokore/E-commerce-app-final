# Hardcoded Data Remediation

This document outlines the changes made to remove hardcoded data from the e-commerce application.

## Summary of Changes

1. **Created Centralized Configuration System**

   - Frontend: Created `app-config.js` to centralize JavaScript configuration
   - Backend: Created `AppEnvironment.java` to centralize server-side configuration
   - Added environment variable support via `application.properties`

2. **Database Configuration**

   - Replaced hardcoded database credentials with environment variables:
     ```
     DB_URL, DB_USERNAME, DB_PASSWORD
     ```

3. **Frontend JavaScript**

   - Migrated hardcoded values from:
     - `home-product-meta.js`
     - `modal.js`
     - `modal-unified.js`
     - `counter-unified.js`
     - To the new centralized `app-config.js`

4. **Server to Client Configuration Bridge**

   - Created `ConfigurationExporter.java` to safely export server configuration to the client
   - Added `GlobalViewAdvice.java` to inject configuration into all views
   - Added Thymeleaf fragment `config.html` for consistent inclusion of configuration scripts

5. **Security Improvements**
   - Added JWT secret configuration (`JWT_SECRET` environment variable)
   - Added rate limiting configuration
   - Added file upload security configuration

## Remaining Tasks

1. **Test Data**

   - Replace hardcoded test data in `TemplateDataExtractor.java` with data loaded from properties files
   - Remove backup files with hardcoded test data (`AdminController.java.bak`)

2. **Frontend Templates**

   - Update any hardcoded values in HTML/Thymeleaf templates to use the configuration system

3. **Security Implementation**
   - Complete the implementation of the JWT token system
   - Implement API rate limiting based on the configuration

## How to Use the New Configuration System

### Server-Side (Java)

```java
@Autowired
private AppEnvironment appEnvironment;

// Use configuration values
if (appEnvironment.isDebugEnabled()) {
    // Debug-only functionality
}
```

### Client-Side (JavaScript)

```javascript
// Access configuration
const apiBaseUrl = APP_CONFIG.api.baseUrl;
const isWishlistEnabled = APP_CONFIG.features.enableWishlist;

// Feature detection
if (APP_CONFIG.features.enableProductComparison) {
  // Enable product comparison UI
}
```

### Templates (Thymeleaf)

```html
<!-- Include configuration in templates -->
<div th:replace="fragments/config :: config-scripts"></div>

<!-- Use configuration values directly in templates -->
<div th:if="${config.features.enableWishlist}">
  <!-- Wishlist UI elements -->
</div>
```

## Environment Variables

For production deployment, set the following environment variables:

```
# Database
DB_URL=jdbc:mysql://production-db:3306/ecommercedb
DB_USERNAME=production_user
DB_PASSWORD=secure_password

# Security
JWT_SECRET=strong_random_secret_key
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=30

# Debug (disable in production)
DEBUG_MODE=false
```
