const express = require('express');
const router = express.Router();

router.get('/liquidate', (req, res) => {
    res.render('liquidate/liquidate');
});

module.exports = router;