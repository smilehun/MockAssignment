module.exports = (req, res, next) => {
    // Handle login
    if (req.method === 'POST' && req.path === '/api/users/login') {
        const { username, password } = req.body;

        // Get users from the database
        const users = req.app.db.get('users').value();

        const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
            return res.jsonp({
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
            return res.status(401).jsonp({ message: 'Invalid credentials' });
        }
    }

    // Handle registration
    if (req.method === 'POST' && req.path === '/api/users/register') {
        const newUser = req.body;
        const users = req.app.db.get('users').value();

        if (users.some((u) => u.username === newUser.username)) {
            return res.status(409).jsonp({ message: 'Username already exists' });
        }

        if (users.some((u) => u.email === newUser.email)) {
            return res.status(409).jsonp({ message: 'Email already exists' });
        }

        const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
        const userWithId = { ...newUser, id: newId };

        req.app.db.get('users').push(userWithId).write();

        return res.status(201).jsonp({
            message: 'Registration successful',
            user: userWithId
        });
    }

    // Handle password change
    if (req.method === 'PUT' && req.path.match(/^\/api\/users\/\d+\/password$/)) {
        const { oldPassword, newPassword } = req.body;
        const userId = parseInt(req.path.split('/')[3]);
        const users = req.app.db.get('users').value();

        const userIndex = users.findIndex((u) => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).jsonp({ message: 'User not found' });
        }

        if (users[userIndex].password !== oldPassword) {
            return res.status(401).jsonp({ message: 'Invalid old password' });
        }

        // Update password
        req.app.db.get('users').find({ id: userId }).assign({ password: newPassword }).write();

        return res.jsonp({ message: 'Password updated successfully' });
    }

    next();
};
