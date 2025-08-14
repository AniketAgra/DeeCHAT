const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index'); //index - is the view file located at views/index.ejs
})

module.exports = router;