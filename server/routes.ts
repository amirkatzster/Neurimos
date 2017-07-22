import * as express from 'express';

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
  router.route('/shoe').post(shoeCtrl.insert);
  router.route('/shoe/:id').get(shoeCtrl.get);
  router.route('/shoe/:id').put(shoeCtrl.update);
  router.route('/shoe/:id').delete(shoeCtrl.delete);

  // Company
  router.route('/companies').get(companyCtrl.getAll);
  router.route('/companies/count').get(companyCtrl.count);
  router.route('/company').post(companyCtrl.insert);
  router.route('/company/:id').get(companyCtrl.get);
  router.route('/company/:id').put(companyCtrl.update);
  router.route('/company/:id').delete(companyCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our applishoeion with the prefix /api
  app.use('/api', router);

}
