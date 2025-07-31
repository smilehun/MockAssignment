const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
 
// Add custom routes before json-server router
server.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    const db = router.db;
    const users = db.get('users').value();

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        res.jsonp({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                name: user.name,
                status: user.status
            }
        });
    } else {
        res.status(401).jsonp({ message: 'Invalid credentials' });
    }
});

server.post('/api/users/register', (req, res) => {
    const newUser = req.body;
    const db = router.db;
    const users = db.get('users').value();

    if (users.some((u) => u.username === newUser.username)) {
        return res.status(409).jsonp({ message: 'Username already exists' });
    }

    if (users.some((u) => u.email === newUser.email)) {
        return res.status(409).jsonp({ message: 'Email already exists' });
    }

    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const userWithId = { ...newUser, id: newId };

    db.get('users').push(userWithId).write();

    res.status(201).jsonp({
        message: 'Registration successful',
        user: userWithId
    });
});

server.put('/api/users/:id/password', (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = parseInt(req.params.id);
    const db = router.db;
    const users = db.get('users').value();

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).jsonp({ message: 'User not found' });
    }

    if (users[userIndex].password !== oldPassword) {
        return res.status(401).jsonp({ message: 'Invalid old password' });
    }

    // Update password
    db.get('users').find({ id: userId }).assign({ password: newPassword }).write();

    res.jsonp({ message: 'Password updated successfully' });
});

// Use default router
server.use('/api', router);

const port = 3001;
server.listen(port, () => {
    console.log(`JSON Server is running on http://localhost:${port}`);
});

module.exports = (req, res, next) => {
    if (req.method === 'POST' && req.path === '/api/users/login') {
        const { username, password } = req.body;
        const db = req.app.db;
        const user = db.get('users').find({ username, password }).value();

        if (user) {
            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    status: user.status
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } else {
        next();
    }
};
