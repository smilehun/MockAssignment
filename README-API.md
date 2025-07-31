# JSON Server API Setup

This project now uses JSON Server instead of Angular's in-memory-web-api for a more realistic API experience.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the JSON Server:**
   ```bash
   npm run json-server
   ```
   This will start the JSON Server on `http://localhost:3001`

3. **Start the Angular application:**
   ```bash
   npm run start
   ```
   This will start the Angular app on `http://localhost:4200`

4. **Or run both simultaneously:**
   ```bash
   npm run dev
   ```

## API Endpoints

The JSON Server provides the following endpoints:

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Authentication (Custom Routes)
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `PUT /api/users/:id/password` - Change password

## Data Persistence

The data is stored in `db.json` and persists between server restarts. The initial data includes:

- Admin user: `admin/admin`
- Regular users: `user_alpha/user`, `user_beta/user`, etc.

## Custom Middleware

The `json-server-middleware.js` file contains custom routes for authentication that aren't part of the standard JSON Server functionality:

- Login validation
- Registration with duplicate checking
- Password change functionality

## Environment Configuration

The API URL is configured in the environment files:
- Development: `http://localhost:3001/api`
- Production: `/api` (configurable for your production API)

## Migration Notes

The following changes were made during migration:

1. Removed `angular-in-memory-web-api` dependency
2. Added `json-server` and `concurrently` as dev dependencies
3. Created `db.json` with initial user data
4. Created custom middleware for authentication routes
5. Updated `AuthService` and `UserService` to use the new API
6. Removed `InMemoryDataService`
7. Updated `app.config.ts` to remove in-memory web API configuration
8. Added environment configuration for API URLs

## Troubleshooting

- Make sure both servers are running (JSON Server on port 3001, Angular on port 4200)
- Check that the API URL in environment files matches your JSON Server URL
- If you get CORS errors, the JSON Server middleware includes CORS headers
- Data changes are automatically saved to `db.json` 