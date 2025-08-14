const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');    

async function getRegisterController(req, res) {
    res.render('register');
}

async function getLoginController(req, res) {
    res.render('login');
}

async function postRegisterController(req, res) {
    const { email, username, password } = req.body || {};
    
    if(!email || !username || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }

    const user = await userModel.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })

    if(user) {
        return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        email,
        username,
        password: hashedPassword
    });



    const token = jwt.sign({
        id: newUser._id,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });

    return res.status(201).json({ message: 'Registered successfully (stub)', user: newUser, token });
}

async function postLoginController(req, res){
    const { identifier, password } = req.body || {};
    if(!identifier || !password){
        return res.status(400).json({ error: 'Identifier and password required'});
    }
    const user = await userModel.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    });
    if(!user){
        return res.redirect('/auth/login?error=User not found ')
    }
    const valid = await bcrypt.compare(password, user.password);
    if(!valid){
        return res.status(401).json({ error: 'Invalid credentials'});
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
    res.cookie('token', token, { httpOnly: true });
    return res.json({ message: 'Login successful', user, token });
}

async function postLogoutController(){
    res.clearCookie('token');
    res.render('/auth/login', { message: 'Logged out successfully' });
}

module.exports = {
    getRegisterController,
    postRegisterController,
    getLoginController,
    postLoginController,
    postLogoutController
};