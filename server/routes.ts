import * as express from 'express';

import ShoeCtrl from './controllers/shoe';
import UserCtrl from './controllers/user';
import CompanyCtrl from './controllers/company';
import ClassificationCtrl from './controllers/classification';
import Shoe from './models/shoe';
import User from './models/user';
import Company from './models/company';
import Classification from './models/classification';
import PaypalCtrl from './controllers/paypal';
import OrderCtrl from './controllers/order';
import ContactUsCtrl from './controllers/contactus';


export default function setRoutes(app, passport) {

  const router = express.Router();

  const shoeCtrl = new ShoeCtrl();
  const userCtrl = new UserCtrl();
  const companyCtrl = new CompanyCtrl();
  const classificationCtrl = new ClassificationCtrl();
  const paypalCtrl = new PaypalCtrl();
  const orderCtrl = new OrderCtrl();
  const contactUsCtrl = new ContactUsCtrl();

  // Shoes
  router.route('/shoes').get(shoeCtrl.getAll);
  router.route('/shoes/count').get(shoeCtrl.count);
  router.route('/shoes/search').post(shoeCtrl.search);
  router.route('/shoe').post(isAdmin);
  router.route('/shoe').post(shoeCtrl.insert);
  router.route('/shoe/:id').get(shoeCtrl.get);
  router.route('/shoe/:id').put(isAdmin);
  router.route('/shoe/:id').put(shoeCtrl.update);
  router.route('/shoe/:id').delete(isAdmin);
  router.route('/shoe/:id').delete(shoeCtrl.delete);

  // Classification
  router.route('/header').get(classificationCtrl.header);
  router.route('/classifications').get(classificationCtrl.getAll);
  router.route('/classifications/count').get(classificationCtrl.count);
  router.route('/classification').post(isAdmin);
  router.route('/classification').post(classificationCtrl.insert);
  router.route('/classification/:id').get(classificationCtrl.get);
  router.route('/classification/:id').put(isAdmin);
  router.route('/classification/:id').put(classificationCtrl.update);
  router.route('/classification/:id').delete(isAdmin);
  router.route('/classification/:id').delete(classificationCtrl.delete);

  // Company
  router.route('/companies').get(companyCtrl.getAll);
  router.route('/companies/count').get(companyCtrl.count);
  router.route('/company').post(isAdmin);
  router.route('/company').post(companyCtrl.insert);
  router.route('/company/:id').get(companyCtrl.get);
  router.route('/company/:id').put(isAdmin);
  router.route('/company/:id').put(companyCtrl.update);
  router.route('/company/:id').delete(isAdmin);
  router.route('/company/:id').delete(companyCtrl.delete);

  // Users
  router.route('/users').all(isAdmin);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(isAdmin);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(isAdmin);
  router.route('/user/:id').delete(userCtrl.delete);

  // auth
  router.route('/auth/login').post(userCtrl.login);
  router.route('/auth/me').get(userCtrl.me);
  router.route('/auth/signup').post(userCtrl.signup);
  router.route('/auth/facebook').get(userCtrl.facebookAuth);
  router.route('/auth/facebook/callback').get(userCtrl.facebookAuthCallback);

  // paypal
  router.route('/paypal/payment/create/:orderId').post(paypalCtrl.create);

  // orders
  router.route('/order').all(isAdmin);
  router.route('/order').get(orderCtrl.getAll);
  router.route('/order/:id').get(orderCtrl.get);
  router.route('/order').post(orderCtrl.insert);
  router.route('/order/:id/:newStatus').post(orderCtrl.statusUpdate);

  // contact us
  router.route('/contactus').post(contactUsCtrl.contactus);

  // Apply the routes to our applishoeion with the prefix /api
  app.use('/api', router);


}

function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
          return next();
      }
      res.redirect('/');
}


function isAdmin(req, res, next) {
  console.log('Check Admin');
  if (req.isAuthenticated() && req.user.role === 'admin') {
    console.log('Got Admin access :)');
      return next();
  }
  res.redirect('/');
}
