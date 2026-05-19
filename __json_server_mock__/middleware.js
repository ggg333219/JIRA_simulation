const registeredUsers = Object.create(null);
const tokenUserMap = Object.create(null);

const makeToken = (username) => `token-${username}`;
const makeUser = (name, token) => ({ name, token });

const getTokenFromAuthHeader = (req) => {
    const authorization = req.headers && req.headers.authorization;
    if (!authorization) {
        return '';
    }

    return authorization.replace(/^Bearer\s+/i, '');
};

module.exports = (req, res, next) => {
    // Dev-only: allow forcing a failure via header or query param
    const forceFailHeader = req.headers && (req.headers['x-jira-fail'] === '1' || req.headers['x-jira-fail'] === 'true');
    const forceFailQuery = req.query && (req.query.__jira_fail === '1' || req.query.__jira_fail === 'true' || req.query.fail === '1' || req.query.fail === 'true');
    if (forceFailHeader || forceFailQuery) {
        return res.status(500).json({ message: 'simulated failure (dev)' });
    }

    if (req.method === 'POST' && req.path === '/login') {
        const username = req.body && req.body.username;
        const password = req.body && req.body.password;

        if ((username === 'jack' && password === '123456') || (username && registeredUsers[username] === password)) {
            const user = makeUser(username, makeToken(username));
            tokenUserMap[user.token] = user;
            return res.status(200).json({
                user
            });
        } else {
            return res.status(400).json({ message: 'error' });
        }
    }

    if (req.method === 'POST' && req.path === '/register') {
        if (req.body && req.body.username) {
            registeredUsers[req.body.username] = req.body.password || '';
        }

        const user = makeUser(req.body?.username || 'unknown', makeToken(req.body?.username || 'unknown'));
        tokenUserMap[user.token] = user;

        return res.status(200).json({
            message: 'register success',
            user
        });
    }

    if (req.method === 'GET' && req.path === '/me') {
        const token = getTokenFromAuthHeader(req);
        const user = tokenUserMap[token] || (token && token.startsWith('token-')
            ? makeUser(token.slice('token-'.length), token)
            : token
                ? makeUser('current-user', token)
                : null);

        if (!user) {
            return res.status(401).json({ message: 'unauthorized' });
        }

        return res.status(200).json({ user });
    }

    next();
};