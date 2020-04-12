const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const errorMidleware = require('./middleware/error');
const keys = require('./keys');

const app = express();

//== hbs configurations in express - start
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers'),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
//== hbs configurations in express - end

app.use(express.static(path.join(__dirname, 'public')));

//== Routes
app.use('/', require('./routes/home'));
app.use('/realty', require('./routes/realty'));
app.use('/auth', require('./routes/auth'));

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
