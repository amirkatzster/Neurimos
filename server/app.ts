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
dotenv.config({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: false }));
app.use(morgan('dev'));

setPassport(passport);
app.use(session({
  secret: process.env.SECRET_TOKEN || 'dev-secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

setRoutes(app, passport);

const DIST_FOLDER = join(process.cwd(), 'dist');
app.use(express.static(join(DIST_FOLDER, 'browser')));
app.get('*', (req, res) => {
  res.sendFile(join(DIST_FOLDER, 'browser', 'index.html'));
});

app.listen(app.get('port'), () => {
  console.log('Neurimos server listening on port ' + app.get('port'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

export { app };
