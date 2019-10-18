const express = require('express');
const router = express.Router();

router.get('/execution', (req, res) => {
    res.render('execution/execution');
});

module.exports = router;