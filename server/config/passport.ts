import * as LocalStrategy from 'passport-local';
import * as FacebookStrategy from 'passport-facebook';
import * as GoogleStrategy from 'passport-google-oauth20';
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

    passport.use(new GoogleStrategy.Strategy({
        clientID     : authConfig.googleAuth.clientID,
        clientSecret : authConfig.googleAuth.clientSecret,
        callbackURL  : authConfig.googleAuth.callbackURL
    },
    async function(token, refreshToken, profile, done) {
        process.nextTick(async function() {
            try {
                console.log('[Google] profile received:', profile.id, profile.displayName);
                const email = profile.emails ? profile.emails[0].value : null;
                console.log('[Google] email:', email);

                // Returning Google user
                let user: any = await User.findOne({ 'google.id': profile.id });
                if (user) {
                    console.log('[Google] existing google user found:', user._id);
                    user.google.name = profile.displayName;
                    user.username = user.google.name;
                    return done(null, user);
                }

                // Existing account with same email — link Google to it
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        console.log('[Google] linking to existing email account:', user._id);
                        user.google.id    = profile.id;
                        user.google.token = token;
                        user.google.name  = profile.displayName;
                        user.google.email = email;
                        user.username = user.username || profile.displayName;
                        await user.save();
                        return done(null, user);
                    }
                }

                // New user
                console.log('[Google] creating new user');
                const newUser: any = new User();
                newUser.google.id    = profile.id;
                newUser.google.token = token;
                newUser.google.name  = profile.displayName;
                newUser.username     = profile.displayName;
                if (email) {
                    newUser.email        = email;
                    newUser.google.email = email;
                }
                newUser.role = 'user';
                await newUser.save();
                console.log('[Google] new user saved:', newUser._id);
                return done(null, newUser);
            } catch (err) {
                console.error('[Google] strategy error:', err);
                return done(err);
            }
        });
    }));
}
