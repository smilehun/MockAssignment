export const APP_CONSTANTS = {
    // Storage keys
    STORAGE_KEYS: {
        CURRENT_USER: 'currentUser',
        AUTH_TOKEN: 'auth_token',
        THEME_PREFERENCE: 'theme_preference',
        LAYOUT_CONFIG: 'layout_config'
    },

    // API endpoints
    API_ENDPOINTS: {
        USERS: '/users',
        AUTH: '/auth',
        LOGIN: '/login',
        REGISTER: '/register'
    },

    // User roles
    USER_ROLES: {
        ADMIN: 'admin',
        USER: 'user',
        OWNER: 'owner'
    },

    // User statuses
    USER_STATUSES: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        PENDING: 'pending'
    },

    // Default values
    DEFAULTS: {
        PAGE_SIZE: 10,
        TOAST_LIFE: 5000,
        DEBOUNCE_TIME: 300
    },

    // Error messages
    ERROR_MESSAGES: {
        INVALID_CREDENTIALS: 'Invalid credentials',
        ACCOUNT_INACTIVE: 'Account is not active. Please contact administrator.',
        BAD_REQUEST: 'Bad request. Please check your input.',
        UNAUTHORIZED: 'Unauthorized. Please log in again.',
        FORBIDDEN: "Access forbidden. You don't have permission for this action.",
        NOT_FOUND: 'Resource not found.',
        SERVER_ERROR: 'Internal server error. Please try again later.',
        REGISTRATION_FAILED: 'Registration failed. Please try again.',
        UNEXPECTED_ERROR: 'An unexpected error occurred'
    }
} as const;
