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
import { pathToFileURL } from 'url';
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
app.use(express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y',
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// SSR: load the Angular render function once from the bundle built by `ng build`.
// CommonEngine + AppServerModule live together inside server.mjs so they share
// the same Angular instance — no "two instances of Angular" conflict.
//
// `esmImport` uses new Function() to prevent TypeScript (module: commonjs) from
// compiling `import()` → `require()`. require() can't load .mjs ESM files.
const esmImport = new Function('u', 'return import(u)') as (u: string) => Promise<any>;

let ssrReady: Promise<((opts: any) => Promise<string>) | null> | null = null;

function initSsr() {
  if (ssrReady) return ssrReady;
  const ssrBundleUrl = pathToFileURL(join(DIST_FOLDER, 'server', 'server.mjs')).href;
  ssrReady = esmImport(ssrBundleUrl)
    .then(bundle => bundle.renderSsr as (opts: any) => Promise<string>)
    .catch(err => {
      console.error('SSR init failed — falling back to SPA mode:', err.message);
      ssrReady = null;
      return null;
    });
  return ssrReady;
}

// Pre-warm SSR at startup so the first real request isn't slow
initSsr();

app.get('*', async (req, res, next) => {
  const renderSsr = await initSsr();
  if (!renderSsr) {
    return res.sendFile(join(DIST_FOLDER, 'browser', 'index.csr.html'));
  }
  renderSsr({
    url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
    documentFilePath: join(DIST_FOLDER, 'server', 'index.server.html'),
    publicPath: join(DIST_FOLDER, 'browser'),
    serverUrl: `${req.protocol}://${req.headers.host}`,
  })
  .then(html => res.send(html))
  .catch(err => next(err));
});

app.listen(app.get('port'), () => {
  console.log('Neurimos server listening on port ' + app.get('port'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

export { app };
