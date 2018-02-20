import * as LocalStrategy from 'passport-local';
import * as FacebookStrategy from 'passport-facebook';
import User from '../models/user';
import authConfig from './auth';

// expose this function to our app using module.exports
// module.exports = function(passport) {
export default function setPassport(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('serializeUser' + user);
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser' + id);
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        process.nextTick(function() {

            User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                const newUser = new User();

                // set the user's local credentials
                newUser.role = 'user';
                newUser.username = req.body.username;
                newUser.email    = email;
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(error) {
                    if (error) {
                        throw error;
                    }
                    return done(null, newUser);
                });
            }
        });
        });
    }));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                return done(err);
            }

            // if no user is found, return the message
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }

            // all is well, return successful user
            return done(null, user);
        });

    }));

    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : authConfig.facebookAuth.clientID,
        clientSecret    : authConfig.facebookAuth.clientSecret,
        callbackURL     : authConfig.facebookAuth.callbackURL,
        profileFields   : authConfig.facebookAuth.profileFields
    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err) {
                    return done(err);
                }
                // if the user is found, then log them in
                if (user) {
                    console.log('login FB existing user');
                    user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    user.username = user.facebook.name;
                    return done(null, user); // user found, return that user
                } else {
                    console.log('login FB new user');
                    // if there is no user found with that facebook id, create them
                    const newUser  = new User();
                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.username = newUser.facebook.name;
                    newUser.email    = profile.emails[0].value;
                    newUser.role = 'user';
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    // save our user to the database
                    newUser.save(function(error) {
                        if (error) {
                            done(error);
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
}
