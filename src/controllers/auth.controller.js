async function getRegisterController(req, res) {
    res.render('register');
}

async function postRegisterController(req, res) {
    const { email, username, password } = req.body || {};
    // Placeholder logic: In future, add validation, hashing, persistence.
    if(!email || !username || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }
    return res.status(201).json({ message: 'Registered successfully (stub)', user: { email, username }});
}

module.exports = {
    getRegisterController,
    postRegisterController
};