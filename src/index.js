const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverrride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan')
const multer = require('multer')

// Initializations
const app = express();
require('./database');
require('./config/passport');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    helpers:{
        ifCond: function(value1, value2, options) {
            if(value1 === value2){
                return options.fn(this)
            }
            return options.inverse(this)
        }
    },
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');



// Middlewares
// app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(methodOverrride('_method'))
app.use(session({
    secret: 'gonejosecreto',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname))
    }
})
app.use(multer({storage}).single('document'))
// app.use(multer({storage}).single('image'))

// Gloval Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


// Routes
app.use(require('./routes/index.js'));
app.use(require('./routes/manage.js'));
app.use(require('./routes/library.js'));
app.use(require('./routes/employe.js'));
app.use(require('./routes/users.js'));
app.use(require('./routes/storage.js'));
app.use(require('./routes/purchase.js'));
app.use(require('./routes/selection.js'));
app.use(require('./routes/execution.js'));
app.use(require('./routes/liquidate.js'));
app.use(require('./routes/account.js'));
app.use(require('./routes/accounting.js'));
app.use(require('./routes/notes.js'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listenning
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});