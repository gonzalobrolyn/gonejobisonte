const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const path = require('path')
const Work = require('../models/Work');
const Folder = require('../models/Folder');
const Document = require('../models/Document');
const { isAuthenticated } = require('../helpers/auth')
const ordenaFecha = require('../helpers/functions')

router.get('/library', isAuthenticated, async (req, res) => {
    const work = await Work.find({estado: 'Execution'}).sort({fpublicacion: 'desc'})
    work.forEach(work => {
        work.efecha = ordenaFecha(work.fpresentacion)
    })
    res.render('library/library', {work});
});

module.exports = router;