# ✅ Essential Principles for Building Angular Frontend Applications

## 1. Use Standalone Components
Adopt standalone components and feature modules to improve modularity, lazy-loading, and tree-shaking support.

## 2. Apply a Clean Folder Structure
Use consistent and intuitive folder organization like:
- `components/`
- `pages/`
- `services/`
- `models/`
- `guards/`

## 3. Use Signals or RxJS
Utilize Angular Signals or RxJS for state management, reactive data flow, and side effects.

## 4. Use Services for Logic & API Calls
Move all logic and HTTP calls into services. Components should focus on UI rendering only.

## 5. Centralized Permission Handling
Use a library like `@casl/ability` to centralize role-based access control (RBAC).

## 6. Use Route Guards
Implement `AuthGuard` or `PermissionGuard` to restrict access to routes based on authentication or user roles.

## 7. Use Interceptors
Add HTTP interceptors for attaching JWT tokens, logging, and global error handling.

## 8. Use Local Storage or IndexedDB
Persist session, user settings, or tokens using `localStorage` or `IndexedDB` to prevent data loss on reload.

## 9. Mock API Using JSON Server or Express
Use `json-server` for realistic development/testing.

## 10. Environment-based Configuration
Use Angular’s `environment.ts` files for storing base URLs, feature toggles, or environment-specific settings.

## 11. Error Handling & Feedback
Use `catchError` for HTTP errors, global interceptors for consistent handling, and user-friendly toast messages (e.g., PrimeNG `MessageService`).

## 12. Code Reusability and DRY Principle
Extract repeated logic into reusable services, pipes, or directives. Follow the DRY (Don’t Repeat Yourself) principle.
