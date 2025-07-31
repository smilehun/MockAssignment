const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Enable CORS for all routes
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Error handling middleware
server.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Mock authentication middleware
const getAuthenticatedUser = (req) => {
    // For demo purposes, return the first active user
    const db = router.db;
    return db.get('users').find({ status: 'active' }).value();
};

// Get current user profile
server.get('/api/me', (req, res) => {
    try {
        const currentUser = getAuthenticatedUser(req);
        if (!currentUser) {
            return res.status(401).jsonp({ message: 'Not authenticated' });
        }

        const { password, ...userWithoutPassword } = currentUser;
        res.jsonp(userWithoutPassword);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).jsonp({ message: 'Internal server error', error: error.message });
    }
});

// Custom routes for user management
server.get('/api/users', (req, res) => {
    try {
        const db = router.db;
        const users = db.get('users').value();

        // Remove password field from response
        const sanitizedUsers = users.map((user) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.jsonp(sanitizedUsers);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).jsonp({ message: 'Internal server error', error: error.message });
    }
});

server.get('/api/users/:id', (req, res) => {
    try {
        const db = router.db;
        const user = db.get('users').find({ id: req.params.id }).value();

        if (!user) {
            return res.status(404).jsonp({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;
        res.jsonp(userWithoutPassword);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).jsonp({ message: 'Internal server error', error: error.message });
    }
});

server.post('/api/users', (req, res) => {
    try {
        const db = router.db;
        const { username, email, role, name, status, password } = req.body;

        // Validate required fields
        if (!username || !email || !role || !name || !status || !password) {
            return res.status(400).jsonp({ message: 'All fields are required' });
        }

        // Check if username already exists
        const existingUser = db.get('users').find({ username }).value();
        if (existingUser) {
            return res.status(409).jsonp({ message: 'Username already exists' });
        }

        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            username,
            password,
            email,
            role,
            name,
            status
        };

        db.get('users').push(newUser).write();

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).jsonp(userWithoutPassword);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).jsonp({ message: 'Internal server error', error: error.message });
    }
});

server.put('/api/users/:id', (req, res) => {
    try {
        const db = router.db;
        const { username, email, role, name, status } = req.body;
        const userId = req.params.id;

        // Validate required fields
        if (!username || !email || !role || !name || !status) {
            return res.status(400).jsonp({ message: 'All fields are required' });
        }

        const user = db.get('users').find({ id: userId }).value();
        if (!user) {
            return res.status(404).jsonp({ message: 'User not found' });
        }

        // Update user
        const updatedUser = {
            ...user,
            username,
            email,
            role,
            name,
            status
        };

        db.get('users').find({ id: userId }).assign(updatedUser).write();

        const { password, ...userWithoutPassword } = updatedUser;
        res.jsonp(userWithoutPassword);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).jsonp({ message: 'Internal server error', error: error.message });
    }
});

server.delete('/api/users/:id', (req, res) => {
    try {
        const db = router.db;
        const userId = req.params.id;

        const user = db.get('users').find({ id: userId }).value();
        if (!user) {
            return res.status(404).jsonp({ message: 'User not found' });
        }

        db.get('users').remove({ id: userId }).write();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).jsonp({ message: 'Internal server error', error: error.message });
    }
});

server.post('/api/users/login', (req, res) => {
    try {
        console.log('Login attempt with:', req.body);
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).jsonp({ message: 'Username and password are required' });
        }

        const db = router.db;
        const users = db.get('users').value();

        const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
            if (user.status !== 'active') {
                return res.status(403).jsonp({
                    message: `Account is ${user.status}. Please contact administrator.`
                });
            }

            res.jsonp({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    status: user.status
                },
                token: 'mock-jwt-token' // Added mock token for client-side validation
            });
        } else {
            res.status(401).jsonp({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).jsonp({ message: 'Internal server error', error: error.message });
    }
});

// Use the router for any other routes
server.use('/api', router);

const port = 3001;
server.listen(port, () => {
    console.log(`JSON Server is running on http://localhost:${port}`);
});
