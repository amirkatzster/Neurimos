import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as passport from 'passport';
import * as flash from 'connect-flash';
import * as session from 'express-session';
import { join } from 'path';
import setRoutes from './routes';
import setPassport from './config/passport';

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: false }));
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

setPassport(passport);
app.use(session({
  secret: process.env.SECRET_TOKEN || 'dev-secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app, passport);

  const DIST_FOLDER = join(process.cwd(), 'dist');

  // Serve static files from Angular build
  app.use(express.static(join(DIST_FOLDER, 'browser')));

  // All other routes return the Angular app
  app.get('*', (req, res) => {
    res.sendFile(join(DIST_FOLDER, 'browser', 'index.html'));
  });

  app.listen(app.get('port'), () => {
    console.log('Neurimos server listening on port ' + app.get('port'));
  });
});

export { app };
