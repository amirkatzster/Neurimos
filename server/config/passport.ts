import * as LocalStrategy from 'passport-local';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import User from '../models/user';

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
                console.log('a');
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                console.log('b');
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                console.log('c');
                const newUser = new User();

                // set the user's local credentials
                newUser.role = 'user';
                newUser.username = req.body.username;
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                console.log(newUser);

                // save the user
                newUser.save(function(error) {
                    console.log('e');
                    if (error) {
                        console.log('f');
                        throw error;
                    }
                    console.log('g');
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
}
