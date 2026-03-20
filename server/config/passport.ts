import * as LocalStrategy from 'passport-local';
import * as FacebookStrategy from 'passport-facebook';
import User from '../models/user';
import authConfig from './auth';

export default function setPassport(passport) {

    passport.serializeUser(function(user, done) {
        console.log('serializeUser' + user);
        done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
        console.log('deserializeUser' + id);
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) { done(err); }
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    async function(req, email, password, done) {
        process.nextTick(async function() {
            try {
                const user = await User.findOne({ 'local.email': email });
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                }
                const newUser: any = new User();
                newUser.role = 'user';
                newUser.username = req.body.username;
                newUser.email    = email;
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                await newUser.save();
                return done(null, newUser);
            } catch (err) { return done(err); }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    async function(req, email, password, done) {
        try {
            const user: any = await User.findOne({ 'local.email': email });
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            return done(null, user);
        } catch (err) { return done(err); }
    }));

    passport.use(new FacebookStrategy({
        clientID        : authConfig.facebookAuth.clientID,
        clientSecret    : authConfig.facebookAuth.clientSecret,
        callbackURL     : authConfig.facebookAuth.callbackURL,
        profileFields   : authConfig.facebookAuth.profileFields
    },
    async function(token, refreshToken, profile, done) {
        process.nextTick(async function() {
            try {
                let user: any = await User.findOne({ 'facebook.id': profile.id });
                if (user) {
                    console.log('login FB existing user');
                    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.username = user.facebook.name;
                    return done(null, user);
                }
                console.log('login FB new user');
                const newUser: any = new User();
                newUser.facebook.id    = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.username = newUser.facebook.name;
                if (profile.emails) {
                    newUser.email          = profile.emails[0].value;
                    newUser.facebook.email = profile.emails[0].value;
                }
                newUser.role = 'user';
                await newUser.save();
                return done(null, newUser);
            } catch (err) { return done(err); }
        });
    }));
}
