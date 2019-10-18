const express = require('express');
const router = express.Router();

router.get('/purchase', (req, res) => {
    res.render('purchase/purchase');
});

module.exports = router;