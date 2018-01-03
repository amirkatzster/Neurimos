import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as passport from 'passport';
import * as flash from 'connect-flash';

import * as session from 'express-session';
import setRoutes from './routes';
import setPassport from './config/passport';
import User from './models/user';


const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));



app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));

app.use(morgan('dev'));
mongoose.connect(process.env.MONGODB_URI, { useMongoClient : true });
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

// passport
// require('./config/passport')(passport);
setPassport(passport);
app.use(session({ secret: process.env.SECRET_TOKEN })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app, passport);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(app.get('port'), () => {
    console.log('Angular Full Stack listening on port ' + app.get('port'));
  });

  // require('./config/passport')(passport); // pass passport for configuration
  // passport.use(new FacebookTokenStrategy({
  //   clientID: '1764565033853258',
  //   clientSecret: process.env.FACEBOOK_SECRET
  // },
  // function (accessToken, refreshToken, profile, done) {
  //   console.log(profile);
  //   User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
  //     return done(err, user);
  //   });
  // }));

});

export { app };
