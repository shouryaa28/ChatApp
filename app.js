const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Chat= require('./routes/users')
const socket=require('socket.io')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const io=socket();
app.io=io;

var loggedIn={};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

io.on('connection',function(socket){
  // console.log('connected !')

  socket.on('msg',function(data){
    var newMsg = new Chat({msg:''+data});
    console.log(newMsg);
    newMsg.save();
    socket.emit('msgsent',data)
    socket.broadcast.emit('left',data)
  })


  socket.on('username',function(data){
    loggedIn[socket.id]=data;
    io.emit('userlist',loggedIn)
  })

  socket.on('disconnect',function(){
    delete loggedIn[socket.id];
  })

  socket.on('isTying',function(urldata){
    socket.broadcast.emit('typing',urldata)
  })


})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
