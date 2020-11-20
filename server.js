const database = require("./database");
const indexRouter = require("./routes");
const apiRouter = require("./routes/apis");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;

database.sequelize.sync().then(() => {
  console.log("Successfully connect to database");

  // Setup  cors setting
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin");
    next();
  });


  app.set('view options', { layout: false })
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  // app.set('view engine', 'pug');
  app.set('view engine', 'ejs');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser({ uploadDir: path.join(__dirname, '/public/uploads') }))

  app.use('/', indexRouter);
  app.use('/api', apiRouter);
  // app.use('/users', usersRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // // error handler
  // app.use(function (err, req, res, next) {
  //   // set locals, only providing error in development
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get('env') === 'development' ? err : {};

  //   // render the error page
  //   res.status(err.status || 500);
  //   res.render('error.html');
  // });


  app.listen(port, () => {
    console.log(`Server is served at http://localhost:${port}`)
  })
}, (err) => {
  console.log("Connection Error: ", err);
})