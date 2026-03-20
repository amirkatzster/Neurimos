import * as passport from 'passport';
import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {

  model = User;

  login = (req, res) => {
    passport.authenticate('local-login', {
      successRedirect : '/',
      failureRedirect : '/login',
      failureFlash : true
    })(req, res);
  };

  me = (req, res) => {
    res.send(req.isAuthenticated() ? req.user : '0');
  };

  signup = (req, res) => {
    passport.authenticate('local-signup', {
      successRedirect : '/login',
      failureRedirect : '/signup',
      failureFlash : true
    })(req, res);
  }

  facebookAuth = (req, res, next) => {
    passport.authenticate('facebook', {
      scope : ['public_profile', 'email']
    })(req, res, next);
  }

  facebookAuthCallback = (req, res, next) => {
    passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '/signup'
    })(req, res, next);
  }

  updateAddress = async (req, res) => {
    try {
      const obj: any = await this.model.findOne({ _id: req.params.id });
      if (obj.addresses && obj.addresses.length === 0) {
        obj.addresses.push({
          address1 : req.body.address1,
          address2 : req.body.address2,
          city     : req.body.city,
          zip      : req.body.zip
        });
        await this.model.findOneAndUpdate({ _id: req.params.id }, obj);
        res.status(201).json({});
      } else {
        res.status(200).json({});
      }
    } catch (err) { console.error(err); }
  }
}
