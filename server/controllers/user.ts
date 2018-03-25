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

  updateAddress = (req, res, next) => {
    console.log('updateAddress');
    this.model.findOne({ _id: req.params.id }, (err, obj) => {
      console.log('updateAddress2');
      console.log(obj);
      if (err) { return console.error(err); }
      if (obj.addresses && obj.addresses.length === 0) {
          const addr = {
            address1 : req.body.address1,
            address2 : req.body.address2,
            city : req.body.city,
            zip : req.body.zip
          };
          obj.addresses.push(addr);
          this.model.findOneAndUpdate({ _id: req.params.id }, obj, (err2) => {
            console.log('updateAddress3');
            if (err2) { return console.error(err2); }
            res.status(201).json({});
          });
      } else {
        res.status(200).json({});
      }
    });
  }

}
