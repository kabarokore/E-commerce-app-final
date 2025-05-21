# E-Commerce Application

A modern e-commerce platform built with Spring Boot and Thymeleaf.

Deployment link:http://167.71.98.199/

## Project Overview

This application is a full-featured e-commerce solution that provides:

- Product listing and details
- Shopping cart functionality
- User authentication and account management
- Order processing and tracking
- Admin dashboard for product and order management
- Wishlist management
- Responsive design for mobile and desktop

## Technology Stack

- **Backend**: Spring Boot 3.1.5, Java 17
- **Frontend**: Thymeleaf, HTML, CSS, JavaScript
- **Database**: MySQL
- **Build Tool**: Maven
- **Other Tools**: Lombok for boilerplate reduction

## Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher
- MySQL 8.0 or higher

## Getting Started

### Configuration

The application uses a centralized configuration system that supports environment variables. You can set up the configuration in several ways:

1. **Environment Variables**: Set the variables in your system or deployment environment
2. **`.env` File**: Copy the `.env.example` file to `.env` and customize the values
3. **Application Properties**: Modify the `application.properties` file directly (not recommended for production)

Key configuration options:

```
# Database
DB_URL=jdbc:mysql://localhost:3306/ecommercedb
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Security
JWT_SECRET=your_jwt_secret
DEBUG_MODE=false  # Important: set to false in production!
```

See the complete list of available configuration options in the `.env.example` file.

### Database Setup

The application will automatically create the database tables on startup. Sample data will be loaded if available.

### Running the Application

You can run the application using Maven:

```bash
mvn spring-boot:run
```

Or using the provided VS Code task:

1. Open the Command Palette (Ctrl+Shift+P)
2. Select "Tasks: Run Task"
3. Choose "Run Spring Boot Application"

Once started, the application will be available at `http://localhost:8080`

## Application Structure

### Project Packages

- `com.ecommerce.app.controller` - Web controllers for handling HTTP requests
- `com.ecommerce.app.model` - Domain entities representing the application data model
- `com.ecommerce.app.repository` - Data access interfaces for database operations
- `com.ecommerce.app.service` - Business logic implementation
- `com.ecommerce.app.dto` - Data Transfer Objects for view models
- `com.ecommerce.app.api` - REST API endpoints
- `com.ecommerce.app.config` - Application configuration classes
- `com.ecommerce.app.util` - Utility classes and helper functions

### Configuration System

The application uses a unified configuration system that works across both server and client:

#### Server-Side Configuration

Server-side configuration is managed through:

- Environment variables
- `application.properties`
- `AppEnvironment.java` (centralized configuration class)

#### Client-Side Configuration

Frontend configuration is managed through:

- `app-config.js` - Central JavaScript configuration
- Server-injected configuration via `ConfigurationExporter`

### Key Features

#### User Management

- User registration and authentication
- Profile management
- Order history
- Address book management

#### Product Catalog

- Category and product browsing
- Product search and filtering
- Product details and specifications
- Related products

#### Shopping Experience

- Cart management
- Wishlist functionality
- Checkout process
- Order tracking

#### Admin Functionality

- Product management (add, edit, delete)
- Category management
- Order processing
- User management
- Analytics dashboard

## Authentication System

The application uses a custom authentication system implemented through session management. This replaces the previously used Spring Security.

Key authentication components:

- `AuthInterceptor` - Intercepts requests to verify authentication status
- `RequiresAuth` annotation - Marks controllers requiring authentication
- `AuthHelper` - Manages session-based authentication

## Hardcoded Data and Configuration

The following files contain hardcoded data that should be moved to the database or configuration:

1. `src/main/resources/static/js/home-product-meta.js` - Contains hardcoded product metadata
2. `src/main/resources/static/js/modal.js` and `modal-unified.js` - Contains configuration values
3. `src/main/java/com/ecommerce/app/util/TemplateDataExtractor.java` - Contains test/mock data
4. `src/main/java/com/ecommerce/app/controller/AdminController.java.bak` - Contains test data

## Security Considerations

1. Database credentials should be provided via environment variables, not hardcoded
2. Debug mode should be disabled in production
3. Sensitive API endpoints should be properly secured
4. Input validation should be implemented for all user inputs
5. CSRF protection should be enabled for form submissions

## Contributing

### Development Process

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request

### Code Style

This project follows standard Java code style conventions.

## Documentation

Additional documentation:

- [Hardcoded Data Remediation](./hardcoded-data-remediation.md) - Details on the refactoring to remove hardcoded values
- [Security Changes](./security-changes-README.md) - Information about security-related changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.
