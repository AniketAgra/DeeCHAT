const express = require('express');
const {getRegisterController, postRegisterController, getLoginController, postLoginController, postLogoutController} = require('../controllers/auth.controller');

const router = express.Router();

// router.get('/register', getRegisterController);
// router.post('/register', postRegisterController);

//can also be written as
router.route('/register')
    .get(getRegisterController)
    .post(postRegisterController)

router.route('/login')
    .get(getLoginController)
    .post(postLoginController)

router.route('/logout')
    .post(postLogoutController);

module.exports = router;