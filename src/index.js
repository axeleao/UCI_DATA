const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');
const fileUpload = require('express-fileupload');




//inicializations
const app = express();
require('./lib/passport');

//************************************************************** */
//Inicio: Agregando Enlace Dinamico de Puertos
const PORT = process.env.PORT || 4000;
app.listen(PORT);
//Fin: Agregando Enlace Dinamico de Puertos
//************************************************************** */

//settings
//app.set('port', 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(fileUpload());
app.use(express.json());
app.use(session({
    secret: 'sigersession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});


//routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));
app.use('/admin', require('./routes/admin'));

//public
app.use(express.static(path.join(__dirname, 'public')));


//start the server
app.listen(app.get('port'), () => {
    console.log('Server on port',app.get('port'));
});