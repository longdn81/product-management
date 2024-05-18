const express = require('express')
const path = require('path');
require('dotenv').config()
const methodOverride = require('method-override')
const flash = require('express-flash')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const moment  = require('moment')

const multer  = require('multer')

const database = require("./config/database")

const systemConfig = require("./config/system")

const routeAdmin = require("./routes/admin/index.route")
const route = require("./routes/client/index.route")

database.connect();

const app = express();
const port = process.env.PORT;



app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

//Flash
app.use(cookieParser('daonhatlong'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin ;
app.locals.moment = moment ;


app.use(express.static(`${__dirname}/public`))

// route
routeAdmin(app) ;
route(app);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});