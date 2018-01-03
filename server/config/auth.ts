import * as dotenv from 'dotenv';
dotenv.load({ path: '.env' });
const authConfig = {
        'facebookAuth' : {
            'clientID'      : process.env.FACEBOOK_APP_ID, // your App ID
            'clientSecret'  : process.env.FACEBOOK_SECRET, // your App Secret
            'callbackURL'   : process.env.FACEBOOK_CALLBACK,
            'profileURL'    : 'https://graph.facebook.com/v2.11/me?fields=first_name,last_name,email',
            'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
        },
        'twitterAuth' : {
            'consumerKey'       : 'your-consumer-key-here',
            'consumerSecret'    : 'your-client-secret-here',
            'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
        },
        'googleAuth' : {
            'clientID'      : 'your-secret-clientID-here',
            'clientSecret'  : 'your-client-secret-here',
            'callbackURL'   : 'http://localhost:8080/auth/google/callback'
        }
    };

export default authConfig;
