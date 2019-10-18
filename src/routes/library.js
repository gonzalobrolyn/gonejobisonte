const express = require('express');
const router = express.Router();

router.get('/library', (req, res) => {
    res.render('library/library');
});

module.exports = router;