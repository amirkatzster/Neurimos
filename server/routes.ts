import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import ShoeCtrl from './controllers/shoe';
import UserCtrl from './controllers/user';
import CompanyCtrl from './controllers/company';
import Shoe from './models/shoe';
import User from './models/user';
import Company from './models/company';

export default function setRoutes(app) {

  const router = express.Router();

  const shoeCtrl = new ShoeCtrl();
  const userCtrl = new UserCtrl();
  const companyCtrl = new CompanyCtrl();

  // Shoes
  router.route('/shoes').get(shoeCtrl.getAll);
  router.route('/shoes/count').get(shoeCtrl.count); 
  router.route('/shoe/:id').get(shoeCtrl.get);

  // Company
  router.route('/companies').get(companyCtrl.getAll);
  router.route('/companies/count').get(companyCtrl.count);
  router.route('/company/:id').get(companyCtrl.get);
  

  // Users
  router.route('/login').post(userCtrl.login);
   router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user/:id').get(userCtrl.get);
  
  console.log('a');
  // route middleware to verify a token
  router.use(function(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['Authorization'];
    if (token) {
      console.log(token);
      jwt.verify(token, process.env.SECRET_TOKEN , function(err, decoded) {
        if (err) {
          console.log(err);
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });
    }
  });

  //Logged in user


  // Check Admin
  console.log('b');
  router.use(function(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['Authorization'];
    if (token) {
      jwt.verify(token, process.env.SECRET_TOKEN , function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          if (decoded.role === 'admin') {
              next();
            } else {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            }
        }
      });
    } else {
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });
    }
  });

  //Admin Role
  router.route('/shoe').post(shoeCtrl.insert);
  router.route('/shoe/:id').put(shoeCtrl.update);
  router.route('/shoe/:id').delete(shoeCtrl.delete);
  router.route('/company').post(companyCtrl.insert);
  router.route('/company/:id').put(companyCtrl.update);
  router.route('/company/:id').delete(companyCtrl.delete);
 

  // Apply the routes to our applishoeion with the prefix /api
  app.use('/api', router);

}
