const express = require('express');
const app = express();
const http = require('http').Server(app);
const morgan = require('morgan');
const dataLogo = require('./dataLogo');
const { mongoose } = require('./database'); //Conectar a MongoDB
const io = require('socket.io')(http);
const cors = require('cors');
const jwt = require('./middlewares/jwt');
const errorHandler = require('./middlewares/error-handler');


//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin: '*'}));

// use JWT auth to secure the api
app.use(jwt());
//routes
app.use('/api/users',require('./routes/user.routes'));
app.use('/api/dataLogo',require('./routes/dataLogo.routes'));
app.use('/api/login',require('./routes/login.routes'));
app.use('/api/register',require('./routes/register.routes'));
app.use('api/controls', require('./routes/controls.routes'));
app.use(errorHandler);

//starting the server
setInterval(function () {
    dataLogo.updateLogo();
    io.sockets.emit('dataLogo', dataLogo.logoPositions[0]);
}, 5000);

// socket.io
io.on('connection', function (socket) {
    console.log('a user connected');
  });

http.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});