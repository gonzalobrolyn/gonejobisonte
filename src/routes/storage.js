const express = require('express');
const router = express.Router();

router.get('/storage', (req, res) => {
    res.render('storage/storage');
});

module.exports = router;