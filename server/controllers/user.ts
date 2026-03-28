import * as passport from 'passport';
import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {

  model = User;

  login = (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { return res.status(401).json({ message: 'Invalid email or password' }); }
      req.logIn(user, (loginErr) => {
        if (loginErr) { return next(loginErr); }
        res.status(200).json({ message: 'Login successful' });
      });
    })(req, res, next);
  };

  me = (req, res) => {
    res.send(req.isAuthenticated() ? req.user : '0');
  };

  signup = (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { return res.status(409).json({ message: 'Email already exists' }); }
      res.status(201).json({ message: 'User created successfully' });
    })(req, res, next);
  }

  facebookAuth = (req, res, next) => {
    passport.authenticate('facebook', {
      scope : ['public_profile', 'email']
    })(req, res, next);
  }

  facebookAuthCallback = (req, res, next) => {
    passport.authenticate('facebook', (err, user) => {
      if (err || !user) { return res.redirect('/signup'); }
      req.logIn(user, (loginErr) => {
        if (loginErr) { return res.redirect('/signup'); }
        req.session.save(() => res.redirect('/?_=' + Date.now()));
      });
    })(req, res, next);
  }

  googleAuth = (req, res, next) => {
    passport.authenticate('google', {
      scope : ['profile', 'email']
    })(req, res, next);
  }

  googleAuthCallback = (req, res, next) => {
    passport.authenticate('google', (err, user) => {
      if (err || !user) { return res.redirect('/signup'); }
      req.logIn(user, (loginErr) => {
        if (loginErr) { return res.redirect('/signup'); }
        req.session.save(() => res.redirect('/?_=' + Date.now()));
      });
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
