import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import User from '../models/user';
import BaseCtrl from './base';


export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    passport.authenticate('local-login', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    })(req, res);
  };

  me = (req, res) => {
     res.send(req.isAuthenticated() ? req.user : '0');
  };


  signup = (req, res) => {
    passport.authenticate('local-signup', {
      successRedirect : '/login', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  })(req, res);
  }



  facebookAuth = (req, res, next) => {
    passport.authenticate('facebook', {
      scope : ['public_profile', 'email']
    })(req, res, next)
  }

  facebookAuthCallback = (req, res, next) => {
    passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '/signup'
    })(req, res, next)
  }

}
