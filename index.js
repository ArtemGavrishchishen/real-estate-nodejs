const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const errorMidleware = require('./middleware/error');
const userMidleware = require('./middleware/user');
const varMidleware = require('./middleware/variables');
const fileMidleware = require('./middleware/file');
const keys = require('./keys');

const app = express();

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI,
});

//== hbs configurations in express - start
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./_helpers/hbs-helpers'),
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
//== hbs configurations in express - end

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(varMidleware);
app.use(userMidleware);
app.use(
  fileMidleware.fields([{ name: 'avatar', maxCount: 1 }, { name: 'property' }])
);

//=== Routes
app.use('/', require('./routes/home'));
app.use('/realty', require('./routes/realty'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/add', require('./routes/add'));

app.use(errorMidleware);

// === ConnectDB && start server
async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log('Database connection successful');
  } catch (e) {
    console.log('Database connection error', e.message);
    process.exit(1);
  }

  app.listen(keys.PORT, () => {
    console.log('Server was started at http://localhost:' + keys.PORT);
  });
}

start();
